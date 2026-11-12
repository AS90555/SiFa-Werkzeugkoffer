#!/usr/bin/env node
'use strict';
// Liest ein Protokoll und zeigt, welche Wörter das Wörterbuch schon kennt. Hilfe für die Übersetzung, kein Ersatz dafür.
// Aufruf: node kern/protokoll.js protokolle/<datei>.md
const fs = require('fs'); const path = require('path'); const { ladeBibliothek } = require('./laden');
const b = ladeBibliothek(path.join(__dirname, '..', 'bibliothek'));
const datei = process.argv[2]; if (!datei) { console.error('Aufruf: node kern/protokoll.js <protokoll.md>'); process.exit(2); }
const zeilen = fs.readFileSync(datei, 'utf8').split('\n');
const n = (typ, id) => (b.stammdaten[typ].find(x => x.id === id) || {}).name;
let treffer = 0;
zeilen.forEach((z, i) => { const klein = z.toLowerCase();
  for (const w of b.woerterbuch) { const wort = w.worte.find(x => klein.includes(x)); if (!wort) continue; treffer++;
    const teile = [w.vorgang && 'Vorgang ' + n('vorgang', w.vorgang), w.ausfuehrung && 'Ausführung ' + n('ausfuehrung', w.ausfuehrung), ...(w.material || []).map(m => 'Material ' + n('material', m)), ...(w.umgebung || []).map(u => 'Umgebung ' + n('umgebung', u)), ...Object.entries(w.angabe || {}).map(([k, v]) => `Angabe ${k} = ${v}`), w.hinweis && 'Hinweis: ' + w.hinweis].filter(Boolean);
    console.log(`Zeile ${i + 1} „${wort}“: ${teile.join('; ')}`); } });
console.log(`\n${treffer} Treffer aus ${b.woerterbuch.length} Wörterbucheinträgen.`);
