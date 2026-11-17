#!/usr/bin/env node
'use strict';
// Übernimmt den Vorschlag des Lückenschließers einer Runde in die Bibliothek, aber nur innerhalb fester Schranken.
// Aufruf: node lernen/uebernehmen.js R011
// Schranken: nur Neues, nichts Bestehendes ändern. Regeln nur als Entwurf mit offenem Beleg, nur wenn zwei verschiedene
// Arbeitsplätze den Anlass wörtlich belegen, nie doppelt zu einer bestehenden Bedingung. Begrenzte Stückzahl je Runde.
// Danach laufen die Tests; schlagen sie fehl, wird alles zurückgenommen.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const W = path.join(__dirname, '..'); const B = path.join(W, 'bibliothek'); const RUNDEN = path.join(__dirname, 'runden');
const lies = p => JSON.parse(fs.readFileSync(p, 'utf8')); const gibt = p => fs.existsSync(p);
const schreib = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 1) + '\n');
const kompakt = s => String(s).toLowerCase().replace(/[^a-z0-9äöüß]/g, '');
const GRENZE = { merkmale: 6, gefaehrdungen: 2, stammdaten: 10, woerter: 12, regeln: 4 };
const PRAEFIX = { material: 'm.', vorgang: 'v.', ausfuehrung: 'a.', umgebung: 'u.' };
const STUFE = { pflicht: 3, vermutungswirkung: 2, empfehlung: 1 };
const THEMEN = path.join(__dirname, 'offene-themen.json');

function pruefeAnlass(liste, f) {
  const ks = new Set();
  for (const a of Array.isArray(liste) ? liste : []) {
    const m = /^(R\d{3})-\d{2}$/.exec(a.kennung || ''); if (!m) { f.push(`Anlass ohne gültige Kennung (${a.kennung})`); continue; }
    const p = path.join(RUNDEN, m[1], 'protokolle', a.kennung + '.md'); if (!gibt(p)) { f.push(`Protokoll ${a.kennung} gibt es nicht`); continue; }
    if (!a.stelle || kompakt(a.stelle).length < 12) { f.push(`Anlass ${a.kennung}: Stelle fehlt oder ist zu kurz`); continue; }
    if (!kompakt(fs.readFileSync(p, 'utf8')).includes(kompakt(a.stelle))) { f.push(`Anlass ${a.kennung}: Stelle steht nicht wörtlich im Protokoll („${a.stelle.slice(0, 40)}…“)`); continue; }
    ks.add(a.kennung);
  }
  return ks.size;
}
const atome = w => typeof w === 'string' ? [w] : w && typeof w === 'object' && !Array.isArray(w) && Object.keys(w).length === 1 && Array.isArray(w.alle || w.eine) && (w.alle || w.eine).every(x => typeof x === 'string') ? (w.alle || w.eine) : null;

function uebernehmen(nr, { ohneTests = !!process.env.UEBERNAHME_OHNE_TESTS } = {}) {
  const o = path.join(RUNDEN, nr); const vp = path.join(o, 'vorschlag.json');
  const D = {}; for (const n of ['stammdaten', 'merkmale', 'gefaehrdungen', 'woerterbuch', 'regeln', 'quellen']) D[n] = lies(path.join(B, n + '.json'));
  const vorher = JSON.stringify(D); const ab = [], auf = { merkmale: [], gefaehrdungen: [], stammdaten: [], woerter: [], regeln: [] };
  let v; try { v = lies(vp); } catch (x) { v = null; ab.push({ was: 'Vorschlag', grund: 'fehlt oder ist kein gültiges JSON: ' + x.message }); }
  const kennung = /^[a-z][a-z0-9_]{2,40}$/;
  const nimm = (art, liste) => { const l = Array.isArray(liste) ? liste : []; for (const x of l.slice(GRENZE[art])) ab.push({ was: `${art}: ${x.id || x.name || (x.worte || []).join(', ')}`, grund: `mehr als ${GRENZE[art]} je Runde` }); return l.slice(0, GRENZE[art]); };
  if (v) {
    for (const x of nimm('merkmale', v.merkmale)) { const f = [];
      if (!/^[mvau]\.[a-z][a-z0-9_]{2,40}$/.test(x.id || '')) f.push('Kennung muss mit m., v., a. oder u. beginnen'); else if (D.merkmale[x.id]) f.push('gibt es schon');
      if (!x.name || x.name.length < 5) f.push('Name fehlt');
      if (f.length) ab.push({ was: 'Merkmal ' + x.id, grund: f.join('; ') }); else { D.merkmale[x.id] = x.name; auf.merkmale.push(x.id); } }
    for (const x of nimm('gefaehrdungen', v.gefaehrdungen)) { const f = [];
      if (!/^g-[a-z][a-z0-9-]{2,40}$/.test(x.id || '')) f.push('Kennung muss mit g- beginnen'); else if (D.gefaehrdungen.find(g => g.id === x.id)) f.push('gibt es schon');
      if (!(Number.isInteger(x.faktor) && x.faktor >= 1 && x.faktor <= 11)) f.push('Faktor muss 1 bis 11 sein'); if (!x.name || x.name.length < 10) f.push('Name fehlt');
      if (pruefeAnlass(x.anlass, f) < 2) f.push('braucht Anlass aus zwei verschiedenen Arbeitsplätzen');
      if (f.length) ab.push({ was: 'Gefährdung ' + x.id, grund: f.join('; ') }); else { D.gefaehrdungen.push({ id: x.id, faktor: x.faktor, name: x.name }); auf.gefaehrdungen.push(x.id); } }
    for (const x of nimm('stammdaten', v.stammdaten)) { const f = []; const liste = D.stammdaten[x.typ];
      if (!liste) f.push('Typ muss material, vorgang, ausfuehrung oder umgebung sein'); else {
        if (!kennung.test(x.id || '')) f.push('Kennung ungültig'); else if (liste.find(e => e.id === x.id)) f.push('gibt es schon');
        if (!x.name || x.name.length < 4) f.push('Name fehlt'); else if (liste.find(e => kompakt(e.name) === kompakt(x.name))) f.push('Name gibt es schon');
        for (const m of x.merkmale || []) { if (!D.merkmale[m]) f.push(`Merkmal ${m} gibt es nicht`); else if (!m.startsWith(PRAEFIX[x.typ])) f.push(`Merkmal ${m} gehört nicht zu ${x.typ}`); }
        if (pruefeAnlass(x.anlass, f) < 1) f.push('braucht einen Anlass aus einem Protokoll'); }
      if (f.length) ab.push({ was: `Stammdaten ${x.typ}/${x.id}`, grund: f.join('; ') }); else { liste.push({ id: x.id, name: x.name, merkmale: x.merkmale || [] }); auf.stammdaten.push(`${x.typ}/${x.id}`); } }
    const bekannt = new Set(D.woerterbuch.flatMap(e => e.worte.map(kompakt)));
    for (const x of nimm('woerter', v.woerter)) { const f = []; const worte = (Array.isArray(x.worte) ? x.worte : []).map(s => String(s).toLowerCase().trim());
      if (!worte.length) f.push('keine Worte'); for (const w of worte) { if (kompakt(w).length < 5) f.push(`„${w}“ ist zu kurz (mindestens fünf Buchstaben)`); if (w.split(/\s+/).length > 2) f.push(`„${w}“ hat mehr als zwei Wörter (nur Fachwörter, keine Satzstücke)`); if (bekannt.has(kompakt(w))) f.push(`„${w}“ steht schon im Wörterbuch`); }
      const e = { worte }; const hat = (typ, id) => D.stammdaten[typ].find(s => s.id === id);
      if (x.vorgang) { if (hat('vorgang', x.vorgang)) e.vorgang = x.vorgang; else f.push(`Vorgang ${x.vorgang} gibt es nicht`); }
      if (x.ausfuehrung) { if (hat('ausfuehrung', x.ausfuehrung)) e.ausfuehrung = x.ausfuehrung; else f.push(`Ausführung ${x.ausfuehrung} gibt es nicht`); }
      for (const typ of ['material', 'umgebung']) if (x[typ]) { const l = [].concat(x[typ]); for (const id of l) if (!hat(typ, id)) f.push(`${typ} ${id} gibt es nicht`); e[typ] = l; }
      if (Object.keys(e).length < 2) f.push('kein Ziel genannt');
      if (f.length) ab.push({ was: 'Wörter ' + worte.join(', '), grund: f.join('; ') }); else { D.woerterbuch.push(e); worte.forEach(w => bekannt.add(kompakt(w))); auf.woerter.push(worte.join(', ')); } }
    let naechste = Math.max(...D.regeln.map(r => Number((/^R(\d+)/.exec(r.id) || [0, 0])[1]))) + 1;
    for (const x of nimm('regeln', v.regeln)) { const f = []; const at = atome(x.wenn);
      if (!at || !at.length) f.push('Bedingung muss ein Merkmal sein oder {"alle":[…]} oder {"eine":[…]} aus Merkmalen'); else for (const m of at) if (!D.merkmale[m]) f.push(`Merkmal ${m} gibt es nicht`);
      if (!D.gefaehrdungen.find(g => g.id === x.gefaehrdung)) f.push(`Gefährdung ${x.gefaehrdung} gibt es nicht`);
      if (at && D.regeln.find(r => r.gefaehrdung === x.gefaehrdung && JSON.stringify(r.wenn) === JSON.stringify(x.wenn))) f.push('zu dieser Bedingung und Gefährdung gibt es schon eine Regel');
      if (!x.name || !x.entsteht) f.push('Name oder entsteht fehlt');
      const ms = Array.isArray(x.massnahmen) ? x.massnahmen : []; if (ms.length < 1 || ms.length > 4) f.push('eine bis vier Maßnahmen'); for (const m of ms) if (!['T', 'O', 'P'].includes(m.art) || !m.text || m.text.length < 15) f.push('Maßnahme braucht Art T, O oder P und einen Text');
      const qs = (Array.isArray(x.quellen) ? x.quellen : []).map(q => typeof q === 'string' ? q : q.id); if (!qs.length) f.push('keine Quelle'); for (const q of qs) if (!D.quellen.find(e => e.id === q)) f.push(`Quelle ${q} gibt es nicht`);
      if (pruefeAnlass(x.anlass, f) < 2) f.push('braucht Anlass aus zwei verschiedenen Arbeitsplätzen (Muster statt Einzelfall)');
      if (f.length) { ab.push({ was: 'Regel ' + (x.name || ''), grund: f.join('; ') }); continue; }
      const id = 'R' + naechste++; const rang = Math.max(...qs.map(q => STUFE[D.quellen.find(e => e.id === q).stufe]));
      D.regeln.push({ id, name: x.name, wenn: x.wenn, entsteht: x.entsteht, gefaehrdung: x.gefaehrdung, massnahmen: ms.map((m, i) => ({ id: `${id}-M${i + 1}`, art: m.art, text: m.text })),
        quellen: qs.map(q => ({ id: q, stelle: null })), verbindlichkeit: Object.keys(STUFE).find(k => STUFE[k] === rang), beleg: 'offen', freigabe: 'entwurf' });
      auf.regeln.push(`${id} ${x.name}`); }
  }
  // Schreiben, prüfen, notfalls zurücknehmen
  const sichern = d => { for (const n of ['stammdaten', 'merkmale', 'gefaehrdungen', 'woerterbuch', 'regeln']) schreib(path.join(B, n + '.json'), d[n]); };
  const test = () => { try { require('child_process').execFileSync('node', ['-e', `require(${JSON.stringify(path.join(W, 'kern', 'laden'))}).ladeBibliothek(${JSON.stringify(B)})`], { stdio: 'pipe' }); if (!ohneTests) execFileSync('npm', ['test'], { cwd: W, stdio: 'pipe' }); return null; } catch (x) { return String(x.stderr || x.stdout || x.message).split('\n').filter(z => /not ok|Error|rror:|^- /.test(z)).slice(0, 6).join(' | ') || 'Prüfung fehlgeschlagen'; } };
  let zurueck = null; const zahl = Object.values(auf).reduce((n, l) => n + l.length, 0);
  if (zahl) { sichern(D); let fehler = test();
    if (fehler && auf.regeln.length) { // zweiter Versuch ohne die neuen Regeln
      const n = auf.regeln.length; D.regeln.splice(D.regeln.length - n, n); for (const r of auf.regeln) ab.push({ was: 'Regel ' + r, grund: 'Tests schlugen mit dieser Regel fehl: ' + fehler }); auf.regeln = []; sichern(D); fehler = test(); }
    if (fehler) { sichern(JSON.parse(vorher)); zurueck = fehler; for (const k of Object.keys(auf)) { for (const e of auf[k]) ab.push({ was: `${k}: ${e}`, grund: 'zurückgenommen, weil die Tests fehlschlugen' }); auf[k] = []; } } }
  // Themen, die noch kein Muster sind, merken
  const themen = gibt(THEMEN) ? lies(THEMEN) : []; const erledigt = new Set(((v && v.erledigt) || []).map(kompakt));
  let rest = themen.filter(t => !erledigt.has(kompakt(t.thema)));
  for (const t of (v && Array.isArray(v.nicht_aufgenommen) ? v.nicht_aufgenommen : []).slice(0, 8)) { const f = []; if (!t.thema || pruefeAnlass(t.anlass, f) < 1) continue; const alt = rest.find(r => kompakt(r.thema) === kompakt(t.zu || t.thema)); if (t.zu && !alt) { ab.push({ was: 'Thema ' + t.thema, grund: `„${t.zu}“ steht nicht in offene-themen.json; als neues Thema gemerkt` }); }
    if (alt) { for (const a of t.anlass) if (!alt.anlass.find(b => b.kennung === a.kennung)) alt.anlass.push({ kennung: a.kennung, stelle: a.stelle }); } else rest.push({ thema: t.thema, seit: nr, anlass: t.anlass.map(a => ({ kennung: a.kennung, stelle: a.stelle })) }); }
  schreib(THEMEN, rest);
  const ergebnis = { runde: nr, uebernommen: auf, abgelehnt: ab, zurueckgenommen: zurueck, offeneThemen: rest.length };
  schreib(path.join(o, 'uebernahme.json'), ergebnis); return ergebnis;
}
module.exports = { uebernehmen, GRENZE };
if (require.main === module) { const e = uebernehmen(process.argv[2]);
  console.log(`Übernommen: ${Object.entries(e.uebernommen).map(([k, l]) => `${l.length} ${k}`).join(', ')}. Abgelehnt: ${e.abgelehnt.length}.${e.zurueckgenommen ? ' Alles zurückgenommen: ' + e.zurueckgenommen : ''}`);
  for (const a of e.abgelehnt) console.log(`- ${a.was}: ${a.grund}`); }
