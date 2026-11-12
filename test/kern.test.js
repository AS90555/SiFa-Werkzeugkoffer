'use strict';
const test = require('node:test'); const assert = require('node:assert'); const fs = require('fs'); const path = require('path');
const { ladeBibliothek, pruefe } = require('../kern/laden'); const { auswerten, uebersicht, werte, pflichten, abgleich } = require('../kern/auswerten');
const w = path.join(__dirname, '..'); const lies = p => JSON.parse(fs.readFileSync(path.join(w, p), 'utf8'));
const b = ladeBibliothek(path.join(w, 'bibliothek'));
const kopie = () => JSON.parse(JSON.stringify({ merkmale: b.merkmale, angaben: b.angaben, stammdaten: b.stammdaten, quellen: b.quellen, gefaehrdungen: b.gefaehrdungen, faktoren: b.faktoren, regeln: b.regeln, pflichten: b.pflichten, woerterbuch: b.woerterbuch }));

test('Bibliothek lädt ohne Fehler', () => { assert.ok(b.regeln.length >= 50); });

test('Logik: Merkmale, alle, eine, nicht', () => {
  const m = new Set(['a', 'b']); const f = new Set();
  assert.equal(werte('a', m, {}, f), true); assert.equal(werte('x', m, {}, f), false);
  assert.equal(werte({ alle: ['a', 'b'] }, m, {}, f), true); assert.equal(werte({ alle: ['a', 'x'] }, m, {}, f), false);
  assert.equal(werte({ eine: ['x', 'b'] }, m, {}, f), true); assert.equal(werte({ nicht: 'x' }, m, {}, f), true);
});

test('Logik: fehlende Angabe ergibt offen, nicht geraten', () => {
  const m = new Set(['a']); let f = new Set();
  assert.equal(werte({ alle: ['a', { angabe: 'h', ist: true }] }, m, {}, f), null); assert.deepEqual([...f], ['h']);
  f = new Set(); assert.equal(werte({ alle: ['x', { angabe: 'h', ist: true }] }, m, {}, f), false); assert.equal(f.size, 0, 'entschiedene Regel fragt nicht nach');
  f = new Set(); assert.equal(werte({ eine: ['a', { angabe: 'h', ist: true }] }, m, {}, f), true); assert.equal(f.size, 0);
  assert.equal(werte({ angabe: 'kg', ab: 10 }, m, { kg: 12 }, new Set()), true); assert.equal(werte({ angabe: 'kg', ab: 10 }, m, { kg: 5 }, new Set()), false);
});

test('Prüfung findet Tippfehler und Lücken', () => {
  let k = kopie(); k.regeln[0].wenn = 'a.flurförderzeug'; assert.ok(pruefe(k).fehler.some(x => x.includes('unbekanntes Merkmal')));
  k = kopie(); k.regeln[0].gefaehrdung = 'g-gibt-es-nicht'; assert.ok(pruefe(k).fehler.some(x => x.includes('unbekannte Gefährdung')));
  k = kopie(); k.regeln[1].massnahmen[0].id = k.regeln[0].massnahmen[0].id; assert.ok(pruefe(k).fehler.length > 0);
  k = kopie(); k.regeln[0].quellen = []; assert.ok(pruefe(k).fehler.some(x => x.includes('ohne Quelle')));
  k = kopie(); k.regeln.find(r => r.beleg !== 'geprueft').freigabe = 'geprueft'; assert.ok(pruefe(k).fehler.some(x => x.includes('freigegeben ohne')));
  k = kopie(); k.stammdaten.vorgang[0].merkmale.push('m.holz'); assert.ok(pruefe(k).fehler.some(x => x.includes('gehört nicht')));
});

test('Fall mit unbekanntem Stammdatum wird abgelehnt', () => {
  const fall = lies('faelle/fensterwerk.json'); fall.stationen[0].schritte[0].vorgang = 'gibt_es_nicht';
  assert.throws(() => auswerten(b, fall), /unbekannter Vorgang/);
});

test('Gleiche Eingabe, gleiches Ergebnis', () => {
  const fall = lies('faelle/fensterwerk.json');
  assert.deepEqual(auswerten(b, fall), auswerten(b, JSON.parse(JSON.stringify(fall))));
});

test('Fachliche Stichproben am Fensterwerk', () => {
  const fall = lies('faelle/fensterwerk.json'); const e = auswerten(b, fall);
  const hat = (erg, nr, regel) => erg.stationen.find(s => s.nr === nr).treffer.find(t => t.regel === regel);
  assert.equal(hat(e, 4, 'R10').status, 'trifft zu', 'Hartholzstaub am Zuschnitt');
  assert.equal(hat(e, 5, 'R09'), undefined, 'kein Holzstaub beim reinen Abnehmen');
  assert.equal(hat(e, 16, 'R10'), undefined, 'nach der Vorfertigung kein Hartholz gesetzt');
  assert.equal(hat(e, 28, 'R46'), undefined, 'kein Einstieg, keine Regel für enge Räume');
  assert.equal(hat(e, 15, 'R30b'), undefined, 'wasserbasierter Lack, kein Explosionsschutz aus dem Lack');
  assert.equal(hat(e, 22, 'R38'), undefined, 'Glas wird automatisch eingesetzt');
  const s4 = fall.stationen.find(s => s.nr === 4);
  s4.angaben.hartholz = false; assert.equal(hat(auswerten(b, fall), 4, 'R10'), undefined); assert.ok(hat(auswerten(b, fall), 4, 'R09'));
  delete s4.angaben.hartholz; assert.equal(hat(auswerten(b, fall), 4, 'R10').status, 'offen', 'ohne Angabe wird nachgefragt');
});

test('Stoffe: Eigenschaften kommen aus dem Sicherheitsdatenblatt', () => {
  const fall = lies('faelle/fensterwerk.json'); const e = auswerten(b, fall);
  const hat = (erg, nr, regel) => erg.stationen.find(s => s.nr === nr).treffer.find(t => t.regel === regel);
  assert.equal(hat(e, 10, 'R50').status, 'trifft zu', 'Imprägnierung mit H360D');
  assert.equal(hat(e, 8, 'R50').status, 'trifft zu', 'auch beim Nachfüllen und Reinigen');
  assert.equal(hat(e, 10, 'R54').status, 'trifft zu', 'EUH208 zählt als sensibilisierend');
  assert.equal(hat(e, 11, 'R22'), undefined, 'nicht eingestufter Leim löst die Gefahrstoff-Regel nicht aus');
  assert.equal(hat(e, 11, 'R50'), undefined, 'Leim mit Datenblatt ohne H360: verneint, nicht offen');
  assert.equal(hat(e, 4, 'R55').status, 'trifft zu', 'Silikonspray H222');
  assert.equal(hat(e, 9, 'R50').status, 'offen', 'Spachtel ohne Datenblatt bleibt offen');
  // ohne Datenblatt wird aus ja wieder offen
  fall.stoffe = fall.stoffe.filter(s => s.id !== 'induline-sw900');
  assert.equal(hat(auswerten(b, fall), 10, 'R50').status, 'offen');
  // fehlerhafte Stoffdaten werden abgelehnt
  fall.stoffe.push({ id: 'x', name: 'x', material: 'kantel', h: [] }); assert.throws(() => auswerten(b, fall), /kein Gefahrstoff/);
  fall.stoffe.pop(); fall.stoffe.push({ id: 'y', name: 'y', material: 'leim', h: ['R36'], sdb: { version: '1', datum: '2020-01-01' } }); assert.throws(() => auswerten(b, fall), /kein H-Satz/);
});

test('Organisationspflichten folgen aus Betrieb und Ablauf', () => {
  const fall = lies('faelle/fensterwerk.json'); const hat = (l, id) => l.find(x => x.pflicht === id);
  let l = pflichten(b, fall);
  assert.equal(hat(l, 'P01').status, 'trifft zu', 'Gefährdungsbeurteilung gilt immer');
  assert.equal(hat(l, 'P13').status, 'trifft zu', 'Stapler im Ablauf, also Beauftragung');
  assert.equal(hat(l, 'P07').status, 'offen', 'ohne Angabe zu Jugendlichen wird gefragt');
  assert.equal(hat(l, 'P05').status, 'offen');
  fall.betrieb = { jugendliche: true, beschaeftigte: 20 }; l = pflichten(b, fall);
  assert.equal(hat(l, 'P07').status, 'trifft zu'); assert.equal(hat(l, 'P05'), undefined, 'bei genau 20 Beschäftigten kein Ausschuss');
  fall.betrieb.beschaeftigte = 21; assert.equal(hat(pflichten(b, fall), 'P06').status, 'trifft zu');
  fall.betrieb.jugendliche = false; assert.equal(hat(pflichten(b, fall), 'P07'), undefined);
  fall.stationen = fall.stationen.filter(s => s.nr === 5); assert.equal(hat(pflichten(b, fall), 'P13'), undefined, 'ohne Stapler keine Beauftragung');
});

test('Abgleich mit eigenen Beobachtungen', () => {
  const fall = lies('faelle/fensterwerk.json');
  fall.stationen.find(s => s.nr === 4).beobachtungen = [{ text: 'Staub am Sägeauslauf', gefaehrdung: 'g-holzstaub' }, { text: 'Stolperstelle am Kabelkanal', gefaehrdung: null }, { text: 'Quetschgefahr am Rollgang', gefaehrdung: 'g-quetschen' }];
  const ab = abgleich(b, fall, auswerten(b, fall));
  assert.equal(ab.getroffen, 1); assert.equal(ab.uebersehen, 1); assert.equal(ab.ohneEintrag, 1); assert.equal(ab.quote, 33);
  assert.ok(ab.stationen[0].zusaetzlich.includes('g-laerm'));
});

test('Regressionsfall Fensterwerk entspricht dem eingefrorenen Ergebnis', () => {
  const fall = lies('faelle/fensterwerk.json'); const e = auswerten(b, fall);
  const ist = JSON.parse(JSON.stringify({ ...e, ...uebersicht(b, e), pflichten: pflichten(b, fall) }));
  const datei = path.join(w, 'erwartet/fensterwerk.json');
  if (process.env.EINFRIEREN === '1') fs.writeFileSync(datei, JSON.stringify(ist, null, 1));
  assert.deepEqual(ist, JSON.parse(fs.readFileSync(datei, 'utf8')));
});
