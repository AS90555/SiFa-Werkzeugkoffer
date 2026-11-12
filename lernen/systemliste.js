#!/usr/bin/env node
'use strict';
// Schreibt je Fall einer Runde, was das System gefunden hat: lernen/runden/<Runde>/system/<Kennung>.json
const fs = require('fs'); const path = require('path');
const { ladeBibliothek } = require('../kern/laden'); const { auswerten } = require('../kern/auswerten');
const b = ladeBibliothek(path.join(__dirname, '..', 'bibliothek')); const ordner = process.argv[2];
const R = new Map(b.regeln.map(r => [r.id, r])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g]));
fs.mkdirSync(path.join(ordner, 'system'), { recursive: true });
for (const d of fs.readdirSync(path.join(ordner, 'faelle')).filter(x => x.endsWith('.json'))) {
  const fall = JSON.parse(fs.readFileSync(path.join(ordner, 'faelle', d), 'utf8')); const liste = new Map();
  const e = auswerten(b, { ...fall, stationen: fall.stationen.filter(s => s.schritte.length) });
  for (const s of e.stationen) for (const t of s.treffer) { const r = R.get(t.regel); const g = G.get(r.gefaehrdung);
    const x = liste.get(g.id) || { gefaehrdung: g.name, status: 'offen', massnahmen: [], entsteht: [] };
    if (t.status === 'trifft zu') x.status = 'trifft zu'; x.entsteht.push(r.entsteht); x.massnahmen.push(...r.massnahmen.map(m => m.text)); liste.set(g.id, x); }
  fs.writeFileSync(path.join(ordner, 'system', d), JSON.stringify({ id: fall.id, gefaehrdungen: [...liste.values()] }, null, 1));
}
console.log('Systemlisten geschrieben');
