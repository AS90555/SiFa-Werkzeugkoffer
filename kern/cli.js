#!/usr/bin/env node
'use strict';
// Aufruf: node kern/cli.js faelle/fensterwerk.json [--json]
const fs = require('fs'); const path = require('path');
const { ladeBibliothek } = require('./laden'); const { auswerten, uebersicht, pflichten, abgleich } = require('./auswerten');
const wurzel = path.join(__dirname, '..');
const datei = process.argv[2]; if (!datei) { console.error('Aufruf: node kern/cli.js <fall.json> [--json]'); process.exit(2); }
const b = ladeBibliothek(path.join(wurzel, 'bibliothek'));
const fall = JSON.parse(fs.readFileSync(datei, 'utf8'));
const e = auswerten(b, fall); const u = uebersicht(b, e);
if (process.argv.includes('--json')) { console.log(JSON.stringify({ ...e, ...u }, null, 1)); process.exit(0); }
const R = new Map(b.regeln.map(r => [r.id, r])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g])); const Q = new Map(b.quellen.map(q => [q.id, q]));
const A = new Map(b.angaben.map(a => [a.id, a]));
const z = [`# ${fall.name}`, '', `Bibliothek: ${b.regeln.length} Regeln, davon ${b.regeln.filter(r => r.beleg === 'geprueft').length} mit geprüftem Beleg, ${b.regeln.filter(r => r.freigabe === 'geprueft').length} fachlich freigegeben.`, ''];
if (fall.annahmen) z.push('Annahmen in diesem Fall:', ...fall.annahmen.map(a => `- ${a}`), '');
if ((fall.stoffe || []).length) {
  const heute = new Date(); z.push('## Stoffe mit Sicherheitsdatenblatt', '', '| Stoff | Einstufung | Datenblatt | Hinweis |', '| --- | --- | --- | --- |');
  for (const s of fall.stoffe) {
    const alt = s.sdb ? (heute - new Date(s.sdb.datum)) / (365.25 * 864e5) : 0;
    z.push(`| ${s.name} | ${[...s.h, ...(s.euh || [])].join(', ') || 'nicht eingestuft'} | ${s.sdb ? `Version ${s.sdb.version} vom ${s.sdb.datum.split('-').reverse().join('.')}` : 'fehlt'} | ${alt > 3 ? `Datenblatt ist ${Math.floor(alt)} Jahre alt, aktuelle Fassung anfordern. ` : ''}${s.hinweis || ''} |`);
  }
  z.push('');
}
z.push('## Gefährdungen im Betrieb', '', '| Faktor | Gefährdung | Stationen | Regeln |', '| --- | --- | --- | --- |');
for (const g of u.gefaehrdungen) z.push(`| ${g.faktor} | ${g.name} | ${g.stationen.join(', ')} | ${g.regeln.join(', ')} |`);
z.push('', '## Offene Angaben', '', '| Frage | Stationen |', '| --- | --- |');
for (const r of u.rueckfragen) z.push(`| ${r.frage} | ${r.stationen.join(', ')} |`);
if (u.annahmen.length) { z.push('', '## Annahmen des Systems', '', '| Annahme | Arbeitsplätze |', '| --- | --- |'); for (const a of u.annahmen) z.push(`| ${a.text} | ${a.stationen.join(', ')} |`); }
const P = new Map(b.pflichten.map(p => [p.id, p])); const pl = pflichten(b, fall);
z.push('', '## Organisationspflichten des Betriebs', '', '| Pflicht | Was nachzuweisen ist | Quelle | Stand |', '| --- | --- | --- | --- |');
for (const t of pl) { const p = P.get(t.pflicht);
  z.push(`| ${p.name} | ${p.nachweis} | ${p.quellen.map(q => `${Q.get(q.id).titel}${q.stelle ? ', ' + q.stelle : ' (Fundstelle offen)'}`).join('; ')} | ${t.status === 'offen' ? 'offen: ' + t.fehlt.map(a => A.get(a).frage).join(' ') : ((fall.pflichtpruefung || {})[p.id] || 'nicht bewertet')} |`); }
const ab = abgleich(b, fall, e);
if (ab.stationen.length) {
  z.push('', '## Abgleich mit den eigenen Beobachtungen', '', `Trefferquote: ${ab.quote} %. Getroffen ${ab.getroffen}, vom System übersehen ${ab.uebersehen}, ohne Eintrag in der Bibliothek ${ab.ohneEintrag}, vom System zusätzlich gefunden ${ab.zusaetzlich}.`, '');
  for (const s of ab.stationen) { z.push(`- **${s.nr} ${s.name}**`);
    if (s.getroffen.length) z.push(`  - Getroffen: ${s.getroffen.join('; ')}`);
    if (s.uebersehen.length) z.push(`  - Übersehen: ${s.uebersehen.join('; ')}`);
    if (s.ohneEintrag.length) z.push(`  - Ohne Eintrag in der Bibliothek: ${s.ohneEintrag.join('; ')}`);
    if (s.zusaetzlich.length) z.push(`  - Zusätzlich vom System: ${s.zusaetzlich.map(g => G.get(g).name).join('; ')}`); }
}
z.push('', '## Je Arbeitsplatz', '');
for (const s of e.stationen) {
  { const fs0 = fall.stationen.find(x => x.nr === s.nr); z.push(`### ${s.nr} ${s.name}${fs0.bereich ? ' (' + fs0.bereich + ')' : ''}`, ''); }
  { const fs1 = fall.stationen.find(x => x.nr === s.nr); const ma = [...(fs1.maengel || []), ...((fall.maengel || []).filter(m => !m.station || m.station === s.nr))]; if (ma.length) z.push(`Beim Rundgang gemeldete Mängel: ${ma.map(m => m.text).join('; ')}`, ''); }
  for (const t of s.treffer) {
    const r = R.get(t.regel);
    const quelle = r.quellen.length ? r.quellen.map(q => `${Q.get(q.id).titel}, ${q.stelle || 'Fundstelle offen'}`).join('; ') : 'ohne Beleg';
    z.push(`- **${G.get(r.gefaehrdung).name}** (${r.id}, ${r.verbindlichkeit}${t.status === 'offen' ? ', offen bis zur Angabe' : ''})`);
    for (const m of r.massnahmen) z.push(`  - ${m.art}: ${m.text}`);
    z.push(`  - Quelle: ${quelle}. Beleg: ${r.beleg}.`);
    if (t.fehlt.length) z.push(`  - Angabe fehlt: ${t.fehlt.map(a => A.get(a).frage).join(' ')}`);
  }
  z.push('');
}
console.log(z.join('\n'));
