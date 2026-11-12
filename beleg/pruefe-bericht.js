#!/usr/bin/env node
'use strict';
// Prüft einen Bericht von Prüfer oder Gegenprüfer: Form, Vollständigkeit und jedes Zitat wörtlich gegen den Regelwerkstext.
// Aufruf: node beleg/pruefe-bericht.js beleg/laeufe/B001/berichte/P1-A.json
const fs = require('fs'); const path = require('path'); const { zitatFehler } = require('./text');
const URTEILE = ['gedeckt', 'nicht-gedeckt', 'widerspruch'];
function pruefeBericht(bericht, paket) {
  const f = []; const E = new Map((bericht.eintraege || []).map(e => [e.id, e]));
  if (!Array.isArray(bericht.eintraege)) return ['Bericht braucht die Liste eintraege'];
  for (const p of paket.eintraege) {
    const e = E.get(p.id); if (!e) { f.push(`${p.id}: fehlt im Bericht`); continue; }
    const A = new Map((e.aussagen || []).map(a => [a.id, a]));
    for (const pa of p.aussagen) {
      const a = A.get(pa.id); if (!a) { f.push(`${pa.id}: Aussage fehlt im Bericht`); continue; }
      if (!URTEILE.includes(a.urteil)) { f.push(`${pa.id}: Urteil muss gedeckt, nicht-gedeckt oder widerspruch sein`); continue; }
      if (a.urteil !== 'nicht-gedeckt' && !(a.belege || []).length) f.push(`${pa.id}: Urteil ${a.urteil} braucht mindestens einen Beleg mit Zitat`);
      if (a.urteil !== 'gedeckt' && !(a.bemerkung || '').trim()) f.push(`${pa.id}: Urteil ${a.urteil} braucht eine Bemerkung`);
      (a.belege || []).forEach((bl, i) => { const x = zitatFehler(bl); if (x) f.push(`${pa.id} Beleg ${i + 1}: ${x}`); });
    }
  }
  return f;
}
module.exports = { pruefeBericht };
if (require.main === module) {
  const bf = process.argv[2]; const pf = path.join(path.dirname(bf), '..', 'pakete', path.basename(bf));
  let bericht; try { bericht = JSON.parse(fs.readFileSync(bf, 'utf8')); } catch (x) { console.error('Bericht ist kein gültiges JSON: ' + x.message); process.exit(1); }
  const f = pruefeBericht(bericht, JSON.parse(fs.readFileSync(pf, 'utf8')));
  if (f.length) { console.error(f.length + ' Fehler:\n- ' + f.join('\n- ')); process.exit(1); }
  console.log('in Ordnung');
}
