#!/usr/bin/env node
'use strict';
// Führt die Berichte von Prüfer (A) und Gegenprüfer (B) zusammen. Eine Aussage gilt nur als belegt, wenn beide
// unabhängig ein Zitat liefern, das wörtlich im Regelwerkstext steht. Ohne --uebernehmen wird nur berichtet.
// Aufruf: node beleg/zusammenfuehren.js B001 [--uebernehmen]
const fs = require('fs'); const path = require('path');
const { ladeBibliothek, fingerabdruck } = require('../kern/laden'); const { WURZEL, STUFE, zitatFehler, quelleZuDatei } = require('./text');
const lauf = process.argv[2]; const uebernehmen = process.argv.includes('--uebernehmen'); const heute = process.env.HEUTE || new Date().toISOString().slice(0, 10);
const ordner = path.join(WURZEL, 'beleg', 'laeufe', lauf); const lies = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const b = ladeBibliothek(path.join(WURZEL, 'bibliothek'));
const E = new Map([...b.regeln.map(r => [r.id, r]), ...b.pflichten.map(p => [p.id, p])]);
const gueltig = a => (a && a.urteil !== 'nicht-gedeckt' ? (a.belege || []).filter(x => !zitatFehler(x)) : []);
const ergebnis = []; const zaehler = { geprueft: 0, teilweise: 0, offen: 0, strittig: 0, veraltet: 0, 'neue-quelle': 0, 'bericht-fehlt': 0 }; let aussagenDoppelt = 0, aussagenAlle = 0, zitateVerworfen = 0;

for (const pd of fs.readdirSync(path.join(ordner, 'pakete')).filter(x => x.endsWith('-A.json')).sort()) {
  const paket = lies(path.join(ordner, 'pakete', pd)); const ber = {};
  for (const r of ['A', 'B']) { const p = path.join(ordner, 'berichte', `${paket.paket}-${r}.json`); ber[r] = fs.existsSync(p) ? new Map(lies(p).eintraege.map(e => [e.id, e])) : null; }
  for (const pe of paket.eintraege) {
    const e = E.get(pe.id); const z = { id: pe.id, art: pe.art, name: pe.name, aussagen: [], hinweise: [] };
    if (!ber.A || !ber.B || !ber.A.get(pe.id) || !ber.B.get(pe.id)) { z.status = 'bericht-fehlt'; ergebnis.push(z); zaehler[z.status]++; continue; }
    if (!e || fingerabdruck(e) !== pe.fingerabdruck) { z.status = 'veraltet'; ergebnis.push(z); zaehler[z.status]++; continue; }
    for (const pa of pe.aussagen) {
      const ra = (ber.A.get(pe.id).aussagen || []).find(x => x.id === pa.id), rb = (ber.B.get(pe.id).aussagen || []).find(x => x.id === pa.id);
      for (const r of [ra, rb]) zitateVerworfen += ((r && r.belege) || []).filter(x => zitatFehler(x)).length;
      const ga = gueltig(ra), gb = gueltig(rb); aussagenAlle++;
      const wider = [[ra, ga], [rb, gb]].filter(([r, g]) => r && r.urteil === 'widerspruch' && g.length);
      const da = ra && ra.urteil === 'gedeckt' && ga.length > 0, db = rb && rb.urteil === 'gedeckt' && gb.length > 0;
      const status = wider.length ? 'strittig' : da && db ? 'doppelt' : da || db ? 'einfach' : 'keiner';
      if (status === 'doppelt') aussagenDoppelt++;
      z.aussagen.push({ id: pa.id, text: pa.text, status, A: { urteil: ra && ra.urteil, belege: ga, bemerkung: (ra && ra.bemerkung) || '' }, B: { urteil: rb && rb.urteil, belege: gb, bemerkung: (rb && rb.bemerkung) || '' } });
    }
    for (const r of ['A', 'B']) { const v = ber[r].get(pe.id).vorschlag; if (v) z.hinweise.push(`Vorschlag ${r}: ${v}`); }
    const st = z.aussagen.map(a => a.status);
    z.status = st.includes('strittig') ? 'strittig' : st.every(s => s === 'doppelt') ? 'geprueft' : st.includes('doppelt') ? 'teilweise' : 'offen';
    if (z.status === 'geprueft') {
      const belege = z.aussagen.flatMap(a => [a.A.belege[0], a.B.belege[0]]);
      const fremd = [...new Set(belege.filter(x => !quelleZuDatei(b, x.datei)).map(x => x.datei))];
      if (fremd.length) { z.status = 'neue-quelle'; z.hinweise.push('Belegt aus Dateien, die noch nicht in quellen.json stehen: ' + fremd.join(', ')); }
      else if (pe.art === 'regel') { const beste = Math.max(...belege.map(x => STUFE[quelleZuDatei(b, x.datei).stufe]));
        if (STUFE[e.verbindlichkeit] > beste) z.hinweise.push(`Verbindlichkeit prüfen: Regel sagt „${e.verbindlichkeit}“, die Belege stammen nur aus niedriger eingestuften Quellen.`); }
    }
    ergebnis.push(z); zaehler[z.status]++;
  }
}

// Übernehmen in die Bibliothek: nur vollständig doppelt belegte Einträge. Einfach geprüfte Altbestände, die durchfallen, gehen zurück auf offen.
if (uebernehmen) {
  for (const z of ergebnis) {
    const e = E.get(z.id);
    if (z.status === 'geprueft') {
      const stellen = new Map(); const merke = (bl) => { const q = quelleZuDatei(b, bl.datei).id; if (!stellen.has(q)) stellen.set(q, new Set()); stellen.get(q).add(bl.stelle.trim()); return q; };
      for (const a of z.aussagen) { const q = merke(a.A.belege[0]); merke(a.B.belege[0]);
        if (z.art === 'regel') e.massnahmen.find(m => m.id === a.id).beleg = { quelle: q, stelle: a.A.belege[0].stelle.trim() }; }
      const verweise = (e.quellen || []).filter(q => b.quellen.find(x => x.id === q.id).verweis && !stellen.has(q.id));
      e.quellen = [...[...stellen].map(([id, s]) => ({ id, stelle: [...s].join('; ') })), ...verweise.map(q => ({ id: q.id, stelle: q.stelle || 'Verweis auf das Dokument am Arbeitsplatz' }))];
      if (z.art === 'regel') { // Die Verbindlichkeit darf nicht höher sein als die ranghöchste Quelle, die die Maßnahmen wirklich belegt.
        const beste = Math.max(...[...stellen.keys()].map(id => STUFE[b.quellen.find(x => x.id === id).stufe])); const name = Object.keys(STUFE).find(k => STUFE[k] === beste);
        if (STUFE[e.verbindlichkeit] > beste) { z.hinweise = z.hinweise.filter(h => !h.startsWith('Verbindlichkeit prüfen')); z.hinweise.push(`Verbindlichkeit von „${e.verbindlichkeit}“ auf „${name}“ gesenkt: Die Belege stammen aus keiner höher eingestuften Quelle.`); e.verbindlichkeit = name; } }
      e.beleg = 'geprueft'; e.belegstand = { lauf, datum: heute, pruefungen: 2, fingerabdruck: fingerabdruck(e) };
    } else if (['strittig', 'offen', 'teilweise'].includes(z.status) && e.beleg === 'geprueft' && !(e.belegstand && e.belegstand.pruefungen >= 2)) {
      e.beleg = 'offen'; z.hinweise.push('War bisher einfach geprüft und ist in der Gegenprüfung nicht bestätigt worden: zurück auf offen.');
    }
  }
  const schreib = (n, d) => fs.writeFileSync(path.join(WURZEL, 'bibliothek', n + '.json'), JSON.stringify(d, null, 1) + '\n');
  schreib('regeln', b.regeln); schreib('pflichten', b.pflichten);
}

const zeile = bl => `„${bl.zitat.trim().replace(/\s+/g, ' ')}“ (${bl.datei.replace(/\.txt$/, '')}, ${bl.stelle.trim()})`;
const md = [`# Beleg-Lauf ${lauf}`, '', `${ergebnis.length} Einträge, ${aussagenAlle} Aussagen. Doppelt belegt: ${aussagenDoppelt} Aussagen. Verworfene Zitate (standen nicht wörtlich im Text): ${zitateVerworfen}.`, '',
  '| Ergebnis | Anzahl | Bedeutung |', '| --- | --- | --- |',
  `| geprüft | ${zaehler.geprueft} | jede Aussage von beiden Prüfern mit wörtlichem Zitat belegt |`, `| teilweise | ${zaehler.teilweise} | mindestens eine Aussage ohne doppelten Beleg |`,
  `| offen | ${zaehler.offen} | keine Aussage doppelt belegt |`, `| strittig | ${zaehler.strittig} | ein Prüfer hat einen Widerspruch zum Text gefunden |`,
  `| neue Quelle | ${zaehler['neue-quelle']} | belegt, aber aus einem Dokument, das noch nicht im Quellenverzeichnis steht |`, `| veraltet oder Bericht fehlt | ${zaehler.veraltet + zaehler['bericht-fehlt']} | seit der Paketbildung geändert oder nicht bearbeitet |`, ''];
for (const st of ['strittig', 'teilweise', 'offen', 'neue-quelle', 'geprueft', 'veraltet', 'bericht-fehlt']) {
  const liste = ergebnis.filter(z => z.status === st); if (!liste.length) continue;
  md.push(`## ${{ strittig: 'Strittig', teilweise: 'Teilweise belegt', offen: 'Nicht belegt', 'neue-quelle': 'Belegt aus neuer Quelle', geprueft: 'Geprüft', veraltet: 'Veraltet', 'bericht-fehlt': 'Bericht fehlt' }[st]}`, '');
  for (const z of liste) { md.push(`### ${z.id} ${z.name}`, '');
    for (const a of z.aussagen) { md.push(`- **${a.id}** ${a.text} → ${a.status}`);
      for (const r of ['A', 'B']) { const x = a[r]; if (x.belege[0]) md.push(`  - ${r} (${x.urteil}): ${zeile(x.belege[0])}`); if (x.bemerkung) md.push(`  - ${r} Bemerkung: ${x.bemerkung}`); if (!x.belege[0] && !x.bemerkung) md.push(`  - ${r}: ${x.urteil || 'kein Urteil'}, kein gültiges Zitat`); } }
    for (const h of z.hinweise) md.push(`- Hinweis: ${h}`); md.push(''); }
}
fs.writeFileSync(path.join(ordner, 'bericht.md'), md.join('\n'));
fs.writeFileSync(path.join(ordner, 'ergebnis.json'), JSON.stringify({ lauf, datum: heute, uebernommen: uebernehmen, zaehler, aussagen: { alle: aussagenAlle, doppelt: aussagenDoppelt }, zitateVerworfen, eintraege: ergebnis }, null, 1));
console.log(md.slice(2, 12).join('\n')); console.log(uebernehmen ? 'In die Bibliothek übernommen.' : 'Nur Bericht. Übernehmen mit --uebernehmen.');
