'use strict';
// Tests für die Werkstatt um den Kern: Fingerabdruck, Zitat-Kontrolle, Berichtsprüfung, Auswahl der Aufträge.
const test = require('node:test'); const assert = require('node:assert'); const fs = require('fs'); const os = require('os'); const path = require('path');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rw-')); fs.mkdirSync(path.join(tmp, 'T'));
fs.writeFileSync(path.join(tmp, 'T', 'probe.txt'), 'Seite 3\n(2) Der Arbeitgeber hat dafür zu sorgen, dass Stäube an der Ent-\nstehungsstelle möglichst vollständig erfasst und gefahrlos\nentsorgt werden. Dies gilt „insbesondere“ für Holzstaub.\n');
process.env.REGELWERK_TEXT = tmp;
const { zitatFehler } = require('../beleg/text'); const { pruefeBericht } = require('../beleg/pruefe-bericht');
const { ladeBibliothek, pruefe, fingerabdruck } = require('../kern/laden'); const { waehle } = require('../lernen/runde');
const B = () => ladeBibliothek(path.join(__dirname, '..', 'bibliothek')); const kopie = x => JSON.parse(JSON.stringify(x));

test('Fingerabdruck ändert sich mit dem Inhalt, nicht mit der Fundstelle', () => {
  const r = kopie(B().regeln[0]); const fp = fingerabdruck(r);
  r.quellen = [{ id: 'arbschg', stelle: '§ 99' }]; assert.strictEqual(fingerabdruck(r), fp);
  r.massnahmen[0].text += ' immer'; assert.notStrictEqual(fingerabdruck(r), fp);
});
test('Geänderte Regel verliert Beleg und Freigabe', () => {
  const b = B(); const r = b.regeln.find(x => x.quellen.length && x.quellen.every(q => q.stelle)) || b.regeln[0];
  r.quellen.forEach(q => { q.stelle = q.stelle || 'x'; }); r.beleg = 'geprueft'; r.belegstand = { lauf: 'B000', datum: '2026-01-01', pruefungen: 2, fingerabdruck: fingerabdruck(r) };
  assert.ok(!pruefe(b).fehler.some(x => x.includes(r.id)));
  r.freigabe = 'geprueft'; r.freigegeben = { von: 'Andre', datum: '2026-01-02', paket: 'F000', fingerabdruck: fingerabdruck(r) }; assert.ok(!pruefe(b).fehler.some(x => x.includes(r.id)));
  r.massnahmen[0].text += ' geändert'; const f = pruefe(b).fehler.filter(x => x.includes(r.id));
  assert.ok(f.some(x => x.includes('nach der Beleg-Prüfung geändert'))); assert.ok(f.some(x => x.includes('nach der Freigabe geändert')));
});
test('Freigabe ohne doppelten Beleg ist ein Fehler', () => {
  const b = B(); const r = b.regeln.find(x => !x.belegstand && x.quellen.length); r.quellen.forEach(q => { q.stelle = q.stelle || 'x'; }); r.beleg = 'geprueft'; r.freigabe = 'geprueft'; r.freigegeben = { von: 'Andre', fingerabdruck: fingerabdruck(r) };
  assert.ok(pruefe(b).fehler.some(x => x.includes('freigegeben ohne doppelt geprüften Beleg')));
});
test('Zitat-Kontrolle: wörtlich über Zeilenumbruch und Trennstrich, sonst abgelehnt', () => {
  const bl = z => ({ datei: 'T/probe.txt', stelle: 'Abs. 2', zitat: z });
  assert.strictEqual(zitatFehler(bl('dass Stäube an der Entstehungsstelle möglichst vollständig erfasst und gefahrlos entsorgt werden')), null);
  assert.match(zitatFehler(bl('dass Stäube an der Entstehungsstelle immer vollständig erfasst und gefahrlos entsorgt werden')), /steht so nicht/);
  assert.match(zitatFehler(bl('Stäube möglichst vollständig erfasst')), /zu kurz/);
  assert.match(zitatFehler(bl('dass Stäube an der Entstehungsstelle … erfasst und gefahrlos entsorgt werden')), /Auslassungen/);
  assert.match(zitatFehler({ datei: '../geheim.txt', stelle: 'x', zitat: 'eins zwei drei vier fünf sechs sieben' }), /gibt es nicht/);
});
test('Berichtsprüfung meldet fehlende Aussagen und Urteile ohne Zitat', () => {
  const paket = { eintraege: [{ id: 'R1', aussagen: [{ id: 'R1-M1' }, { id: 'R1-M2' }] }] };
  const f = pruefeBericht({ eintraege: [{ id: 'R1', aussagen: [{ id: 'R1-M1', urteil: 'gedeckt', belege: [] }] }] }, paket);
  assert.ok(f.some(x => x.includes('R1-M2: Aussage fehlt'))); assert.ok(f.some(x => x.includes('braucht mindestens einen Beleg')));
});
test('Auswahl der Aufträge: fest, gemischt, nur freie', () => {
  const pool = [1, 2, 3, 4, 5, 6].map(i => ({ id: 'a' + i, gruppe: i < 4 ? 'holz' : 'g' + i, faktoren: [i, 9], genutzt: i === 6 ? 'R001' : null }));
  const v = [{ jeFaktor: { 9: { getroffen: 9, verfehlt: 1 } } }];
  const a = waehle(pool, v, 4).map(x => x.id), c = waehle(pool, v, 4).map(x => x.id);
  assert.deepStrictEqual(a, c); assert.ok(!a.includes('a6')); assert.ok(a.includes('a4') && a.includes('a5'));
});
