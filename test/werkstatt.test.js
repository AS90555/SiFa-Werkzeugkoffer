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
test('Eindeutig entzündbarer Stoff ohne Datenblatt: Regel trifft zu und nennt die Annahme; ein Datenblatt geht vor', () => {
  const { auswerten, uebersicht } = require('../kern/auswerten'); const b = B();
  const fall = (stoffe) => ({ id: 't', betrieb: {}, stoffe, stationen: [{ nr: 1, name: 'Tanken', bereich: 'x', umgebung: [], personen: 1, schritte: [{ vorgang: b.stammdaten.vorgang[0].id, ausfuehrung: b.stammdaten.ausfuehrung[0].id, material: ['benzin'], ...(stoffe.length ? { stoffe: [stoffe[0].id] } : {}) }] }] });
  let e; try { e = auswerten(b, fall([])); } catch (x) { assert.fail('Fall ungültig: ' + x.message); }
  const t = e.stationen[0].treffer.find(x => x.regel === 'R88'); assert.strictEqual(t.status, 'trifft zu'); assert.deepStrictEqual(t.annahmen, ['entzuendbar']);
  assert.strictEqual(uebersicht(b, e).annahmen[0].id, 'entzuendbar');
});
test('Mängel: zugeordnete Art bringt Gefährdung, Maßnahme und Dringlichkeit; „betrifft“ setzt den Ist-Stand', () => {
  const { maengelliste, istStand } = require('../kern/auswerten'); const b = B();
  const fall = { stationen: [{ nr: 1, maengel: [{ text: 'Haube offen', art: 'schutzeinrichtung' }, { text: 'Boden nass', art: 'weg_boden' }, { text: 'unklar' }, { text: 'Gehörschutz nicht getragen', art: 'psa', betrifft: 'R11-M2' }] }] };
  const l = maengelliste(b, fall); assert.strictEqual(l[0].dringlichkeit, 'sofort'); assert.strictEqual(l[0].art, 'schutzeinrichtung'); assert.ok(l[0].massnahme && l[0].gefaehrdung);
  assert.strictEqual(l[l.length - 1].name, 'nicht zugeordnet'); assert.ok(l.find(m => m.art === 'psa').frage);
  assert.strictEqual(istStand(fall, 1, 'R11-M2'), 'nicht erfüllt'); assert.strictEqual(istStand(fall, 1, 'R11-M1'), 'zu prüfen');
});
test('Heben und Tragen: gilt bei unbekanntem Gewicht als typisch, entfällt unter 3 kg', () => {
  const { werte } = require('../kern/auswerten'); const w = B().regeln.find(r => r.id === 'R12').wenn; const m = new Set(['v.hand_wiederholt']);
  assert.strictEqual(werte(w, m, {}, new Set()), true); assert.strictEqual(werte(w, m, { last_kg: 0.2 }, new Set()), false); assert.strictEqual(werte(w, m, { last_kg: 12 }, new Set()), true);
});
test('Selbstlernen: Die Übernahme hält die Schranken ein (nur Neues, Anlass wörtlich, Regel nur als Muster und Entwurf)', () => {
  const fs = require('fs'); const path = require('path'); const W = path.join(__dirname, '..'); const Bp = path.join(W, 'bibliothek');
  const dateien = ['stammdaten', 'merkmale', 'gefaehrdungen', 'woerterbuch', 'regeln'].map(n => path.join(Bp, n + '.json')).concat(path.join(W, 'lernen', 'offene-themen.json'));
  const o = path.join(W, 'lernen', 'runden', 'R010'); const vp = path.join(o, 'vorschlag.json'), up = path.join(o, 'uebernahme.json');
  const alt = dateien.map(d => fs.existsSync(d) ? fs.readFileSync(d, 'utf8') : null); const altV = fs.existsSync(vp) ? fs.readFileSync(vp, 'utf8') : null, altU = fs.existsSync(up) ? fs.readFileSync(up, 'utf8') : null;
  const a1 = { kennung: 'R010-08', stelle: 'Das Hydrauliköl tropft beim Abkoppeln' }, a2 = { kennung: 'R010-07', stelle: 'der Wind trägt den Spritznebel zur Straße hin' };
  const regel = (name, wenn, anlass) => ({ name, wenn, entsteht: 'Test', gefaehrdung: 'g-druck', massnahmen: [{ art: 'T', text: 'Eine technische Maßnahme zum Test' }], quellen: ['betrsichv'], anlass });
  try {
    fs.writeFileSync(vp, JSON.stringify({ runde: 'R010', merkmale: [{ id: 'm.test_x', name: 'Testmerkmal' }],
      stammdaten: [{ typ: 'material', id: 'test_mat', name: 'Testmaterial', merkmale: ['m.test_x'], anlass: [a1] }, { typ: 'material', id: 'test_erfunden', name: 'Erfunden', merkmale: [], anlass: [{ kennung: 'R010-08', stelle: 'diese Stelle steht nirgends im Protokoll' }] }],
      woerter: [{ worte: ['kran'], vorgang: 'heben' }, { worte: ['im sommer wird warm'], material: ['test_mat'] }], regeln: [regel('Muster', 'm.test_x', [a1, a2]), regel('Einzelfall', { alle: ['m.test_x', 'm.holz'] }, [a1]), regel('Doppelt', 'a.hochdruck', [a1, a2])] }));
    const e = require('../lernen/uebernehmen').uebernehmen('R010', { ohneTests: true });
    assert.deepStrictEqual(e.uebernommen.stammdaten, ['material/test_mat']); assert.strictEqual(e.uebernommen.regeln.length, 1); assert.strictEqual(e.uebernommen.woerter.length, 0);
    const r = JSON.parse(fs.readFileSync(dateien[4], 'utf8')).pop(); assert.strictEqual(r.name, 'Muster'); assert.strictEqual(r.beleg, 'offen'); assert.strictEqual(r.freigabe, 'entwurf'); assert.strictEqual(r.quellen[0].stelle, null);
    assert.ok(e.abgelehnt.some(x => x.grund.includes('nicht wörtlich'))); assert.ok(e.abgelehnt.some(x => x.grund.includes('mehr als zwei Wörter'))); assert.ok(e.abgelehnt.some(x => x.grund.includes('zwei verschiedenen'))); assert.ok(e.abgelehnt.some(x => x.grund.includes('gibt es schon eine Regel')));
  } finally {
    dateien.forEach((d, i) => { if (alt[i] === null) { if (fs.existsSync(d)) fs.unlinkSync(d); } else fs.writeFileSync(d, alt[i]); });
    for (const [p, a] of [[vp, altV], [up, altU]]) { if (a === null) { if (fs.existsSync(p)) fs.unlinkSync(p); } else fs.writeFileSync(p, a); }
  }
});
test('Unterlagen: Gefährdungsbeurteilung mit drei Teilen und allen elf Faktoren je Arbeitsplatz, nichts erfunden', () => {
  const path = require('path'); const { ladeBibliothek } = require('../kern/laden'); const { dokumente } = require('../kern/dokumente');
  const b = ladeBibliothek(path.join(__dirname, '..', 'bibliothek')); const fall = require('../faelle/andre-001.json');
  const { html, zahlen } = dokumente(b, fall, { heute: '2026-11-18' });
  for (const t of ['Entscheidungsvorlage', 'Teil 1: Ergebnis der Beurteilung', 'Teil 2: Festgelegte Maßnahmen', 'Teil 3: Überprüfung der Wirksamkeit', 'Maßnahmenplan', 'Pflichten-Check', 'Gefahrstoffverzeichnis', 'Arbeitsplatzkarten']) assert.ok(html.includes(t), t);
  for (const f of b.faktoren.faktoren) assert.ok(html.includes(`${f.nr} ${f.name}`), f.name);
  assert.ok(!/\d+ × \d+ =/.test(html), 'ohne Eintrag der Fachkraft keine Bewertung');
  assert.strictEqual(zahlen.stationen, fall.stationen.length);
});
