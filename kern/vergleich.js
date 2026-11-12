#!/usr/bin/env node
'use strict';
// Vergleicht das Rechenergebnis mit der Handtabelle aus dem Probe-Dokument.
const fs = require('fs'); const path = require('path');
const { ladeBibliothek } = require('./laden'); const { auswerten } = require('./auswerten');
const w = path.join(__dirname, '..');
const b = ladeBibliothek(path.join(w, 'bibliothek'));
const e = auswerten(b, JSON.parse(fs.readFileSync(path.join(w, 'faelle/fensterwerk.json'), 'utf8')));
const hand = JSON.parse(fs.readFileSync(path.join(w, 'test/handtabelle.json'), 'utf8'));
const system = {};
for (const s of e.stationen) for (const t of s.treffer) (system[t.regel] = system[t.regel] || []).push(s.nr + (t.status === 'offen' ? '?' : ''));
let gleich = 0; const z = [];
for (const r of b.regeln) {
  const h = hand[r.id] || [], s = system[r.id] || [];
  const sn = s.map(x => parseInt(x));
  const mehr = s.filter(x => !h.includes(parseInt(x))), weniger = h.filter(x => !sn.includes(x));
  if (!mehr.length && !weniger.length) { gleich++; continue; }
  z.push(`${r.id} ${r.name}: ${mehr.length ? 'System zusätzlich ' + mehr.join(', ') : ''}${mehr.length && weniger.length ? '; ' : ''}${weniger.length ? 'System fehlt ' + weniger.join(', ') : ''}`);
}
console.log(`${gleich} von ${b.regeln.length} Regeln stimmen mit der Handtabelle überein. Ein Fragezeichen heißt: offen bis zur Angabe.\n` + z.join('\n'));
