'use strict';
// Lädt die Bibliothek und prüft sie streng. Ein Fehler in den Daten bricht ab, statt still falsch zu rechnen.
const fs = require('fs');
const path = require('path');

const STUFEN = ['pflicht', 'vermutungswirkung', 'empfehlung'];
const BELEG = ['geprueft', 'offen', 'ohne-beleg'];
const FREIGABE = ['entwurf', 'geprueft', 'gesperrt'];
const ART = ['S', 'T', 'O', 'P'];
const TYPEN = ['material', 'vorgang', 'ausfuehrung', 'umgebung'];
const PRAEFIX = { material: 'm.', vorgang: 'v.', ausfuehrung: 'a.', umgebung: 'u.' };

// Fingerabdruck: ändert sich, sobald sich fachlich etwas an Regel oder Pflicht ändert. Fundstellen zählen nicht mit.
function fingerabdruck(e) {
  const kern = e.massnahmen
    ? { wenn: e.wenn, entsteht: e.entsteht, gefaehrdung: e.gefaehrdung, verbindlichkeit: e.verbindlichkeit, massnahmen: e.massnahmen.map(m => [m.id, m.art, m.text, m.grundlage || '']) }
    : { wenn: e.wenn, pflicht: e.pflicht };
  const s = JSON.stringify(kern); let a = 0x811c9dc5, b = 0x1b873593;
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); a = Math.imul(a ^ c, 0x01000193); b = Math.imul(b ^ c, 0x85ebca6b) ^ (b >>> 13); }
  return (a >>> 0).toString(16).padStart(8, '0') + (b >>> 0).toString(16).padStart(8, '0');
}

// Beleg und Freigabe gelten nur für genau den Stand, der geprüft wurde.
function pruefeStand(e, p, f, quellen) {
  if (e.belegstand) {
    if (e.beleg !== 'geprueft') f.push(`${p}: Belegstand vorhanden, aber Beleg nicht geprüft`);
    else if (e.belegstand.fingerabdruck !== fingerabdruck(e)) f.push(`${p}: nach der Beleg-Prüfung geändert. Beleg zurücksetzen mit: node beleg/stand.js --bereinigen`);
  }
  if (e.freigabe === 'geprueft') {
    if (!e.freigegeben || !e.freigegeben.von) f.push(`${p}: freigegeben, aber ohne Angabe, wer freigegeben hat`);
    else if (e.freigegeben.fingerabdruck !== fingerabdruck(e)) f.push(`${p}: nach der Freigabe geändert. Freigabe zurücksetzen mit: node beleg/stand.js --bereinigen`);
    if (!e.belegstand || e.belegstand.pruefungen < 2) f.push(`${p}: freigegeben ohne doppelt geprüften Beleg`);
  }
  for (const m of e.massnahmen || []) {
    if (m.grundlage !== undefined && m.grundlage !== 'erfahrung') f.push(`${p}: Maßnahme ${m.id} hat unbekannte Grundlage ${m.grundlage}`);
    if (m.beleg && !quellen.has(m.beleg.quelle)) f.push(`${p}: Maßnahme ${m.id} verweist auf unbekannte Quelle ${m.beleg.quelle}`);
  }
}

function lies(ordner, name) {
  return JSON.parse(fs.readFileSync(path.join(ordner, name + '.json'), 'utf8'));
}

function doppelte(liste) {
  const gesehen = new Set(), dop = new Set();
  for (const x of liste) (gesehen.has(x) ? dop : gesehen).add(x);
  return [...dop];
}

function atome(ausdruck, pfad, fehler, sammel) {
  if (ausdruck === 'immer') return;
  if (typeof ausdruck === 'string') { sammel.merkmale.add(ausdruck); return; }
  if (!ausdruck || typeof ausdruck !== 'object' || Array.isArray(ausdruck)) { fehler.push(`${pfad}: Bedingung ist weder Merkmal noch Objekt`); return; }
  const schluessel = Object.keys(ausdruck);
  if ('angabe' in ausdruck) {
    const ok = schluessel.every(k => ['angabe', 'ist', 'ab', 'bis'].includes(k)) && schluessel.length === 2;
    if (!ok) fehler.push(`${pfad}: Angabe-Bedingung braucht genau eines von ist, ab, bis`);
    sammel.angaben.add(ausdruck.angabe); return;
  }
  if (schluessel.length !== 1) { fehler.push(`${pfad}: genau ein Operator erlaubt, gefunden ${schluessel.join(', ')}`); return; }
  const op = schluessel[0], wert = ausdruck[op];
  if (op === 'alle' || op === 'eine') {
    if (!Array.isArray(wert) || wert.length === 0) { fehler.push(`${pfad}: ${op} braucht eine nicht leere Liste`); return; }
    wert.forEach((w, i) => atome(w, `${pfad}.${op}[${i}]`, fehler, sammel));
  } else if (op === 'nicht') atome(wert, `${pfad}.nicht`, fehler, sammel);
  else fehler.push(`${pfad}: unbekannter Operator ${op}`);
}

function pruefe(b) {
  const f = [];
  const merkmale = new Set(Object.keys(b.merkmale));
  const angaben = new Map(b.angaben.map(a => [a.id, a]));
  const quellen = new Map(b.quellen.map(q => [q.id, q]));
  const gef = new Map(b.gefaehrdungen.map(g => [g.id, g]));

  for (const d of doppelte(b.angaben.map(a => a.id))) f.push(`angaben: Kennung doppelt ${d}`);
  for (const a of b.angaben) if (!['ja_nein', 'zahl'].includes(a.typ)) f.push(`angaben ${a.id}: unbekannter Typ ${a.typ}`);
  for (const d of doppelte(b.quellen.map(q => q.id))) f.push(`quellen: Kennung doppelt ${d}`);
  for (const q of b.quellen) if (!STUFEN.includes(q.stufe)) f.push(`quellen ${q.id}: unbekannte Stufe ${q.stufe}`);
  for (const d of doppelte(b.gefaehrdungen.map(g => g.id))) f.push(`gefaehrdungen: Kennung doppelt ${d}`);
  const faktNr = new Set(((b.faktoren || {}).faktoren || []).map(x => x.nr));
  if (b.faktoren && faktNr.size !== 11) f.push('faktoren: Es müssen genau elf Gefährdungsfaktoren sein');
  for (const g of b.gefaehrdungen) if (!(Number.isInteger(g.faktor) && g.faktor >= 1 && g.faktor <= 11) || (b.faktoren && !faktNr.has(g.faktor))) f.push(`gefaehrdungen ${g.id}: Faktor muss 1 bis 11 sein`);

  for (const typ of TYPEN) {
    const liste = b.stammdaten[typ];
    if (!Array.isArray(liste)) { f.push(`stammdaten: ${typ} fehlt`); continue; }
    for (const d of doppelte(liste.map(x => x.id))) f.push(`stammdaten ${typ}: Kennung doppelt ${d}`);
    for (const x of liste) for (const m of x.merkmale) {
      if (!merkmale.has(m)) f.push(`stammdaten ${typ}/${x.id}: unbekanntes Merkmal ${m}`);
      else if (!m.startsWith(PRAEFIX[typ])) f.push(`stammdaten ${typ}/${x.id}: Merkmal ${m} gehört nicht zu ${typ}`);
    }
  }

  const verwendet = new Set();
  for (const d of doppelte(b.regeln.map(r => r.id))) f.push(`regeln: Kennung doppelt ${d}`);
  for (const d of doppelte(b.regeln.flatMap(r => (r.massnahmen || []).map(m => m.id)))) f.push(`regeln: Maßnahmen-Kennung doppelt ${d}`);
  for (const r of b.regeln) {
    const p = `regel ${r.id}`;
    for (const feld of ['id', 'name', 'wenn', 'entsteht', 'gefaehrdung', 'massnahmen', 'quellen', 'verbindlichkeit', 'beleg', 'freigabe'])
      if (r[feld] === undefined) f.push(`${p}: Feld ${feld} fehlt`);
    if (!gef.has(r.gefaehrdung)) f.push(`${p}: unbekannte Gefährdung ${r.gefaehrdung}`);
    if (!STUFEN.includes(r.verbindlichkeit)) f.push(`${p}: unbekannte Verbindlichkeit ${r.verbindlichkeit}`);
    if (!BELEG.includes(r.beleg)) f.push(`${p}: unbekannter Belegstatus ${r.beleg}`);
    if (!FREIGABE.includes(r.freigabe)) f.push(`${p}: unbekannte Freigabe ${r.freigabe}`);
    if (!Array.isArray(r.massnahmen) || r.massnahmen.length === 0) f.push(`${p}: keine Maßnahme`);
    for (const m of r.massnahmen || []) {
      if (!ART.includes(m.art)) f.push(`${p}: Maßnahme ${m.id} hat unbekannte Art ${m.art}`);
      if (!m.id.startsWith(r.id + '-')) f.push(`${p}: Maßnahmen-Kennung ${m.id} passt nicht zur Regel`);
    }
    for (const q of r.quellen || []) if (!quellen.has(q.id)) f.push(`${p}: unbekannte Quelle ${q.id}`);
    if (r.beleg !== 'ohne-beleg' && (r.quellen || []).length === 0) f.push(`${p}: ohne Quelle, aber nicht als ohne-beleg markiert`);
    if (r.beleg === 'ohne-beleg' && (r.quellen || []).length > 0) f.push(`${p}: als ohne-beleg markiert, hat aber Quellen`);
    if (r.beleg === 'geprueft' && (r.quellen || []).some(q => !q.stelle)) f.push(`${p}: Beleg geprüft, aber eine Fundstelle fehlt`);
    if (r.freigabe === 'geprueft' && r.beleg !== 'geprueft') f.push(`${p}: freigegeben ohne geprüften Beleg`);
    pruefeStand(r, p, f, quellen);
    const sammel = { merkmale: new Set(), angaben: new Set() };
    atome(r.wenn, `${p}.wenn`, f, sammel);
    for (const m of sammel.merkmale) { if (!merkmale.has(m)) f.push(`${p}: unbekanntes Merkmal ${m}`); verwendet.add(m); }
    for (const a of [...sammel.angaben, ...(r.braucht || [])]) if (!angaben.has(a)) f.push(`${p}: unbekannte Angabe ${a}`);
  }
  // Organisationspflichten
  for (const d of doppelte((b.pflichten || []).map(x => x.id))) f.push(`pflichten: Kennung doppelt ${d}`);
  for (const x of b.pflichten || []) {
    const p = `pflicht ${x.id}`;
    for (const feld of ['id', 'name', 'wenn', 'pflicht', 'nachweis', 'quellen', 'beleg', 'freigabe']) if (x[feld] === undefined) f.push(`${p}: Feld ${feld} fehlt`);
    if (!BELEG.includes(x.beleg)) f.push(`${p}: unbekannter Belegstatus ${x.beleg}`);
    if (!FREIGABE.includes(x.freigabe)) f.push(`${p}: unbekannte Freigabe ${x.freigabe}`);
    for (const q of x.quellen || []) if (!quellen.has(q.id)) f.push(`${p}: unbekannte Quelle ${q.id}`);
    if (!(x.quellen || []).length) f.push(`${p}: ohne Quelle`);
    if (x.beleg === 'geprueft' && (x.quellen || []).some(q => !q.stelle)) f.push(`${p}: Beleg geprüft, aber eine Fundstelle fehlt`);
    if (x.freigabe === 'geprueft' && x.beleg !== 'geprueft') f.push(`${p}: freigegeben ohne geprüften Beleg`);
    pruefeStand(x, p, f, quellen);
    const sammel = { merkmale: new Set(), angaben: new Set() };
    atome(x.wenn, `${p}.wenn`, f, sammel);
    for (const m of sammel.merkmale) { if (!merkmale.has(m)) f.push(`${p}: unbekanntes Merkmal ${m}`); verwendet.add(m); }
    for (const a of sammel.angaben) { if (!angaben.has(a)) f.push(`${p}: unbekannte Angabe ${a}`); else if (angaben.get(a).ebene !== 'betrieb') f.push(`${p}: Angabe ${a} ist keine Betriebsangabe`); }
  }
  // Wörterbuch
  const idx = {}; for (const t of TYPEN) idx[t] = new Set((b.stammdaten[t] || []).map(x => x.id));
  const worte = (b.woerterbuch || []).flatMap(w => w.worte || []);
  for (const d of doppelte(worte)) f.push(`woerterbuch: Wort doppelt ${d}`);
  for (const w of b.woerterbuch || []) {
    const p = `woerterbuch ${(w.worte || [])[0]}`;
    if (!Array.isArray(w.worte) || !w.worte.length) f.push('woerterbuch: Eintrag ohne Worte');
    for (const x of w.worte || []) if (x !== x.toLowerCase()) f.push(`${p}: Worte klein schreiben (${x})`);
    if (w.vorgang && !idx.vorgang.has(w.vorgang)) f.push(`${p}: unbekannter Vorgang ${w.vorgang}`);
    if (w.ausfuehrung && !idx.ausfuehrung.has(w.ausfuehrung)) f.push(`${p}: unbekannte Ausführung ${w.ausfuehrung}`);
    for (const m of w.material || []) if (!idx.material.has(m)) f.push(`${p}: unbekanntes Material ${m}`);
    for (const u of w.umgebung || []) if (!idx.umgebung.has(u)) f.push(`${p}: unbekannte Umgebung ${u}`);
    for (const a of Object.keys(w.angabe || {})) if (!angaben.has(a)) f.push(`${p}: unbekannte Angabe ${a}`);
  }
  const vergeben = new Set(TYPEN.flatMap(t => (b.stammdaten[t] || []).flatMap(x => x.merkmale)));
  const hinweise = [];
  for (const m of verwendet) if (!vergeben.has(m)) hinweise.push(`Merkmal ${m} steht in einer Regel, wird aber von keinem Stammdatum getragen`);
  for (const m of merkmale) if (!verwendet.has(m)) hinweise.push(`Merkmal ${m} wird von keiner Regel genutzt`);
  return { fehler: f, hinweise };
}

function ladeBibliothek(ordner) {
  const b = {};
  for (const n of ['merkmale', 'angaben', 'stammdaten', 'quellen', 'gefaehrdungen', 'faktoren', 'regeln', 'pflichten', 'woerterbuch']) b[n] = lies(ordner, n);
  const { fehler, hinweise } = pruefe(b);
  if (fehler.length) { const e = new Error('Bibliothek fehlerhaft:\n- ' + fehler.join('\n- ')); e.fehler = fehler; throw e; }
  b.hinweise = hinweise;
  return b;
}

function pruefeFall(b, fall) {
  const f = [];
  const index = {}; for (const t of TYPEN) index[t] = new Map(b.stammdaten[t].map(x => [x.id, x]));
  const angaben = new Map(b.angaben.map(a => [a.id, a]));
  const pruefAngaben = (obj, wo) => { for (const [k, v] of Object.entries(obj || {})) {
    const a = angaben.get(k);
    if (!a) f.push(`${wo}: unbekannte Angabe ${k}`);
    else if (a.typ === 'ja_nein' && typeof v !== 'boolean') f.push(`${wo}: Angabe ${k} muss ja oder nein sein`);
    else if (a.typ === 'zahl' && typeof v !== 'number') f.push(`${wo}: Angabe ${k} muss eine Zahl sein`);
  } };
  pruefAngaben(fall.angaben, 'Fall');
  for (const [k, v] of Object.entries(fall.betrieb || {})) {
    const a = angaben.get(k);
    if (!a || a.ebene !== 'betrieb') f.push(`Betrieb: ${k} ist keine Betriebsangabe`);
    else if (v !== null && a.typ === 'ja_nein' && typeof v !== 'boolean') f.push(`Betrieb: ${k} muss ja oder nein sein`);
    else if (v !== null && a.typ === 'zahl' && typeof v !== 'number') f.push(`Betrieb: ${k} muss eine Zahl sein`);
  }
  const gefIds = new Set(b.gefaehrdungen.map(g => g.id));
  for (const d of doppelte((fall.stoffe || []).map(s => s.id))) f.push(`Stoff ${d} doppelt`);
  for (const st of fall.stoffe || []) {
    const wo = `Stoff ${st.id}`;
    const mat = index.material.get(st.material);
    if (!mat) f.push(`${wo}: unbekanntes Material ${st.material}`);
    else if (!mat.merkmale.includes('m.gefahrstoff')) f.push(`${wo}: Material ${st.material} ist kein Gefahrstoff-Stammdatum`);
    if (!Array.isArray(st.h)) f.push(`${wo}: Liste der H-Sätze fehlt`);
    for (const h of st.h || []) if (!/^H[2-4]\d\d[A-Za-z]*$/.test(h)) f.push(`${wo}: ${h} ist kein H-Satz`);
    for (const h of st.euh || []) if (!/^EUH\d{3}[A-Z]?$/.test(h)) f.push(`${wo}: ${h} ist kein EUH-Satz`);
    if (st.sdb && !/^\d{4}-\d{2}-\d{2}$/.test(st.sdb.datum || '')) f.push(`${wo}: Datum des Sicherheitsdatenblatts fehlt oder hat nicht die Form JJJJ-MM-TT`);
    if (!st.sdb && (st.h || []).length) f.push(`${wo}: H-Sätze ohne Sicherheitsdatenblatt`);
  }
  for (const d of doppelte(fall.stationen.map(s => s.nr))) f.push(`Station ${d} doppelt`);
  for (const s of fall.stationen) {
    const wo = `Station ${s.nr}`;
    for (const u of s.umgebung || []) if (!index.umgebung.has(u)) f.push(`${wo}: unbekannte Umgebung ${u}`);
    pruefAngaben(s.angaben, wo);
    if (s.personen !== undefined && s.personen !== null && typeof s.personen !== 'number') f.push(`${wo}: Personenzahl muss eine Zahl sein`);
    for (const o of s.beobachtungen || []) {
      if (!o.text) f.push(`${wo}: Beobachtung ohne Text`);
      if (o.gefaehrdung && !gefIds.has(o.gefaehrdung)) f.push(`${wo}: Beobachtung verweist auf unbekannte Gefährdung ${o.gefaehrdung}`);
    }
    if (!Array.isArray(s.schritte) || !s.schritte.length) f.push(`${wo}: kein Schritt`);
    (s.schritte || []).forEach((x, i) => {
      if (!index.vorgang.has(x.vorgang)) f.push(`${wo} Schritt ${i + 1}: unbekannter Vorgang ${x.vorgang}`);
      if (!index.ausfuehrung.has(x.ausfuehrung)) f.push(`${wo} Schritt ${i + 1}: unbekannte Ausführung ${x.ausfuehrung}`);
      for (const m of x.material || []) if (!index.material.has(m)) f.push(`${wo} Schritt ${i + 1}: unbekanntes Material ${m}`);
      pruefAngaben(x.angaben, `${wo} Schritt ${i + 1}`);
      for (const id of x.stoffe || []) if (!(fall.stoffe || []).some(st => st.id === id)) f.push(`${wo} Schritt ${i + 1}: unbekannter Stoff ${id}`);
    });
  }
  if (f.length) { const e = new Error('Fall fehlerhaft:\n- ' + f.join('\n- ')); e.fehler = f; throw e; }
}

module.exports = { ladeBibliothek, pruefe, pruefeFall, fingerabdruck, TYPEN };
