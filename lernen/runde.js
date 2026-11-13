#!/usr/bin/env node
'use strict';
// Die Runden-Maschine: legt eine Runde an, schreibt die fertigen Aufträge für die Agenten, prüft jede Stufe und wertet aus.
//   node lernen/runde.js neu pruef|lern [--anzahl 8]   Runde anlegen, Aufträge schreiben
//   node lernen/runde.js pruefen R004 [Kennung …]      prüft, was da ist, und nennt die Stufe
//   node lernen/runde.js system R004                   Fälle rechnen und Systemlisten für den Schiedsrichter schreiben
//   node lernen/runde.js auswerten R004                Bericht schreiben und in den Verlauf eintragen
//   node lernen/runde.js geschlossen R004              vermerken, dass die Lücken der Runde bearbeitet sind
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const WURZEL = path.join(__dirname, '..'); const RUNDEN = path.join(__dirname, 'runden');
const lies = p => JSON.parse(fs.readFileSync(p, 'utf8')); const gibt = p => fs.existsSync(p);
const schreib = (p, d) => fs.writeFileSync(p, typeof d === 'string' ? d : JSON.stringify(d, null, 1) + '\n');
const kompakt = s => String(s).toLowerCase().replace(/[^a-z0-9äöüß]/g, '');
const VERLAUF = path.join(__dirname, 'verlauf.json'), ABDECKUNG = path.join(__dirname, 'abdeckung.json');
const FAKTOREN = lies(path.join(WURZEL, 'bibliothek', 'faktoren.json')).faktoren;

// Wählt Aufträge so, dass schwache und selten geprüfte Faktoren Vorrang haben und die Branchen gemischt sind. Gleiches Eingangsmaterial ergibt dieselbe Auswahl.
function waehle(pool, verlauf, anzahl) {
  const st = {}; for (const r of verlauf) for (const [k, v] of Object.entries(r.jeFaktor || {})) { const s = st[k] = st[k] || { g: 0, v: 0 }; s.g += v.getroffen; s.v += v.verfehlt; }
  const w = {}; for (const f of FAKTOREN) { const s = st[f.nr] || { g: 0, v: 0 }; w[f.nr] = (s.v + 2) / (s.g + s.v + 4) + 1 / (1 + (s.g + s.v) / 10); }
  const frei = pool.filter(a => !a.genutzt && a.feld !== 'ausserhalb'); const wahl = [], jeGruppe = {};
  while (wahl.length < anzahl && frei.length) {
    const max = Math.max(1, Math.ceil(anzahl / 4));
    let kand = frei.filter(a => (jeGruppe[a.gruppe] || 0) < max); if (!kand.length) kand = frei;
    kand.sort((x, y) => (jeGruppe[x.gruppe] || 0) - (jeGruppe[y.gruppe] || 0) || punkte(y) - punkte(x) || x.id.localeCompare(y.id));
    const a = kand[0]; wahl.push(a); frei.splice(frei.indexOf(a), 1); jeGruppe[a.gruppe] = (jeGruppe[a.gruppe] || 0) + 1; for (const f of a.faktoren) w[f] *= 0.7;
  }
  return wahl;
  function punkte(a) { return a.faktoren.reduce((n, f) => n + w[f], 0) / a.faktoren.length; }
}

function neu(art, anzahl) {
  if (!['pruef', 'lern'].includes(art)) throw new Error('Art der Runde: pruef oder lern');
  const verlauf = lies(VERLAUF), abd = lies(ABDECKUNG);
  const nr = 'R' + String(fs.readdirSync(RUNDEN).filter(x => /^R\d{3}$/.test(x)).length + 1).padStart(3, '0'); const o = path.join(RUNDEN, nr);
  const wahl = waehle(abd.auftraege, verlauf, anzahl); if (wahl.length < anzahl) throw new Error('Zu wenig freie Aufträge in lernen/abdeckung.json');
  for (const u of ['protokolle', 'wahrheit', 'faelle', 'system', 'urteil', 'auftraege']) fs.mkdirSync(path.join(o, u), { recursive: true });
  const auftraege = wahl.map((a, i) => ({ kennung: `${nr}-${String(i + 1).padStart(2, '0')}`, auftrag: a.id, branche: a.branche, bereich: a.bereich }));
  for (const a of wahl) a.genutzt = nr;
  schreib(ABDECKUNG, '{\n "hinweis": ' + JSON.stringify(abd.hinweis) + ',\n "auftraege": [\n' + abd.auftraege.map(p => '  ' + JSON.stringify(p)).join(',\n') + '\n ]\n}\n');
  schreib(path.join(o, 'auftrag.json'), { runde: nr, art, blind: true, feld: 'bghm', auftraege });
  const teile = (liste, g) => Array.from({ length: Math.ceil(liste.length / g) }, (_, i) => liste.slice(i * g, i * g + g));
  const haelften = teile(auftraege, 4); // je Agent höchstens vier Arbeitsplätze
  const pr = k => `cd ${WURZEL} && node lernen/runde.js pruefen ${nr} ${k.map(a => a.kennung).join(' ')}`;
  haelften.forEach((h, i) => {
    schreib(path.join(o, 'auftraege', `sprecher-${i + 1}.md`), [`# Auftrag Sprecher ${i + 1}, Runde ${nr}`, '',
      `Lies zuerst deine Arbeitsanweisung vollständig: \`${path.join(WURZEL, 'agenten', 'sprecher.md')}\``, '', 'Deine Aufträge:', '',
      ...h.map(a => `- Kennung \`${a.kennung}\`: Branche „${a.branche}“, Bereich „${a.bereich}“`), '', 'Die elf Gefährdungsfaktoren:', '', ...FAKTOREN.map(f => `${f.nr}. ${f.name}`), '',
      `Schreibe je Auftrag: \`${path.join(o, 'protokolle')}/<Kennung>.md\` und \`${path.join(o, 'wahrheit')}/<Kennung>.json\`.`,
      `Prüfe zum Schluss mit: \`${pr(h)}\` und bessere nach, bis für deine Kennungen in den Abschnitten Protokoll und Wahrheit nichts mehr gemeldet wird. Meldungen zu späteren Stufen (Fall, Urteil) betreffen dich nicht.`, '',
      `Lies nichts unter \`${path.join(WURZEL, 'bibliothek')}\`, keine anderen Runden und keine Dateien anderer Kennungen. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: Arbeitsplatz und Zahl der Gefährdungen.`, ''].join('\n'));
    schreib(path.join(o, 'auftraege', `uebersetzer-${i + 1}.md`), [`# Auftrag Übersetzer ${i + 1}, Runde ${nr}`, '',
      `Lies zuerst deine Arbeitsanweisung vollständig: \`${path.join(WURZEL, 'agenten', 'uebersetzer.md')}\``, '', 'Deine Protokolle:', '',
      ...h.map(a => `- \`${path.join(o, 'protokolle', a.kennung + '.md')}\` → Fall \`${path.join(o, 'faelle', a.kennung + '.json')}\` mit \`"id":"${a.kennung}"\``), '',
      `Erlaubte Nachschlagedateien: \`${path.join(WURZEL, 'bibliothek')}/stammdaten.json\`, \`woerterbuch.json\`, \`angaben.json\`.`,
      `Prüfe jeden Fall mit \`cd ${WURZEL} && node lernen/pruefe-fall.js <Falldatei>\`, bis „in Ordnung“ erscheint.`, '',
      `Lies nicht: \`${path.join(o, 'wahrheit')}\`, \`regeln.json\`, \`gefaehrdungen.json\`, andere Runden. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: Zahl der Schritte, Wünsche und Mängel.`, ''].join('\n'));
  });
  teile(auftraege, 8).forEach((auftraege, si) => schreib(path.join(o, 'auftraege', `schiedsrichter-${si + 1}.md`), [`# Auftrag Schiedsrichter ${si + 1}, Runde ${nr}`, '',
    `Lies zuerst deine Arbeitsanweisung vollständig: \`${path.join(WURZEL, 'agenten', 'schiedsrichter.md')}\``, '', 'Beurteile diese Arbeitsplätze, jeden für sich:', '',
    ...auftraege.map(a => `- \`${a.kennung}\`: Protokoll \`${path.join(o, 'protokolle', a.kennung + '.md')}\`, Wahrheit \`${path.join(o, 'wahrheit', a.kennung + '.json')}\`, Systemliste \`${path.join(o, 'system', a.kennung + '.json')}\` → Urteil \`${path.join(o, 'urteil', a.kennung + '.json')}\``), '',
    'Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.',
    'Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.',
    `Prüfe zum Schluss mit: \`cd ${WURZEL} && node lernen/runde.js pruefen ${nr} ${auftraege.map(a => a.kennung).join(' ')}\` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.`, '',
    'Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.', ''].join('\n')));
  console.log(`${nr} (${art === 'pruef' ? 'Prüfrunde' : 'Lernrunde'}) angelegt mit ${auftraege.length} Arbeitsplätzen:`); for (const a of auftraege) console.log(`  ${a.kennung}  ${a.branche}: ${a.bereich}`);
  console.log(`Aufträge: ${path.join(o, 'auftraege')}`); return nr;
}

// Prüft alles, was in einer Runde schon da ist. Rückgabe: Stufe und Meldungen je Abschnitt.
function stand(nr, nur) {
  const o = path.join(RUNDEN, nr); const auftrag = gibt(path.join(o, 'auftrag.json')) ? lies(path.join(o, 'auftrag.json')) : null;
  if (!auftrag) return { nr, alt: true, stufe: gibt(path.join(o, 'ergebnis.json')) ? 'ausgewertet' : 'unbekannt', meldungen: {} };
  const ks = auftrag.auftraege.map(a => a.kennung).filter(k => !nur || !nur.length || nur.includes(k));
  const m = { protokoll: [], wahrheit: [], fall: [], system: [], urteil: [] }; const fertig = { protokoll: 0, wahrheit: 0, fall: 0, system: 0, urteil: 0 };
  let pruefeFall, b; const lade = () => { if (!b) { const l = require('../kern/laden'); b = l.ladeBibliothek(path.join(WURZEL, 'bibliothek')); pruefeFall = l.pruefeFall; } };
  for (const k of ks) {
    const pp = path.join(o, 'protokolle', k + '.md'), wp = path.join(o, 'wahrheit', k + '.json'), fp = path.join(o, 'faelle', k + '.json'), sp = path.join(o, 'system', k + '.json'), up = path.join(o, 'urteil', k + '.json');
    let prot = null, wahr = null, sys = null;
    if (!gibt(pp)) m.protokoll.push(`${k}: Protokoll fehlt`); else { prot = fs.readFileSync(pp, 'utf8'); const n = prot.trim().split(/\s+/).length; let ok = true;
      if (n < 130 || n > 300) { ok = false; m.protokoll.push(`${k}: ${n} Wörter, verlangt sind 150 bis 250`); }
      if (/\b(GmbH|AG|KG|OHG|e\.K\.)\b/.test(prot)) { ok = false; m.protokoll.push(`${k}: enthält eine Firmenbezeichnung`); }
      if (/^\s*(#|[-*] )/m.test(prot)) { ok = false; m.protokoll.push(`${k}: enthält Überschriften oder Listen`); } if (ok) fertig.protokoll++; }
    if (!gibt(wp)) m.wahrheit.push(`${k}: Wahrheit fehlt`); else try { wahr = lies(wp); const f = [];
      if (wahr.id !== k) f.push('Kennung stimmt nicht'); if (!wahr.branche || !wahr.arbeitsplatz) f.push('branche oder arbeitsplatz fehlt');
      const g = wahr.gefaehrdungen || []; if (g.length < 4 || g.length > 8) f.push(`${g.length} Gefährdungen, verlangt sind 4 bis 8`);
      g.forEach((x, i) => { if (!x.text) f.push(`Nr. ${i + 1}: Text fehlt`); if (!(Number.isInteger(x.faktor) && x.faktor >= 1 && x.faktor <= 11)) f.push(`Nr. ${i + 1}: Faktor muss 1 bis 11 sein`);
        if (x.bibliothek) f.push(`Nr. ${i + 1}: Feld bibliothek darf in blinden Runden nicht gesetzt sein`);
        if (!x.anlass || kompakt(x.anlass).length < 12) f.push(`Nr. ${i + 1}: Anlass fehlt oder ist zu kurz`); else if (prot && !kompakt(prot).includes(kompakt(x.anlass))) f.push(`Nr. ${i + 1}: Anlass steht nicht wörtlich im Protokoll („${x.anlass.slice(0, 50)}…“)`); });
      if (f.length) m.wahrheit.push(...f.map(x => `${k}: ${x}`)); else fertig.wahrheit++; } catch (x) { wahr = null; m.wahrheit.push(`${k}: kein gültiges JSON (${x.message})`); }
    if (!gibt(fp)) m.fall.push(`${k}: Fall fehlt`); else try { lade(); const fall = lies(fp); if (fall.id !== k) throw new Error('Kennung stimmt nicht'); pruefeFall(b, fall); fertig.fall++; } catch (x) { m.fall.push(`${k}: ${x.message.replace(/\n- /g, '; ')}`); }
    if (!gibt(sp)) m.system.push(`${k}: Systemliste fehlt`); else { sys = lies(sp); fertig.system++; }
    if (!gibt(up)) m.urteil.push(`${k}: Urteil fehlt`); else try { const u = lies(up); const f = []; if (u.id !== k) f.push('Kennung stimmt nicht');
      const n = wahr ? wahr.gefaehrdungen.length : 0; const nrn = (u.wahrheit || []).map(x => x.nr);
      for (let i = 1; i <= n; i++) if (!nrn.includes(i)) f.push(`Wahrheit Nr. ${i} hat kein Urteil`);
      for (const x of u.wahrheit || []) if (!['getroffen', 'rueckfrage', 'verfehlt', 'unbegruendet'].includes(x.urteil)) f.push(`Nr. ${x.nr}: unbekanntes Urteil ${x.urteil}`);
      for (const x of u.zusaetzlich || []) if (!['berechtigt', 'unbegruendet'].includes(x.urteil)) f.push(`Zusatz ${x.gefaehrdung}: unbekanntes Urteil ${x.urteil}`);
      if (sys) { const namen = sys.gefaehrdungen.map(x => x.gefaehrdung); const zugeordnet = new Set((u.wahrheit || []).filter(x => x.urteil === 'getroffen').map(x => x.system)); const zus = new Set((u.zusaetzlich || []).map(x => x.gefaehrdung));
        for (const x of (u.wahrheit || []).filter(y => y.urteil === 'getroffen')) if (!namen.includes(x.system)) f.push(`Nr. ${x.nr}: „${x.system}“ steht nicht unter gefaehrdungen der Systemliste (Name genau übernehmen)`);
        for (const x of namen) if (!zugeordnet.has(x) && !zus.has(x)) f.push(`Systemfund „${x}“ ist weder Treffer noch unter zusaetzlich beurteilt`);
        for (const x of zus) if (!namen.includes(x)) f.push(`Zusatz „${x}“ steht nicht in der Systemliste`); else if (zugeordnet.has(x)) f.push(`„${x}“ ist zugleich Treffer und Zusatzfund`); }
      if (f.length) m.urteil.push(...f.map(x => `${k}: ${x}`)); else fertig.urteil++; } catch (x) { m.urteil.push(`${k}: kein gültiges JSON (${x.message})`); }
  }
  const n = ks.length; const verlauf = lies(VERLAUF).find(v => v.runde === nr);
  const stufe = fertig.protokoll < n || fertig.wahrheit < n ? 'sprecher' : fertig.fall < n ? 'uebersetzer' : fertig.system < n ? 'system' : fertig.urteil < n ? 'schiedsrichter' : !verlauf ? 'auswerten' : !verlauf.geschlossen ? 'luecken' : 'fertig';
  return { nr, art: auftrag.art, stufe, fertig, anzahl: n, meldungen: m };
}

function system(nr) { console.log(execFileSync('node', [path.join(__dirname, 'systemliste.js'), path.join(RUNDEN, nr)], { encoding: 'utf8' }).trim()); }

function auswertenRunde(nr) {
  const s = stand(nr); if (s.stufe !== 'auswerten' && s.stufe !== 'luecken' && s.stufe !== 'fertig') throw new Error(`Runde ${nr} ist noch nicht so weit (Stufe ${s.stufe}). Erst: node lernen/runde.js pruefen ${nr}`);
  const { werteRunde } = require('./auswerten'); const { ergebnis: e, kopf } = werteRunde(path.join(RUNDEN, nr)); const u = e.schiedsrichter; const verlauf = lies(VERLAUF);
  const eintrag = { runde: nr, art: s.art, datum: process.env.HEUTE || new Date().toISOString().slice(0, 10), plaetze: s.anzahl, blind: true, feld: lies(path.join(RUNDEN, nr, 'auftrag.json')).feld || 'gemischt', mass: 'schiedsrichter', quote: u.quote, getroffen: u.getroffen, gewertet: u.getroffen + u.rueckfrage + u.verfehlt,
    wahrheitUnbegruendet: u.unbegruendet, zusatzBerechtigt: u.zBerechtigt, zusatzUnbegruendet: u.zUnbegruendet, regeln: e.regeln, jeFaktor: e.jeFaktor, geschlossen: false };
  const i = verlauf.findIndex(v => v.runde === nr); if (i >= 0) { eintrag.geschlossen = verlauf[i].geschlossen; eintrag.datum = verlauf[i].datum; verlauf[i] = eintrag; } else verlauf.push(eintrag);
  schreib(VERLAUF, verlauf); console.log(kopf); console.log(`In den Verlauf eingetragen: ${nr} ${u.quote} % (${u.getroffen} von ${eintrag.gewertet}).`);
}

module.exports = { waehle, stand, RUNDEN };
if (require.main === module) {
  const [, , befehl, a, ...rest] = process.argv;
  try {
    if (befehl === 'neu') { const i = rest.indexOf('--anzahl'); neu(a, i >= 0 ? Number(rest[i + 1]) : a === 'pruef' ? 16 : 8); } // Prüfrunden brauchen 16 Plätze, sonst schwankt die Quote zu stark
    else if (befehl === 'pruefen') { const s = stand(a, rest); let n = 0;
      for (const [k, v] of Object.entries(s.meldungen)) { if (!v.length) continue; console.log(`\n${k[0].toUpperCase() + k.slice(1)}:`); for (const x of v) { console.log('- ' + x); n++; } }
      console.log(`\nRunde ${a}: Stufe „${s.stufe}“${s.fertig ? `. Fertig: ${Object.entries(s.fertig).map(([k, v]) => `${k} ${v}/${s.anzahl}`).join(', ')}` : ''}`); }
    else if (befehl === 'system') system(a);
    else if (befehl === 'auswerten') auswertenRunde(a);
    else if (befehl === 'geschlossen') { const v = lies(VERLAUF); const e = v.find(x => x.runde === a); if (!e) throw new Error('Runde steht nicht im Verlauf'); e.geschlossen = true; schreib(VERLAUF, v); console.log(`${a}: Lücken als bearbeitet vermerkt.`); }
    else console.log('Befehle: neu pruef|lern, pruefen <Runde>, system <Runde>, auswerten <Runde>, geschlossen <Runde>');
  } catch (x) { console.error(x.message); process.exit(1); }
}
