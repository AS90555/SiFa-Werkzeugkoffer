#!/usr/bin/env node
'use strict';
// Stellt einen Beleg-Lauf zusammen: wählt die meistgenutzten, noch nicht doppelt geprüften Regeln und Pflichten,
// teilt sie in Pakete und schreibt die Aufträge für Prüfer (A) und Gegenprüfer (B).
// Aufruf: node beleg/vorbereiten.js [--regeln 18] [--pflichten 6] [--pakete 2]
const fs = require('fs'); const path = require('path');
const { ladeBibliothek, fingerabdruck } = require('../kern/laden'); const { auswerten } = require('../kern/auswerten'); const { klartext } = require('../kern/klartext');
const { ORT, WURZEL, textDateien } = require('./text');
const arg = (n, d) => { const i = process.argv.indexOf('--' + n); return i > 0 ? Number(process.argv[i + 1]) : d; };
const nRegeln = arg('regeln', 18), nPflichten = arg('pflichten', 6), nPakete = arg('pakete', 2);
const b = ladeBibliothek(path.join(WURZEL, 'bibliothek')); const lies = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const Q = new Map(b.quellen.map(q => [q.id, q])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g]));

// Wie oft löst jede Regel in den vorhandenen Fällen aus?
const nutzung = {}; const faelle = [path.join(WURZEL, 'faelle')];
const rd = path.join(WURZEL, 'lernen', 'runden'); if (fs.existsSync(rd)) for (const r of fs.readdirSync(rd)) faelle.push(path.join(rd, r, 'faelle'));
for (const o of faelle) if (fs.existsSync(o)) for (const d of fs.readdirSync(o).filter(x => x.endsWith('.json'))) {
  try { const fall = lies(path.join(o, d)); const e = auswerten(b, { ...fall, stationen: fall.stationen.filter(s => s.schritte.length) });
    for (const s of e.stationen) for (const t of s.treffer) nutzung[t.regel] = (nutzung[t.regel] || 0) + 1; } catch (x) { /* fehlerhafter Fall zählt nicht */ }
}
const doppelt = e => e.belegstand && e.belegstand.pruefungen >= 2;
const quellenInfo = e => (e.quellen || []).map(q => ({ ...q, q: Q.get(q.id), texte: textDateien(Q.get(q.id)) }));
const fehlend = {};
function eintrag(art, e) {
  const qi = quellenInfo(e); for (const q of qi) if (!q.texte.length && !q.q.verweis) (fehlend[q.id] = fehlend[q.id] || []).push(e.id);
  const mitText = qi.filter(q => q.texte.length); if (!mitText.length) return null;
  const aussagen = art === 'regel' ? e.massnahmen.filter(m => m.grundlage !== 'erfahrung').map(m => ({ id: m.id, text: m.text })) : [{ id: e.id, text: e.pflicht }];
  if (!aussagen.length) return null;
  return { art, id: e.id, fingerabdruck: fingerabdruck(e), name: e.name, gilt_wenn: klartext(b, e.wenn),
    ...(art === 'regel' ? { entsteht: e.entsteht, gefaehrdung: G.get(e.gefaehrdung).name, verbindlichkeit: e.verbindlichkeit } : {}),
    aussagen, quellen: mitText.map(q => ({ id: q.id, titel: q.q.titel, stufe: q.q.stufe, textdateien: q.texte, behauptete_stelle: q.stelle || null })) };
}
const regeln = b.regeln.filter(r => !doppelt(r) && r.beleg !== 'ohne-beleg').map(r => ({ e: eintrag('regel', r), n: nutzung[r.id] || 0 })).filter(x => x.e)
  .sort((x, y) => y.n - x.n || x.e.id.localeCompare(y.e.id)).slice(0, nRegeln).map(x => x.e);
const pflichten = b.pflichten.filter(p => !doppelt(p)).map(p => eintrag('pflicht', p)).filter(Boolean).slice(0, nPflichten);
const alle = [...regeln, ...pflichten];
if (!alle.length) { console.log('Nichts zu prüfen: alle prüfbaren Einträge sind doppelt geprüft.'); process.exit(0); }

const ld = path.join(WURZEL, 'beleg', 'laeufe'); fs.mkdirSync(ld, { recursive: true });
const nr = 'B' + String(fs.readdirSync(ld).filter(x => /^B\d{3}$/.test(x)).length + 1).padStart(3, '0');
const ordner = path.join(ld, nr); for (const u of ['pakete', 'auftraege', 'berichte']) fs.mkdirSync(path.join(ordner, u), { recursive: true });
const pakete = Array.from({ length: Math.min(nPakete, alle.length) }, () => []); alle.forEach((e, i) => pakete[i % pakete.length].push(e));
const ohneStelle = e => ({ ...e, quellen: e.quellen.map(({ behauptete_stelle, ...q }) => q) });
pakete.forEach((p, i) => {
  const name = 'P' + (i + 1);
  for (const [rolle, datei, inhalt] of [['A', 'beleg-pruefer', p], ['B', 'gegenpruefer', p.map(ohneStelle)]]) {
    const pf = path.join(ordner, 'pakete', `${name}-${rolle}.json`), bf = path.join(ordner, 'berichte', `${name}-${rolle}.json`);
    fs.writeFileSync(pf, JSON.stringify({ lauf: nr, paket: name, pruefer: rolle, textordner: ORT, eintraege: inhalt }, null, 1));
    fs.writeFileSync(path.join(ordner, 'auftraege', `${name}-${rolle}.md`), [
      `# Auftrag ${nr} ${name}-${rolle}`, '',
      `Du arbeitest als ${rolle === 'A' ? 'Beleg-Prüfer' : 'Gegenprüfer'} für eine Sammlung von Arbeitsschutz-Regeln. Lies zuerst deine Arbeitsanweisung vollständig: \`${path.join(WURZEL, 'agenten', datei + '.md')}\``, '',
      `- Dein Paket (${p.length} Einträge): \`${pf}\``,
      `- Die Regelwerkstexte liegen unter: \`${ORT}\` (reine Textdateien, mit grep durchsuchbar)`,
      `- Schreibe deinen Bericht nach: \`${bf}\``,
      `- Prüfe ihn mit: \`cd ${WURZEL} && node beleg/pruefe-bericht.js ${bf}\` und bessere nach, bis dort „in Ordnung“ steht.`, '',
      `Lies keine anderen Dateien unter \`${path.join(ordner, 'berichte')}\` und keine anderen Pakete. Ändere nichts außer deiner Berichtsdatei.`,
      'Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten.', 'Antworte am Ende nur mit drei Zeilen: Zahl der gedeckten Aussagen, Zahl der nicht gedeckten, Zahl der Widersprüche.', ''].join('\n'));
  }
});
const fz = Object.keys(fehlend).sort().map(id => `- ${Q.get(id).titel} (\`${id}\`): gebraucht von ${[...new Set(fehlend[id])].join(', ')}`);
fs.writeFileSync(path.join(ordner, 'fehlende-quellen.md'), ['# Quellen ohne Text im Regelwerk-Ordner', '', 'Diese Einträge lassen sich erst prüfen, wenn das Dokument abgelegt ist.', '', ...fz, ''].join('\n'));
console.log(`${nr}: ${regeln.length} Regeln, ${pflichten.length} Pflichten in ${pakete.length} Paketen, ${alle.reduce((n, e) => n + e.aussagen.length, 0)} Aussagen.`);
console.log(`Aufträge: ${path.join(ordner, 'auftraege')}`); console.log(`Quellen ohne Text: ${fz.length}`);
