#!/usr/bin/env node
'use strict';
// Trägt Andres Entscheidung zu einem Freigabe-Paket ein. Nur ausführen, wenn Andre es im Gespräch ausdrücklich gesagt hat.
// Aufruf: node freigabe/setzen.js F001 --von Andre [--ausser R12,R30] [--sperren R44]
const fs = require('fs'); const path = require('path'); const { fingerabdruck } = require('../kern/laden');
const W = path.join(__dirname, '..'); const lies = p => JSON.parse(fs.readFileSync(p, 'utf8')); const arg = n => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : null; };
const nr = process.argv[2]; const von = arg('von'); const ausser = (arg('ausser') || '').split(',').filter(Boolean); const sperren = (arg('sperren') || '').split(',').filter(Boolean);
if (!nr || !von) { console.error('Aufruf: node freigabe/setzen.js F001 --von Andre [--ausser R12,R30] [--sperren R44]'); process.exit(1); }
const pp = path.join(__dirname, nr + '.json'); const paket = lies(pp); if (paket.status !== 'offen') { console.error(`${nr} ist schon erledigt.`); process.exit(1); }
const dateien = { regel: path.join(W, 'bibliothek', 'regeln.json'), pflicht: path.join(W, 'bibliothek', 'pflichten.json') }; const daten = { regel: lies(dateien.regel), pflicht: lies(dateien.pflicht) };
const heute = process.env.HEUTE || new Date().toISOString().slice(0, 10); const z = { frei: [], gesperrt: [], zurueck: [], veraltet: [] };
for (const p of paket.eintraege) {
  const e = daten[p.art].find(x => x.id === p.id);
  if (!e || fingerabdruck(e) !== p.fingerabdruck) { z.veraltet.push(p.id); continue; }
  if (sperren.includes(p.id)) { e.freigabe = 'gesperrt'; z.gesperrt.push(p.id); }
  else if (ausser.includes(p.id)) z.zurueck.push(p.id);
  else { e.freigabe = 'geprueft'; e.freigegeben = { von, datum: heute, paket: nr, fingerabdruck: p.fingerabdruck }; z.frei.push(p.id); }
}
for (const k of ['regel', 'pflicht']) fs.writeFileSync(dateien[k], JSON.stringify(daten[k], null, 1) + '\n');
Object.assign(paket, { status: 'erledigt', von, datum: heute, entscheidung: z }); fs.writeFileSync(pp, JSON.stringify(paket, null, 1) + '\n');
console.log(`${nr}: freigegeben ${z.frei.length}, gesperrt ${z.gesperrt.length}, zurückgestellt ${z.zurueck.length}, seit Paketbildung geändert ${z.veraltet.length}`);
