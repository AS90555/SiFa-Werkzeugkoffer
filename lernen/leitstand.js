#!/usr/bin/env node
'use strict';
// Der Leitstand: Wo steht das System, und was ist als Nächstes fällig? Schreibt LEITSTAND.md.
// Aufruf: node lernen/leitstand.js
const fs = require('fs'); const path = require('path'); const W = path.join(__dirname, '..'); const lies = p => JSON.parse(fs.readFileSync(p, 'utf8')); const gibt = p => fs.existsSync(p);
const { stand, RUNDEN } = require('./runde'); const { belegstand } = require('../beleg/stand');
const faellig = [], wartet = [], warnung = []; let b = null;
try { b = require('../kern/laden').ladeBibliothek(path.join(W, 'bibliothek')); } catch (x) { faellig.push('**Bibliothek reparieren.** ' + x.message.split('\n').slice(0, 4).join(' ')); }
const regeln = lies(path.join(W, 'bibliothek', 'regeln.json')), pflichten = lies(path.join(W, 'bibliothek', 'pflichten.json')); const bs = belegstand(regeln, pflichten);
const pz = (a, n) => (n ? Math.round(100 * a / n) : 0);
// Beleg-Läufe
const ld = path.join(W, 'beleg', 'laeufe'); const laeufe = gibt(ld) ? fs.readdirSync(ld).filter(x => /^B\d{3}$/.test(x)).sort() : []; const lz = [];
for (const l of laeufe) { const o = path.join(ld, l); const soll = fs.readdirSync(path.join(o, 'pakete')).length, ist = fs.readdirSync(path.join(o, 'berichte')).length; const e = gibt(path.join(o, 'ergebnis.json')) ? lies(path.join(o, 'ergebnis.json')) : null;
  if (ist < soll) faellig.push(`**Beleg-Lauf ${l} fertig prüfen:** ${ist} von ${soll} Berichten liegen vor. Aufträge unter \`beleg/laeufe/${l}/auftraege/\`.`);
  else if (!e || !e.uebernommen) faellig.push(`**Beleg-Lauf ${l} zusammenführen:** \`node beleg/zusammenfuehren.js ${l}\`, Bericht ansehen, dann mit \`--uebernehmen\`.`);
  lz.push(`| ${l} | ${e ? e.eintraege.length : ''} | ${e ? e.zaehler.geprueft : ''} | ${e ? e.zaehler.teilweise + e.zaehler.offen : ''} | ${e ? e.zaehler.strittig : ''} | ${e ? e.zitateVerworfen : ''} | ${e && e.uebernommen ? 'übernommen' : ist < soll ? 'läuft' : 'wartet auf Zusammenführen'} |`); }
const letzterLauf = laeufe.length ? path.join(ld, laeufe[laeufe.length - 1], 'fehlende-quellen.md') : null;
if (letzterLauf && gibt(letzterLauf)) { const n = fs.readFileSync(letzterLauf, 'utf8').split('\n').filter(x => x.startsWith('- ')); if (n.length) faellig.push(`**Regelwerk nachladen (${n.length} Dokumente fehlen):** ohne sie bleiben die zugehörigen Regeln ungeprüft. Liste in \`beleg/laeufe/${laeufe[laeufe.length - 1]}/fehlende-quellen.md\`.`); }
// Runden
const verlauf = lies(path.join(__dirname, 'verlauf.json')); const TEXT = { sprecher: 'Sprecher laufen lassen', uebersetzer: 'Übersetzer laufen lassen', system: `Systemlisten schreiben`, schiedsrichter: 'Schiedsrichter laufen lassen', auswerten: 'auswerten' };
let offeneRunde = false;
for (const nr of fs.readdirSync(RUNDEN).filter(x => /^R\d{3}$/.test(x)).sort()) { const s = stand(nr); if (s.alt || s.stufe === 'fertig') continue; offeneRunde = true;
  if (s.stufe === 'luecken') faellig.push(`**Lücken aus ${nr} schließen:** Bericht \`lernen/runden/${nr}/bericht.md\`. Reihenfolge: Wörterbuch, Stammdaten, Regeln (als Entwurf mit offenem Beleg). Danach \`node lernen/runde.js geschlossen ${nr}\`.`);
  else faellig.push(`**Runde ${nr} fortsetzen:** ${TEXT[s.stufe]}${s.stufe === 'system' ? ` (\`node lernen/runde.js system ${nr}\`)` : s.stufe === 'auswerten' ? ` (\`node lernen/runde.js auswerten ${nr}\`)` : `. Aufträge unter \`lernen/runden/${nr}/auftraege/\``}.`); }
const pr = verlauf.filter(v => v.art === 'pruef' && v.feld === 'bghm'); if (pr.length >= 2) { const a = pr[pr.length - 1], v = pr[pr.length - 2];
  if (a.quote < v.quote) warnung.push(a.blind && !v.blind ? `Die Quote von ${a.runde} (${a.quote} %) liegt unter ${v.runde} (${v.quote} %). Die Zahlen sind nicht vergleichbar: Seit ${a.runde} kennt der Sprecher die Bibliothek nicht mehr. ${a.runde} ist der neue Ausgangswert.` : `Stopp-Regel: Die Quote ist von ${v.quote} % (${v.runde}) auf ${a.quote} % (${a.runde}) gefallen. Erst die Ursache klären, dann weiter füttern.`); }
// Belege und Freigabe
const qd = pz(bs.regeln.doppelt, bs.regeln.alle); const laufOffen = faellig.some(x => x.includes('Beleg-Lauf'));
if (qd < 25 && !laufOffen) faellig.push(`**Beleg-Lauf starten** (Stopp-Regel: erst ${qd} % der Regeln sind doppelt belegt, Ziel mindestens 25 % vor der nächsten Lernrunde): \`node beleg/vorbereiten.js\`.`);
const fd = path.join(W, 'freigabe'); const fp = fs.readdirSync(fd).filter(x => /^F\d{3}\.json$/.test(x)).map(x => lies(path.join(fd, x))); const offenF = fp.filter(p => p.status === 'offen'); const inPaket = new Set(offenF.flatMap(p => p.eintraege.map(e => e.id)));
for (const p of offenF) wartet.push(`**Freigabe-Paket ${p.paket}:** ${p.eintraege.length} doppelt belegte Einträge warten auf deine Entscheidung. Datei \`freigabe/${p.paket}.md\`.`);
const reif = [...regeln, ...pflichten].filter(e => e.belegstand && e.belegstand.pruefungen >= 2 && e.freigabe === 'entwurf' && !inPaket.has(e.id)).length;
if (reif >= 5) faellig.push(`**Freigabe-Paket zusammenstellen:** ${reif} doppelt belegte Einträge sind reif. \`node freigabe/paket.js\`.`);
if (!gibt(path.join(W, 'bibliothek', 'maengel.json'))) faellig.push('**Mängel-Schicht bauen**, bevor weiter trainiert wird: Beobachtungen zum Ist-Zustand (defekt, fehlt, verstellt, nicht getragen) werden bisher erfasst, aber nicht ausgewertet. An Andres eigenem Protokoll durchspielen.');
// Trainingsfeld BGHM: zwei Lernrunden, dann eine Prüfrunde. Ziel: zweimal hintereinander mindestens 80 %.
const feldRunden = verlauf.filter(v => v.feld === 'bghm'); const seitPruef = []; for (let i = feldRunden.length - 1; i >= 0 && feldRunden[i].art === 'lern'; i--) seitPruef.push(feldRunden[i]);
const feldPruef = feldRunden.filter(v => v.art === 'pruef'); const zielErreicht = feldPruef.length >= 2 && feldPruef.slice(-2).every(v => v.quote >= 80);
if (!offeneRunde && !faellig.some(x => x.includes('Beleg-Lauf starten'))) faellig.push(zielErreicht ? '**Ziel erreicht:** zwei Prüfrunden im Feld BGHM mit mindestens 80 %. Weiter mit Meilenstein 3 der Roadmap.' : seitPruef.length >= 2 ? '**Prüfrunde im Feld BGHM** (16 Arbeitsplätze): `node lernen/runde.js neu pruef`.' : `**Lernrunde im Feld BGHM** (${seitPruef.length + 1}. von 2 vor der nächsten Prüfrunde): \`node lernen/runde.js neu lern\`.`);
const eigene = gibt(path.join(W, 'protokolle')) ? fs.readdirSync(path.join(W, 'protokolle')).filter(x => /^\d{4}-/.test(x)).length : 0;
if (!eigene) wartet.push('**Eigenes Protokoll:** Noch kein echtes Rundgangsprotokoll von dir. Erzeugte Protokolle finden Lücken, dein Protokoll ist der Maßstab.');
const abd = lies(path.join(__dirname, 'abdeckung.json')).auftraege; const letzte = verlauf[verlauf.length - 1];
const md = ['# Leitstand', '', `Stand nach ${letzte.runde}${laeufe.length ? ' und Beleg-Lauf ' + laeufe[laeufe.length - 1] : ''}. Diese Datei schreibt \`node lernen/leitstand.js\`; nicht von Hand ändern.`, '',
  '## Als Nächstes fällig', '', ...(faellig.length ? faellig.map((x, i) => `${i + 1}. ${x}`) : ['Nichts fällig.']), '', '## Wartet auf Andre', '', ...(wartet.length ? wartet.map(x => `- ${x}`) : ['Nichts.']), '',
  ...(warnung.length ? ['## Hinweise', '', ...warnung.map(x => `- ${x}`), ''] : []),
  '## Kennzahlen', '', '| Größe | Wert |', '| --- | --- |',
  ...(b ? [`| Regeln | ${b.regeln.length} |`, `| Organisationspflichten | ${b.pflichten.length} |`, `| Gefährdungen | ${b.gefaehrdungen.length} |`, `| Stammdaten | ${Object.values(b.stammdaten).reduce((n, l) => n + l.length, 0)} |`, `| Wörterbuch | ${b.woerterbuch.length} |`] : []),
  `| Regeln doppelt belegt | ${bs.regeln.doppelt} von ${bs.regeln.alle} (${qd} %) |`, `| Regeln nur einfach geprüft | ${bs.regeln.einfach} |`, `| Pflichten doppelt belegt | ${bs.pflichten.doppelt} von ${bs.pflichten.alle} |`,
  `| Von Andre freigegeben | ${bs.regeln.freigegeben} Regeln, ${bs.pflichten.freigegeben} Pflichten |`, `| Freie Aufträge im Abdeckungsplan | ${abd.filter(a => !a.genutzt).length} von ${abd.length} |`, '',
  '## Runden', '', '| Runde | Art | Plätze | Maß | Quote | getroffen | Zusatz berechtigt | Zusatz typisch | Zusatz unbegründet | Lücken bearbeitet |', '| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...verlauf.map(v => `| ${v.runde} | ${v.art === 'pruef' ? 'Prüfrunde' : 'Lernrunde'}${v.feld ? ', ' + v.feld : ''} | ${v.plaetze} | ${v.blind ? 'blind, Schiedsrichter' : v.mass === 'schiedsrichter' ? 'Schiedsrichter' : 'Kennung'} | ${v.quote} % | ${v.getroffen} von ${v.gewertet} | ${v.zusatzBerechtigt ?? ''} | ${v.zusatzTypisch ?? ''} | ${v.zusatzUnbegruendet ?? ''} | ${v.geschlossen ? 'ja' : 'nein'} |`), '',
  ...(lz.length ? ['## Beleg-Läufe', '', '| Lauf | Einträge | geprüft | teilweise oder offen | strittig | verworfene Zitate | Stand |', '| --- | --- | --- | --- | --- | --- | --- |', ...lz, ''] : [])];
fs.writeFileSync(path.join(W, 'LEITSTAND.md'), md.join('\n')); console.log(md.slice(4, 4 + faellig.length + 6 + wartet.length).join('\n'));
