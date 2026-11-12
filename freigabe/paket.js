#!/usr/bin/env node
'use strict';
// Stellt ein Freigabe-Paket für Andre zusammen: alle doppelt belegten Einträge, die noch im Entwurf sind.
// Aufruf: node freigabe/paket.js [--anzahl 15]
const fs = require('fs'); const path = require('path');
const { ladeBibliothek, fingerabdruck } = require('../kern/laden'); const { klartext } = require('../kern/klartext');
const W = path.join(__dirname, '..'); const lies = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const b = ladeBibliothek(path.join(W, 'bibliothek')); const Q = new Map(b.quellen.map(q => [q.id, q])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g])); const F = new Map(b.faktoren.faktoren.map(f => [f.nr, f.name]));
const i = process.argv.indexOf('--anzahl'); const anzahl = i > 0 ? Number(process.argv[i + 1]) : 15;
const pakete = fs.readdirSync(__dirname).filter(x => /^F\d{3}\.json$/.test(x)).map(x => lies(path.join(__dirname, x)));
const vergeben = new Set(pakete.filter(p => p.status === 'offen').flatMap(p => p.eintraege.map(e => e.id)));
const kand = [...b.regeln.map(e => ['regel', e]), ...b.pflichten.map(e => ['pflicht', e])].filter(([, e]) => e.belegstand && e.belegstand.pruefungen >= 2 && e.freigabe === 'entwurf' && !vergeben.has(e.id)).slice(0, anzahl);
if (!kand.length) { console.log('Nichts freizugeben: kein doppelt belegter Eintrag wartet.'); process.exit(0); }
const nr = 'F' + String(pakete.length + 1).padStart(3, '0'); const laeufe = {};
const lauf = l => (laeufe[l] = laeufe[l] || new Map(lies(path.join(W, 'beleg', 'laeufe', l, 'ergebnis.json')).eintraege.map(e => [e.id, e])));
const STUFE = { pflicht: 'Pflicht (Gesetz, Verordnung oder Unfallverhütungsvorschrift)', vermutungswirkung: 'Technische Regel mit Vermutungswirkung', empfehlung: 'Empfehlung' };
const ART = { S: 'Ersetzen', T: 'Technisch', O: 'Organisatorisch', P: 'Persönlich' };
const zit = x => (x ? `„${x.zitat.trim().replace(/\s+/g, ' ')}“ (${x.datei.replace(/\.txt$/, '').split('/').pop()}, ${x.stelle.trim()})` : 'kein Zitat abgelegt');
const md = [`# Freigabe-Paket ${nr}`, '', `${kand.length} Einträge. Jede Aussage wurde von zwei unabhängigen Prüfern am Text des Regelwerks belegt; jedes Zitat steht wörtlich im abgelegten Text.`, '',
  '**Was du tust:** Lies jede Regel so, als müsstest du sie einem Kunden oder der Aufsichtsperson erklären. Stimmt die Bedingung? Passen die Maßnahmen? Fehlt etwas Wichtiges?', '',
  '**Worauf du besonders achtest:** Hat eine Maßnahme mehrere Teile, deckt das Zitat dann alle Teile? Passt die Bedingung zu dem, was die zitierte Stelle regelt? Ist die Verbindlichkeit richtig eingestuft?', '',
  `**Antwort im Gespräch, zum Beispiel:** „${nr} frei“ oder „${nr} frei außer R12 und R30“ oder „R12 sperren, weil …“. Erst dann wird die Freigabe eingetragen.`, ''];
for (const [art, e] of kand) {
  const le = lauf(e.belegstand.lauf).get(e.id); md.push(`## ${e.id} ${e.name}`, '', `- **Gilt, wenn:** ${klartext(b, e.wenn)}`);
  if (art === 'regel') { const g = G.get(e.gefaehrdung); md.push(`- **Dann entsteht:** ${e.entsteht} → Gefährdung „${g.name}“ (Faktor ${g.faktor} ${F.get(g.faktor)})`, `- **Verbindlichkeit:** ${STUFE[e.verbindlichkeit]}`, '- **Maßnahmen:**');
    for (const m of e.massnahmen) { const a = le && le.aussagen.find(x => x.id === m.id);
      md.push(`  - ${m.id} (${ART[m.art]}): **${m.text}**`); if (m.grundlage === 'erfahrung') md.push('    - Grundlage: Erfahrung der Fachkraft, ohne Fundstelle'); else if (a) md.push(`    - Prüfer: ${zit(a.A.belege[0])}`, `    - Gegenprüfer: ${zit(a.B.belege[0])}`); } }
  else { const a = le && le.aussagen[0]; md.push(`- **Pflicht:** ${e.pflicht}`, `- **Nachweis im Betrieb:** ${e.nachweis}`); if (a) md.push(`  - Prüfer: ${zit(a.A.belege[0])}`, `  - Gegenprüfer: ${zit(a.B.belege[0])}`); }
  md.push(`- **Quellen:** ${e.quellen.map(q => `${Q.get(q.id).titel}, ${q.stelle}`).join(' · ')}`); for (const h of (le && le.hinweise) || []) md.push(`- **Hinweis der Prüfung:** ${h}`); md.push('');
}
fs.writeFileSync(path.join(__dirname, nr + '.md'), md.join('\n'));
fs.writeFileSync(path.join(__dirname, nr + '.json'), JSON.stringify({ paket: nr, status: 'offen', eintraege: kand.map(([art, e]) => ({ id: e.id, art, fingerabdruck: fingerabdruck(e) })) }, null, 1) + '\n');
console.log(`${nr}: ${kand.length} Einträge → freigabe/${nr}.md`);
