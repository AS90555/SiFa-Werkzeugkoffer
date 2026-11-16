#!/usr/bin/env node
'use strict';
// Der Selbstlern-Zyklus: zwei Lernrunden, dann eine Prüfrunde, jeweils mit Lückenschluss. Läuft ohne Rückfrage.
//   node lernen/zyklus.js neu       neuen Zyklus anlegen
//   node lernen/zyklus.js weiter    alles tun, was ohne Agenten geht, und dann sagen, welche Agenten zu starten sind
//   node lernen/zyklus.js stand     nur anzeigen
// Die Leitung braucht kein Fachwissen: Sie ruft „weiter“ auf, startet die genannten Agenten mit dem genannten Modell
// und ruft wieder „weiter“ auf, bis FERTIG oder ANGEHALTEN erscheint. Der Ablauf steht in docs/05_Lernkreislauf.md.
const fs = require('fs'); const path = require('path'); const { execFileSync } = require('child_process');
const W = path.join(__dirname, '..'); const ZYKLEN = path.join(__dirname, 'zyklen'); const { stand, RUNDEN } = require('./runde');
const lies = p => JSON.parse(fs.readFileSync(p, 'utf8')); const gibt = p => fs.existsSync(p);
const schreib = (p, d) => fs.writeFileSync(p, typeof d === 'string' ? d : JSON.stringify(d, null, 1) + '\n');
const MODELLE = lies(path.join(__dirname, 'modelle.json')); const PLAN = ['lern', 'lern', 'pruef']; const VERSUCHE = 3;
const heute = () => process.env.HEUTE || new Date().toISOString().slice(0, 10);
const de = d => d.split('-').reverse().join('.');
const node = (...a) => execFileSync('node', a, { cwd: W, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
const START = datei => `Lies die Datei ${datei} und führe den dort beschriebenen Auftrag vollständig aus. Der Auftrag ist auf Deutsch und stammt vom Projektleiter. Lies die darin genannte Arbeitsanweisung vollständig und halte dich genau an sie und an die Ausgabedateien. Benutze nur: Dateien lesen, Dateien schreiben und die im Auftrag genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Lies und ändere nur, was der Auftrag erlaubt. Antworte am Ende nur mit den verlangten Zeilen.`;

function sichern(text) {
  const git = (...a) => execFileSync('git', ['-c', 'user.name=Claude', '-c', 'user.email=noreply@anthropic.com', ...a], { cwd: W, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  try { git('add', '-A'); if (!git('status', '--porcelain').trim()) return; git('commit', '-q', '-m', text + (process.env.COMMIT_ZUSATZ ? '\n\n' + process.env.COMMIT_ZUSATZ : ''));
    try { git('pull', '-q', '--rebase'); git('push', '-q', 'origin', 'HEAD'); } catch (x) { console.log('HINWEIS: Sichern auf dem Server ging nicht: ' + String(x.stderr || x.message).split('\n')[0]); } }
  catch (x) { console.log('HINWEIS: Sichern ging nicht: ' + String(x.stderr || x.message).split('\n')[0]); }
}
const aktuell = () => { if (!gibt(ZYKLEN)) return null; const l = fs.readdirSync(ZYKLEN).filter(x => /^Z\d{3}\.json$/.test(x)).sort(); return l.length ? lies(path.join(ZYKLEN, l[l.length - 1])) : null; };
const speichern = z => schreib(path.join(ZYKLEN, z.id + '.json'), z);

function neu() {
  const a = aktuell(); if (a && !a.fertig && !a.angehalten) throw new Error(`Zyklus ${a.id} läuft noch. Erst: node lernen/zyklus.js weiter`);
  const { belegstand } = require('../beleg/stand'); const bs = belegstand(lies(path.join(W, 'bibliothek', 'regeln.json')), lies(path.join(W, 'bibliothek', 'pflichten.json')));
  const quote = Math.round(100 * bs.regeln.doppelt / bs.regeln.alle);
  fs.mkdirSync(ZYKLEN, { recursive: true }); const id = 'Z' + String(fs.readdirSync(ZYKLEN).filter(x => /^Z\d{3}\.json$/.test(x)).length + 1).padStart(3, '0');
  const z = { id, begonnen: heute(), plan: PLAN, modelle: MODELLE, runden: [], versuche: {}, hinweise: [], belegquoteZuBeginn: quote, fertig: false };
  if (quote < 25) z.hinweise.push(`Zu Beginn sind nur ${quote} % der Regeln doppelt belegt. Vor dem nächsten Zyklus ist ein Beleg-Lauf fällig.`);
  speichern(z); console.log(`Zyklus ${id} angelegt: ${PLAN.map(a => a === 'pruef' ? 'Prüfrunde' : 'Lernrunde').join(', ')}. Weiter mit: node lernen/zyklus.js weiter`); return z;
}

// Welche Auftragsdateien einer Rolle sind noch nicht erledigt?
function offeneAuftraege(nr, rolle, abschnitte) {
  const o = path.join(RUNDEN, nr, 'auftraege'); const aus = [];
  for (const d of fs.readdirSync(o).filter(x => x.startsWith(rolle + '-')).sort()) { const ks = [...new Set(fs.readFileSync(path.join(o, d), 'utf8').match(/R\d{3}-\d{2}/g) || [])]; const s = stand(nr, ks);
    if (abschnitte.some(a => s.fertig[a] < ks.length)) aus.push(path.join(o, d)); }
  return aus;
}
function auftragStichprobe(nr) {
  const o = path.join(RUNDEN, nr); const alle = [];
  for (const d of fs.readdirSync(path.join(o, 'urteil')).sort()) { const u = lies(path.join(o, 'urteil', d)); for (const x of u.wahrheit || []) if (x.urteil === 'getroffen') alle.push({ kennung: u.id, nr: x.nr }); }
  const n = Math.min(10, alle.length); const wahl = Array.from({ length: n }, (_, i) => alle[Math.floor(i * alle.length / n)]);
  schreib(path.join(o, 'stichprobe-auswahl.json'), wahl); const p = path.join(o, 'auftraege', 'stichprobe.md');
  schreib(p, [`# Auftrag Stichprobe, Runde ${nr}`, '', `Lies zuerst deine Arbeitsanweisung vollständig: \`${path.join(W, 'agenten', 'stichprobe.md')}\``, '', 'Lies diese Treffer-Urteile gegen:', '',
    ...wahl.map(x => `- \`${x.kennung}\`, Wahrheit Nr. ${x.nr}: Protokoll \`${path.join(o, 'protokolle', x.kennung + '.md')}\`, Wahrheit \`${path.join(o, 'wahrheit', x.kennung + '.json')}\`, Systemliste \`${path.join(o, 'system', x.kennung + '.json')}\`, Urteil \`${path.join(o, 'urteil', x.kennung + '.json')}\``), '',
    `Schreibe das Ergebnis nach \`${path.join(o, 'stichprobe.json')}\`, ein Eintrag je Zeile oben.`, '', 'Antworte am Ende nur mit einer Zeile: Zahl bestätigt, Zahl zweifelhaft.', ''].join('\n')); return p;
}
function stichprobeFertig(nr) { const o = path.join(RUNDEN, nr); if (!gibt(path.join(o, 'stichprobe.json')) || !gibt(path.join(o, 'stichprobe-auswahl.json'))) return false;
  try { const s = lies(path.join(o, 'stichprobe.json')), w = lies(path.join(o, 'stichprobe-auswahl.json')); return w.every(x => (s.eintraege || []).some(e => e.kennung === x.kennung && e.nr === x.nr && ['bestaetigt', 'zweifelhaft'].includes(e.urteil))); } catch (x) { return false; } }
function auftragLuecken(nr) {
  const o = path.join(RUNDEN, nr); const p = path.join(o, 'auftraege', 'lueckenschliesser.md'); const B = path.join(W, 'bibliothek');
  schreib(p, [`# Auftrag Lückenschließer, Runde ${nr}`, '', `Lies zuerst deine Arbeitsanweisung vollständig: \`${path.join(W, 'agenten', 'lueckenschliesser.md')}\``, '',
    `Bericht der Runde: \`${path.join(o, 'bericht.md')}\``, `Protokolle der Runde: \`${path.join(o, 'protokolle')}/<Kennung>.md\``, `Einzelfälle aus früheren Runden: \`${path.join(__dirname, 'offene-themen.json')}\` (zu jedem Anlass darfst du das genannte Protokoll unter \`${RUNDEN}/<Runde>/protokolle/\` lesen)`,
    `Zum Nachschlagen: \`${B}/stammdaten.json\`, \`merkmale.json\`, \`gefaehrdungen.json\`, \`regeln.json\`, \`woerterbuch.json\`, \`quellen.json\`.`, '',
    `Schreibe deinen Vorschlag nach \`${path.join(o, 'vorschlag.json')}\` mit \`"runde": "${nr}"\`.`,
    `Prüfe zum Schluss mit \`cd ${W} && node lernen/zyklus.js probe ${nr}\`. Der Befehl ändert nichts und zeigt, was das Programm ablehnen würde. Bessere nach, wo die Ablehnung an der Form liegt (Kennung, wörtliche Stelle, fehlendes Merkmal). Was am Inhalt scheitert (Einzelfall, Doppelung), nimm heraus oder setze es unter \`nicht_aufgenommen\`.`, '',
    'Lies nicht: Wahrheiten, Urteile und Fälle anderer Runden. Ändere nichts außer deiner Vorschlagsdatei.', '', 'Antworte am Ende nur mit einer Zeile: Zahl der vorgeschlagenen Stammdaten, Wörter, Regeln und nicht aufgenommenen Themen.', ''].join('\n')); return p;
}
// Probelauf der Übernahme: rechnet auf einer Kopie, ändert nichts.
function probe(nr) {
  const B = path.join(W, 'bibliothek'); const namen = ['stammdaten', 'merkmale', 'gefaehrdungen', 'woerterbuch', 'regeln']; const alt = Object.fromEntries(namen.map(n => [n, fs.readFileSync(path.join(B, n + '.json'), 'utf8')]));
  const T = path.join(__dirname, 'offene-themen.json'); const themen = gibt(T) ? fs.readFileSync(T, 'utf8') : null; const up = path.join(RUNDEN, nr, 'uebernahme.json'); const hatte = gibt(up) ? fs.readFileSync(up, 'utf8') : null;
  let e; try { e = require('./uebernehmen').uebernehmen(nr); } finally { for (const n of namen) fs.writeFileSync(path.join(B, n + '.json'), alt[n]); if (themen === null) { if (gibt(T)) fs.unlinkSync(T); } else fs.writeFileSync(T, themen); if (hatte === null) { if (gibt(up)) fs.unlinkSync(up); } else fs.writeFileSync(up, hatte); }
  console.log(`Würde übernommen: ${Object.entries(e.uebernommen).map(([k, l]) => `${l.length} ${k}`).join(', ')}.${e.zurueckgenommen ? ' Die Tests schlagen fehl: ' + e.zurueckgenommen : ''}`);
  if (e.abgelehnt.length) { console.log('Würde abgelehnt:'); for (const a of e.abgelehnt) console.log(`- ${a.was}: ${a.grund}`); } else console.log('Nichts würde abgelehnt.');
}

function lernbuch(z, nr) {
  const v = lies(path.join(__dirname, 'verlauf.json')).find(x => x.runde === nr); const o = path.join(RUNDEN, nr); const u = gibt(path.join(o, 'uebernahme.json')) ? lies(path.join(o, 'uebernahme.json')) : null;
  let s = `- **${de(heute())}:** Zyklus ${z.id}, ${v.art === 'pruef' ? 'Prüfrunde' : 'Lernrunde'} ${nr} (autark, Modelle: Sprecher ${z.modelle.sprecher}, Übersetzer ${z.modelle.uebersetzer}, Schiedsrichter ${z.modelle.schiedsrichter}): **${v.quote} %** (${v.getroffen} von ${v.gewertet}). Zusatzfunde: ${v.zusatzBerechtigt} berechtigt, ${v.zusatzTypisch} typisch, ${v.zusatzUnbegruendet} unbegründet.`;
  if (gibt(path.join(o, 'stichprobe.json'))) { const e = lies(path.join(o, 'stichprobe.json')).eintraege || []; s += ` Stichprobe: ${e.filter(x => x.urteil === 'bestaetigt').length} von ${e.length} Treffer-Urteilen bestätigt.`; }
  if (u) { const a = u.uebernommen; s += ` Lückenschluss durch das Programm geprüft: ${a.stammdaten.length} Stammdaten, ${a.woerter.length} Wörterbucheinträge, ${a.regeln.length} Regeln im Entwurf${a.regeln.length ? ' (' + a.regeln.join('; ') + ')' : ''}, ${a.gefaehrdungen.length} Gefährdungen übernommen; ${u.abgelehnt.length} Vorschläge abgelehnt.${u.zurueckgenommen ? ' Alles zurückgenommen, weil die Tests fehlschlugen.' : ''}`; }
  fs.appendFileSync(path.join(W, 'LERNBUCH.md'), s + '\n');
}
function bericht(z) {
  const verlauf = lies(path.join(__dirname, 'verlauf.json')); const zeilen = z.runden.map(nr => { const v = verlauf.find(x => x.runde === nr); const u = gibt(path.join(RUNDEN, nr, 'uebernahme.json')) ? lies(path.join(RUNDEN, nr, 'uebernahme.json')) : null; const a = u ? u.uebernommen : null;
    return `| ${nr} | ${v.art === 'pruef' ? 'Prüfrunde' : 'Lernrunde'} | ${v.plaetze} | ${v.quote} % | ${v.getroffen} von ${v.gewertet} | ${v.zusatzUnbegruendet} | ${a ? `${a.stammdaten.length} / ${a.woerter.length} / ${a.regeln.length}` : ''} | ${u ? u.abgelehnt.length : ''} |`; });
  const pr = z.runden.map(nr => verlauf.find(x => x.runde === nr)).find(v => v.art === 'pruef'); const vor = verlauf.filter(v => v.art === 'pruef' && v.feld === 'bghm' && v.runde < pr.runde).pop();
  const o = path.join(RUNDEN, pr.runde); const st = gibt(path.join(o, 'stichprobe.json')) ? lies(path.join(o, 'stichprobe.json')).eintraege : [];
  const md = [`# Zyklus ${z.id}`, '', `Begonnen ${de(z.begonnen)}, beendet ${de(heute())}. Modelle: Sprecher ${z.modelle.sprecher}, Übersetzer ${z.modelle.uebersetzer}, Schiedsrichter ${z.modelle.schiedsrichter}, Lückenschließer ${z.modelle.lueckenschliesser}, Stichprobe ${z.modelle.stichprobe}.`, '',
    `**Messwert: ${pr.quote} %** in der Prüfrunde ${pr.runde}${vor ? ` (vorige Prüfrunde ${vor.runde}: ${vor.quote} %)` : ''}. Ziel: zweimal hintereinander mindestens 80 %.`, '',
    '| Runde | Art | Plätze | Quote | getroffen | Zusatz unbegründet | übernommen: Stammdaten / Wörter / Regeln | abgelehnt |', '| --- | --- | --- | --- | --- | --- | --- | --- |', ...zeilen, '',
    '## Stichprobe der Prüfrunde', '', st.length ? `${st.filter(x => x.urteil === 'bestaetigt').length} von ${st.length} Treffer-Urteilen bestätigt.` : 'Keine Stichprobe.', '', ...st.filter(x => x.urteil === 'zweifelhaft').map(x => `- zweifelhaft: ${x.kennung} Nr. ${x.nr}: ${x.grund}`), '',
    '## Was das Programm abgelehnt hat', '', ...z.runden.flatMap(nr => { const p = path.join(RUNDEN, nr, 'uebernahme.json'); return gibt(p) ? lies(p).abgelehnt.map(a => `- ${nr}: ${a.was}: ${a.grund}`) : []; }), '',
    '## Hinweise', '', ...(z.hinweise.length ? z.hinweise.map(h => '- ' + h) : ['Keine.']), ''];
  schreib(path.join(ZYKLEN, z.id + '.md'), md.join('\n'));
}

function weiter() {
  let z = aktuell(); if (!z) throw new Error('Kein Zyklus. Erst: node lernen/zyklus.js neu');
  if (z.fertig) { console.log(`FERTIG: Zyklus ${z.id} ist abgeschlossen. Bericht: lernen/zyklen/${z.id}.md`); return; }
  if (z.angehalten) { console.log(`ANGEHALTEN: ${z.angehalten}`); return; }
  const jobs = (rolle, dateien, text) => { const k = `${z.runden[z.runden.length - 1]}:${rolle}`; z.versuche[k] = (z.versuche[k] || 0) + 1;
    if (z.versuche[k] > VERSUCHE) { z.angehalten = `${text} ist nach ${VERSUCHE} Versuchen nicht vollständig. Das braucht einen Blick von Andre oder der Leitung.`; speichern(z); sichern(`${z.id}: angehalten`); console.log('ANGEHALTEN: ' + z.angehalten); return; }
    speichern(z); sichern(`${z.id}: ${text}`); console.log(`WARTEN: ${text}. Starte diese Agenten gleichzeitig, jeden mit dem genannten Modell und genau diesem Auftrag. Danach wieder: node lernen/zyklus.js weiter`);
    for (const d of dateien) console.log(`AGENT modell=${MODELLE[rolle]} auftrag="${START(d)}"`); };
  for (let i = 0; i < 40; i++) {
    let nr = z.runden[z.runden.length - 1]; let s = nr ? stand(nr) : null;
    if (!nr || s.stufe === 'fertig') {
      if (z.runden.length >= z.plan.length) { bericht(z); z.fertig = true; z.beendet = heute(); speichern(z); node('lernen/leitstand.js'); sichern(`${z.id}: Zyklus abgeschlossen`); console.log(`FERTIG: Zyklus ${z.id} ist abgeschlossen. Bericht: lernen/zyklen/${z.id}.md`); return; }
      const aus = node('lernen/runde.js', 'neu', z.plan[z.runden.length]); nr = /^(R\d{3})/.exec(aus)[1]; z.runden.push(nr); speichern(z); console.log(aus.split('\n')[0]); continue; }
    if (s.stufe === 'sprecher') return jobs('sprecher', offeneAuftraege(nr, 'sprecher', ['protokoll', 'wahrheit']), `Runde ${nr}: Sprecher schreiben Protokolle`);
    if (s.stufe === 'uebersetzer') return jobs('uebersetzer', offeneAuftraege(nr, 'uebersetzer', ['fall']), `Runde ${nr}: Übersetzer legen Fälle an`);
    if (s.stufe === 'system') { node('lernen/runde.js', 'system', nr); continue; }
    if (s.stufe === 'schiedsrichter') { node('lernen/runde.js', 'system', nr); return jobs('schiedsrichter', offeneAuftraege(nr, 'schiedsrichter', ['urteil']), `Runde ${nr}: Schiedsrichter urteilen`); }
    if (s.stufe === 'auswerten') { console.log(node('lernen/runde.js', 'auswerten', nr).trim().split('\n').pop());
      const v = lies(path.join(__dirname, 'verlauf.json')); const e = v.find(x => x.runde === nr); if (e.art === 'pruef') { const vor = v.filter(x => x.art === 'pruef' && x.feld === 'bghm' && x.runde < nr).pop(); if (vor && e.quote < vor.quote) z.hinweise.push(`Stopp-Regel: Die Quote ist von ${vor.quote} % (${vor.runde}) auf ${e.quote} % (${nr}) gefallen. Vor dem nächsten Zyklus die Ursache klären.`); }
      speichern(z); continue; }
    if (s.stufe === 'luecken') { const o = path.join(RUNDEN, nr);
      if (s.art === 'pruef' && !stichprobeFertig(nr)) { if ((z.versuche[`${nr}:stichprobe`] || 0) < 2) return jobs('stichprobe', [auftragStichprobe(nr)], `Runde ${nr}: Stichprobe der Treffer-Urteile`); z.hinweise.push(`${nr}: Die Stichprobe kam nicht zustande.`); }
      if (!gibt(path.join(o, 'vorschlag.json')) && (z.versuche[`${nr}:lueckenschliesser`] || 0) < 2) return jobs('lueckenschliesser', [auftragLuecken(nr)], `Runde ${nr}: Lückenschließer schreibt Vorschlag`);
      const e = require('./uebernehmen').uebernehmen(nr); console.log(`Runde ${nr}: übernommen ${Object.entries(e.uebernommen).map(([k, l]) => `${l.length} ${k}`).join(', ')}; abgelehnt ${e.abgelehnt.length}.`);
      if (e.zurueckgenommen) z.hinweise.push(`${nr}: Der Lückenschluss wurde zurückgenommen, weil die Tests fehlschlugen (${e.zurueckgenommen}).`);
      node('lernen/runde.js', 'geschlossen', nr); try { node('bauen.js'); } catch (x) { z.hinweise.push(`${nr}: Bauen der Oberfläche schlug fehl.`); }
      lernbuch(z, nr); node('lernen/leitstand.js'); speichern(z); sichern(`${z.id}: Runde ${nr} ausgewertet und Lücken geschlossen`); continue; }
    throw new Error(`Runde ${nr}: unbekannte Stufe ${s.stufe}`);
  }
}

if (require.main === module) { const [, , befehl, a] = process.argv;
  try { if (befehl === 'neu') neu(); else if (befehl === 'weiter') weiter(); else if (befehl === 'probe') probe(a);
    else if (befehl === 'stand') { const z = aktuell(); console.log(z ? `${z.id}: Runden ${z.runden.join(', ') || 'noch keine'}${z.fertig ? ', fertig' : z.angehalten ? ', angehalten: ' + z.angehalten : ''}` : 'Kein Zyklus.'); }
    else console.log('Befehle: neu, weiter, stand, probe <Runde>'); } catch (x) { console.error(x.message); process.exit(1); } }
