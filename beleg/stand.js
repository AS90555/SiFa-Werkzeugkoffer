#!/usr/bin/env node
'use strict';
// Zeigt den Belegstand. Mit --bereinigen: Einträge, die nach Prüfung oder Freigabe geändert wurden, fallen zurück auf offen und Entwurf.
const fs = require('fs'); const path = require('path'); const { fingerabdruck } = require('../kern/laden');
const ordner = path.join(__dirname, '..', 'bibliothek'); const lies = n => JSON.parse(fs.readFileSync(path.join(ordner, n + '.json'), 'utf8'));
function belegstand(regeln, pflichten) {
  const z = l => ({ alle: l.length, doppelt: l.filter(e => e.belegstand && e.belegstand.pruefungen >= 2).length, einfach: l.filter(e => e.beleg === 'geprueft' && !(e.belegstand && e.belegstand.pruefungen >= 2)).length,
    ohneBeleg: l.filter(e => e.beleg === 'ohne-beleg').length, freigegeben: l.filter(e => e.freigabe === 'geprueft').length });
  return { regeln: z(regeln), pflichten: z(pflichten) };
}
module.exports = { belegstand };
if (require.main === module) {
  const regeln = lies('regeln'), pflichten = lies('pflichten'); let n = 0;
  if (process.argv.includes('--bereinigen')) {
    for (const e of [...regeln, ...pflichten]) {
      const fp = fingerabdruck(e);
      if (e.belegstand && e.belegstand.fingerabdruck !== fp) { delete e.belegstand; e.beleg = 'offen'; for (const m of e.massnahmen || []) delete m.beleg; e.freigabe = 'entwurf'; delete e.freigegeben; n++; console.log(`${e.id}: Beleg und Freigabe zurückgesetzt`); }
      else if (e.freigegeben && e.freigegeben.fingerabdruck !== fp) { e.freigabe = 'entwurf'; delete e.freigegeben; n++; console.log(`${e.id}: Freigabe zurückgesetzt`); }
    }
    if (n) { fs.writeFileSync(path.join(ordner, 'regeln.json'), JSON.stringify(regeln, null, 1) + '\n'); fs.writeFileSync(path.join(ordner, 'pflichten.json'), JSON.stringify(pflichten, null, 1) + '\n'); }
    console.log(n ? `${n} Einträge zurückgesetzt.` : 'Nichts zurückzusetzen.');
  }
  const s = belegstand(regeln, pflichten);
  for (const [k, v] of Object.entries(s)) console.log(`${k}: ${v.alle} gesamt, doppelt geprüft ${v.doppelt}, einfach geprüft ${v.einfach}, ohne Beleg ${v.ohneBeleg}, freigegeben ${v.freigegeben}`);
}
