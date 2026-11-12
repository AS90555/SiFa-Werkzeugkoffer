#!/usr/bin/env node
'use strict';
// Wertet eine Lernrunde aus: Fälle rechnen, mit der verdeckten Wahrheit vergleichen, Bericht schreiben.
// Aufruf: node lernen/auswerten.js lernen/runden/R001
const fs = require('fs'); const path = require('path');
const { ladeBibliothek } = require('../kern/laden'); const { auswerten } = require('../kern/auswerten');
const b = ladeBibliothek(path.join(__dirname, '..', 'bibliothek'));
const ordner = process.argv[2]; const lies = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const R = new Map(b.regeln.map(r => [r.id, r])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g])); const F = new Map(b.faktoren.faktoren.map(f => [f.nr, f.name]));
const zeilen = [], faelle = []; const summe = { getroffen: 0, nachfrage: 0, uebersehen: 0, ohneEintrag: 0, zusaetzlich: 0, wuensche: 0, schritte: 0 };
const luecken = { uebersehen: [], ohneEintrag: [], wuensche: [], zusaetzlich: [] }; const jeFaktor = {};
for (const datei of fs.readdirSync(path.join(ordner, 'wahrheit')).filter(x => x.endsWith('.json')).sort()) {
  const id = datei.replace('.json', ''); const w = lies(path.join(ordner, 'wahrheit', datei));
  const fp = path.join(ordner, 'faelle', datei);
  if (!fs.existsSync(fp)) { zeilen.push(`| ${id} | ${w.arbeitsplatz} | kein Fall | | | | |`); continue; }
  const fall = lies(fp); let system = new Set(), offen = new Set(), fehler = null;
  try { const e = auswerten(b, { ...fall, stationen: fall.stationen.filter(s => s.schritte.length) }); for (const s of e.stationen) for (const t of s.treffer) (t.status === 'trifft zu' ? system : offen).add(R.get(t.regel).gefaehrdung); for (const g of system) offen.delete(g); }
  catch (x) { fehler = x.message.split('\n')[1] || x.message; }
  const z = { id, arbeitsplatz: w.arbeitsplatz, branche: w.branche, getroffen: 0, nachfrage: 0, uebersehen: 0, ohneEintrag: 0, zusaetzlich: 0 };
  const wahr = new Set();
  for (const g of w.gefaehrdungen) {
    const fk = jeFaktor[g.faktor] = jeFaktor[g.faktor] || { getroffen: 0, verfehlt: 0 };
    if (g.bibliothek && G.has(g.bibliothek)) { wahr.add(g.bibliothek);
      if (system.has(g.bibliothek)) { z.getroffen++; fk.getroffen++; } else if (offen.has(g.bibliothek)) { z.nachfrage++; fk.verfehlt++; } else { z.uebersehen++; fk.verfehlt++; luecken.uebersehen.push({ id, text: g.text, gefaehrdung: G.get(g.bibliothek).name, anlass: g.anlass }); } }
    else { z.ohneEintrag++; fk.verfehlt++; luecken.ohneEintrag.push({ id, text: g.text, faktor: g.faktor, anlass: g.anlass }); }
  }
  for (const g of system) if (!wahr.has(g)) { z.zusaetzlich++; luecken.zusaetzlich.push({ id, gefaehrdung: G.get(g).name }); }
  for (const x of fall.wuensche || []) luecken.wuensche.push({ id, text: x.text, fehlt: x.fehlt });
  const schritte = fall.stationen.reduce((n, s) => n + s.schritte.length, 0);
  summe.getroffen += z.getroffen; summe.nachfrage += z.nachfrage; summe.uebersehen += z.uebersehen; summe.ohneEintrag += z.ohneEintrag; summe.zusaetzlich += z.zusaetzlich; summe.wuensche += (fall.wuensche || []).length; summe.schritte += schritte;
  const alle = z.getroffen + z.nachfrage + z.uebersehen + z.ohneEintrag;
  zeilen.push(`| ${id} | ${w.arbeitsplatz} | ${fehler ? 'Fehler: ' + fehler : schritte + ' Schritte, ' + (fall.wuensche || []).length + ' Wünsche'} | ${z.getroffen} | ${z.nachfrage} | ${z.uebersehen} | ${z.ohneEintrag} | ${z.zusaetzlich} | ${alle ? Math.round(100 * z.getroffen / alle) + ' %' : ''} |`);
  faelle.push(z);
}
// Urteile des Schiedsrichters, falls vorhanden
const U = { getroffen: 0, rueckfrage: 0, verfehlt: 0, unbegruendet: 0, zBerechtigt: 0, zUnbegruendet: 0 }; let hatUrteil = false; const uz = [];
if (fs.existsSync(path.join(ordner, 'urteil'))) for (const d of fs.readdirSync(path.join(ordner, 'urteil')).filter(x => x.endsWith('.json')).sort()) {
  hatUrteil = true; const u = lies(path.join(ordner, 'urteil', d)); const c = { getroffen: 0, rueckfrage: 0, verfehlt: 0, unbegruendet: 0 };
  for (const w of u.wahrheit || []) if (c[w.urteil] !== undefined) { c[w.urteil]++; U[w.urteil]++; }
  let zb = 0, zu = 0; for (const z of u.zusaetzlich || []) { if (z.urteil === 'berechtigt') { zb++; U.zBerechtigt++; } else { zu++; U.zUnbegruendet++; } }
  const n = c.getroffen + c.rueckfrage + c.verfehlt;
  uz.push(`| ${u.id} | ${c.getroffen} | ${c.rueckfrage} | ${c.verfehlt} | ${c.unbegruendet} | ${zb} | ${zu} | ${n ? Math.round(100 * c.getroffen / n) + ' %' : ''} |`);
}
const un = U.getroffen + U.rueckfrage + U.verfehlt; const uquote = un ? Math.round(100 * U.getroffen / un) : null;
const alle = summe.getroffen + summe.nachfrage + summe.uebersehen + summe.ohneEintrag; const quote = alle ? Math.round(100 * summe.getroffen / alle) : null;
const out = [`# Lernrunde ${path.basename(ordner)}`, '', `Bibliothek: ${b.regeln.length} Regeln, ${b.woerterbuch.length} Wörterbucheinträge.`, '',
  `**Trefferquote ${quote} %**: ${summe.getroffen} getroffen, ${summe.nachfrage} nur als Rückfrage erkannt, ${summe.uebersehen} übersehen, ${summe.ohneEintrag} ohne Eintrag in der Bibliothek. Zusätzlich vom System: ${summe.zusaetzlich}. Übersetzung: ${summe.schritte} Schritte zugeordnet, ${summe.wuensche} Wünsche offen.`, '',
  '| Kennung | Arbeitsplatz | Übersetzung | getroffen | Rückfrage | übersehen | ohne Eintrag | zusätzlich | Quote |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- |', ...zeilen, '',
  ...(hatUrteil ? ['## Urteil des Schiedsrichters', '', `**Trefferquote nach Bedeutung ${uquote} %**: ${U.getroffen} getroffen, ${U.rueckfrage} nur als Rückfrage, ${U.verfehlt} verfehlt. Nicht gezählt: ${U.unbegruendet} unbegründete Wahrheiten. Zusatzfunde des Systems: ${U.zBerechtigt} berechtigt, ${U.zUnbegruendet} unbegründet.`, '', '| Kennung | getroffen | Rückfrage | verfehlt | Wahrheit unbegründet | Zusatz berechtigt | Zusatz unbegründet | Quote |', '| --- | --- | --- | --- | --- | --- | --- | --- |', ...uz, ''] : []),
  '## Je Gefährdungsfaktor', '', '| Faktor | getroffen | verfehlt |', '| --- | --- | --- |', ...Object.keys(jeFaktor).sort((a, c) => a - c).map(k => `| ${k} ${F.get(Number(k))} | ${jeFaktor[k].getroffen} | ${jeFaktor[k].verfehlt} |`), '',
  '## Übersehen: Gefährdung ist in der Bibliothek, aber keine Regel hat ausgelöst', '', ...luecken.uebersehen.map(x => `- ${x.id}: ${x.text} (${x.gefaehrdung}). Anlass: „${x.anlass}“`), '',
  '## Ohne Eintrag: Gefährdung fehlt in der Bibliothek', '', ...luecken.ohneEintrag.map(x => `- ${x.id}: ${x.text} (Faktor ${x.faktor}). Anlass: „${x.anlass}“`), '',
  '## Wünsche des Übersetzers: fehlende Stammdaten', '', ...luecken.wuensche.map(x => `- ${x.id}: „${x.text}“ → ${x.fehlt}`), '',
  '## Zusätzlich vom System gefunden', '', ...luecken.zusaetzlich.map(x => `- ${x.id}: ${x.gefaehrdung}`), ''];
fs.writeFileSync(path.join(ordner, 'bericht.md'), out.join('\n'));
fs.writeFileSync(path.join(ordner, 'ergebnis.json'), JSON.stringify({ runde: path.basename(ordner), regeln: b.regeln.length, quote, summe, faelle, jeFaktor, schiedsrichter: hatUrteil ? { quote: uquote, ...U } : null }, null, 1));
console.log(out.slice(0, 16).join('\n')); if (hatUrteil) console.log(`Schiedsrichter: ${uquote} % (${U.getroffen}/${un}), Zusatz berechtigt ${U.zBerechtigt}, unbegründet ${U.zUnbegruendet}, Wahrheit unbegründet ${U.unbegruendet}`);
