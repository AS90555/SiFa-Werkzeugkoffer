#!/usr/bin/env node
'use strict';
// Wertet eine Runde aus: Fälle rechnen, mit der verdeckten Wahrheit vergleichen, Bericht schreiben.
// Bis R003 kannte der Sprecher die Kennungen der Bibliothek (Vergleich nach Kennung). Ab R004 ist er blind:
// dann zählt allein das Urteil des Schiedsrichters. Aufruf: node lernen/auswerten.js lernen/runden/R004
const fs = require('fs'); const path = require('path');
const { ladeBibliothek } = require('../kern/laden'); const { auswerten } = require('../kern/auswerten');
function werteRunde(ordner) {
  const b = ladeBibliothek(path.join(__dirname, '..', 'bibliothek')); const lies = p => JSON.parse(fs.readFileSync(p, 'utf8'));
  const R = new Map(b.regeln.map(r => [r.id, r])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g])); const F = new Map(b.faktoren.faktoren.map(f => [f.nr, f.name]));
  const zeilen = [], faelle = [], jeFaktor = {}; const W = new Map();
  const summe = { getroffen: 0, nachfrage: 0, uebersehen: 0, ohneEintrag: 0, zusaetzlich: 0, wuensche: 0, schritte: 0, maengel: 0 };
  const L = { uebersehen: [], ohneEintrag: [], wuensche: [], zusaetzlich: [], verfehlt: [], rueckfrage: [], wUnbegruendet: [], zUnbegruendet: [], zBerechtigt: [] };
  const fk = n => (jeFaktor[n] = jeFaktor[n] || { getroffen: 0, verfehlt: 0 }); let blind = true;
  for (const datei of fs.readdirSync(path.join(ordner, 'wahrheit')).filter(x => x.endsWith('.json')).sort()) {
    const id = datei.replace('.json', ''); const w = lies(path.join(ordner, 'wahrheit', datei)); W.set(id, w);
    const wBlind = !w.gefaehrdungen.some(g => g.bibliothek); if (!wBlind) blind = false;
    const fp = path.join(ordner, 'faelle', datei);
    if (!fs.existsSync(fp)) { zeilen.push(`| ${id} | ${w.arbeitsplatz} | kein Fall | | | | | | |`); continue; }
    const fall = lies(fp); let system = new Set(), offen = new Set(), fehler = null;
    try { const e = auswerten(b, { ...fall, stationen: fall.stationen.filter(s => s.schritte.length) }); for (const s of e.stationen) for (const t of s.treffer) (t.status === 'trifft zu' ? system : offen).add(R.get(t.regel).gefaehrdung); for (const g of system) offen.delete(g); }
    catch (x) { fehler = x.message.split('\n')[1] || x.message; }
    const z = { id, arbeitsplatz: w.arbeitsplatz, branche: w.branche, getroffen: 0, nachfrage: 0, uebersehen: 0, ohneEintrag: 0, zusaetzlich: 0 }; const wahr = new Set();
    if (!wBlind) {
      for (const g of w.gefaehrdungen) {
        if (g.bibliothek && G.has(g.bibliothek)) { wahr.add(g.bibliothek);
          if (system.has(g.bibliothek)) { z.getroffen++; fk(g.faktor).getroffen++; } else if (offen.has(g.bibliothek)) { z.nachfrage++; fk(g.faktor).verfehlt++; } else { z.uebersehen++; fk(g.faktor).verfehlt++; L.uebersehen.push({ id, text: g.text, gefaehrdung: G.get(g.bibliothek).name, anlass: g.anlass }); } }
        else { z.ohneEintrag++; fk(g.faktor).verfehlt++; L.ohneEintrag.push({ id, text: g.text, faktor: g.faktor, anlass: g.anlass }); }
      }
      for (const g of system) if (!wahr.has(g)) { z.zusaetzlich++; L.zusaetzlich.push({ id, gefaehrdung: G.get(g).name }); }
    }
    for (const x of fall.wuensche || []) L.wuensche.push({ id, text: x.text, fehlt: x.fehlt });
    const schritte = fall.stationen.reduce((n, s) => n + s.schritte.length, 0);
    for (const k of ['getroffen', 'nachfrage', 'uebersehen', 'ohneEintrag', 'zusaetzlich']) summe[k] += z[k];
    summe.wuensche += (fall.wuensche || []).length; summe.maengel += (fall.maengel || []).length; summe.schritte += schritte;
    const alle = z.getroffen + z.nachfrage + z.uebersehen + z.ohneEintrag;
    zeilen.push(`| ${id} | ${w.arbeitsplatz} | ${fehler ? 'Fehler: ' + fehler : schritte + ' Schritte, ' + (fall.wuensche || []).length + ' Wünsche'} | ${z.getroffen} | ${z.nachfrage} | ${z.uebersehen} | ${z.ohneEintrag} | ${z.zusaetzlich} | ${alle ? Math.round(100 * z.getroffen / alle) + ' %' : ''} |`);
    faelle.push(z);
  }
  // Urteile des Schiedsrichters
  const U = { getroffen: 0, rueckfrage: 0, verfehlt: 0, unbegruendet: 0, zBerechtigt: 0, zUnbegruendet: 0 }; let hatUrteil = false; const uz = [];
  if (fs.existsSync(path.join(ordner, 'urteil'))) for (const d of fs.readdirSync(path.join(ordner, 'urteil')).filter(x => x.endsWith('.json')).sort()) {
    hatUrteil = true; const u = lies(path.join(ordner, 'urteil', d)); const w = W.get(u.id) || { gefaehrdungen: [], arbeitsplatz: '' }; const c = { getroffen: 0, rueckfrage: 0, verfehlt: 0, unbegruendet: 0 };
    for (const x of u.wahrheit || []) { if (c[x.urteil] === undefined) continue; c[x.urteil]++; U[x.urteil]++; const g = w.gefaehrdungen[x.nr - 1] || {};
      if (blind && x.urteil !== 'unbegruendet') fk(g.faktor)[x.urteil === 'getroffen' ? 'getroffen' : 'verfehlt']++;
      const e = { id: u.id, text: g.text, faktor: g.faktor, anlass: g.anlass, grund: x.grund };
      if (x.urteil === 'verfehlt') L.verfehlt.push(e); else if (x.urteil === 'rueckfrage') L.rueckfrage.push({ ...e, system: x.system }); else if (x.urteil === 'unbegruendet') L.wUnbegruendet.push(e); }
    let zb = 0, zu = 0; for (const x of u.zusaetzlich || []) { if (x.urteil === 'berechtigt') { zb++; U.zBerechtigt++; L.zBerechtigt.push({ id: u.id, ...x }); } else { zu++; U.zUnbegruendet++; L.zUnbegruendet.push({ id: u.id, ...x }); } }
    const n = c.getroffen + c.rueckfrage + c.verfehlt;
    uz.push(`| ${u.id} | ${w.arbeitsplatz} | ${c.getroffen} | ${c.rueckfrage} | ${c.verfehlt} | ${c.unbegruendet} | ${zb} | ${zu} | ${n ? Math.round(100 * c.getroffen / n) + ' %' : ''} |`);
  }
  const un = U.getroffen + U.rueckfrage + U.verfehlt; const uquote = un ? Math.round(100 * U.getroffen / un) : null;
  const alle = summe.getroffen + summe.nachfrage + summe.uebersehen + summe.ohneEintrag; const kquote = alle ? Math.round(100 * summe.getroffen / alle) : null;
  const runde = path.basename(ordner);
  const out = [`# Runde ${runde}`, '', `Bibliothek: ${b.regeln.length} Regeln, ${b.woerterbuch.length} Wörterbucheinträge. Übersetzung: ${summe.schritte} Schritte zugeordnet, ${summe.wuensche} Wünsche offen, ${summe.maengel} Mängel getrennt erfasst.`, ''];
  if (!blind) out.push(`**Trefferquote nach Kennung ${kquote} %**: ${summe.getroffen} getroffen, ${summe.nachfrage} nur als Rückfrage erkannt, ${summe.uebersehen} übersehen, ${summe.ohneEintrag} ohne Eintrag in der Bibliothek. Zusätzlich vom System: ${summe.zusaetzlich}.`, '',
    '| Kennung | Arbeitsplatz | Übersetzung | getroffen | Rückfrage | übersehen | ohne Eintrag | zusätzlich | Quote |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |', ...zeilen, '');
  else out.push('Blinde Runde: Der Sprecher kannte die Bibliothek nicht. Es zählt allein das Urteil des Schiedsrichters.', '');
  if (hatUrteil) out.push('## Urteil des Schiedsrichters', '', `**Trefferquote nach Bedeutung ${uquote} %**: ${U.getroffen} getroffen, ${U.rueckfrage} nur als Rückfrage, ${U.verfehlt} verfehlt. Nicht gezählt: ${U.unbegruendet} unbegründete Wahrheiten. Zusatzfunde des Systems: ${U.zBerechtigt} berechtigt, ${U.zUnbegruendet} unbegründet.`, '',
    '| Kennung | Arbeitsplatz | getroffen | Rückfrage | verfehlt | Wahrheit unbegründet | Zusatz berechtigt | Zusatz unbegründet | Quote |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |', ...uz, '');
  out.push('## Je Gefährdungsfaktor', '', '| Faktor | getroffen | verfehlt |', '| --- | --- | --- |', ...Object.keys(jeFaktor).filter(k => F.has(Number(k))).sort((a, c) => a - c).map(k => `| ${k} ${F.get(Number(k))} | ${jeFaktor[k].getroffen} | ${jeFaktor[k].verfehlt} |`), '');
  if (hatUrteil) out.push('## Verfehlt', '', ...L.verfehlt.map(x => `- ${x.id} (Faktor ${x.faktor}): ${x.text}. Anlass: „${x.anlass}“. Schiedsrichter: ${x.grund}`), '',
    '## Nur als Rückfrage erkannt', '', ...L.rueckfrage.map(x => `- ${x.id} (Faktor ${x.faktor}): ${x.text} → ${x.system || ''}. ${x.grund}`), '',
    '## Zusatzfunde ohne Anlass im Protokoll', '', ...L.zUnbegruendet.map(x => `- ${x.id}: ${x.gefaehrdung}. ${x.grund}`), '',
    '## Berechtigte Zusatzfunde', '', ...L.zBerechtigt.map(x => `- ${x.id}: ${x.gefaehrdung}. ${x.grund}`), '',
    '## Wahrheiten, die der Schiedsrichter nicht gelten ließ', '', ...L.wUnbegruendet.map(x => `- ${x.id}: ${x.text}. ${x.grund}`), '');
  if (!blind) out.push('## Übersehen: Gefährdung ist in der Bibliothek, aber keine Regel hat ausgelöst', '', ...L.uebersehen.map(x => `- ${x.id}: ${x.text} (${x.gefaehrdung}). Anlass: „${x.anlass}“`), '',
    '## Ohne Eintrag: Gefährdung fehlt in der Bibliothek', '', ...L.ohneEintrag.map(x => `- ${x.id}: ${x.text} (Faktor ${x.faktor}). Anlass: „${x.anlass}“`), '',
    '## Zusätzlich vom System gefunden', '', ...L.zusaetzlich.map(x => `- ${x.id}: ${x.gefaehrdung}`), '');
  out.push('## Wünsche des Übersetzers: fehlende Stammdaten', '', ...L.wuensche.map(x => `- ${x.id}: „${x.text}“ → ${x.fehlt}`), '');
  const ergebnis = { runde, blind, regeln: b.regeln.length, quote: blind ? uquote : kquote, summe, faelle, jeFaktor, schiedsrichter: hatUrteil ? { quote: uquote, ...U } : null };
  fs.writeFileSync(path.join(ordner, 'bericht.md'), out.join('\n')); fs.writeFileSync(path.join(ordner, 'ergebnis.json'), JSON.stringify(ergebnis, null, 1));
  return { ergebnis, kopf: out.slice(0, 8).join('\n') };
}
module.exports = { werteRunde };
if (require.main === module) { const r = werteRunde(process.argv[2]); console.log(r.kopf); if (r.ergebnis.schiedsrichter) { const s = r.ergebnis.schiedsrichter; console.log(`Schiedsrichter: ${s.quote} % (${s.getroffen}/${s.getroffen + s.rueckfrage + s.verfehlt}), Zusatz berechtigt ${s.zBerechtigt}, unbegründet ${s.zUnbegruendet}, Wahrheit unbegründet ${s.unbegruendet}`); } }
