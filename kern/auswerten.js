'use strict';
// Wertet einen Fall gegen die Bibliothek aus. Rein rechnerisch: gleiche Eingabe, gleiches Ergebnis.
const { pruefeFall, TYPEN } = require('./laden');

// Dreiwertige Logik: true, false oder null (Angabe fehlt). fehlt sammelt die fehlenden Angaben.
function werte(ausdruck, merkmale, angaben, fehlt) {
  if (ausdruck === 'immer') return true;
  if (typeof ausdruck === 'string') return merkmale.has(ausdruck);
  if ('angabe' in ausdruck) {
    const v = angaben[ausdruck.angabe];
    if (v === undefined || v === null) { fehlt.add(ausdruck.angabe); return null; }
    if ('ist' in ausdruck) return v === ausdruck.ist;
    if ('ab' in ausdruck) return v >= ausdruck.ab;
    return v <= ausdruck.bis;
  }
  if ('nicht' in ausdruck) { const w = werte(ausdruck.nicht, merkmale, angaben, fehlt); return w === null ? null : !w; }
  const alle = 'alle' in ausdruck, teile = ausdruck[alle ? 'alle' : 'eine'];
  let offen = false; const lokal = new Set();
  for (const t of teile) {
    const w = werte(t, merkmale, angaben, lokal);
    if (w === null) offen = true;
    else if (w !== alle) return !alle; // alle: ein falsch entscheidet; eine: ein wahr entscheidet
  }
  if (offen) { for (const x of lokal) fehlt.add(x); return null; }
  return alle;
}

// Leitet Angaben aus den Sicherheitsdatenblättern der Stoffe eines Schritts ab.
// Wahr, sobald ein Stoff die Eigenschaft hat. Falsch nur, wenn alle Gefahrstoffe des Schritts ein Datenblatt haben und keiner sie hat.
const AUS_H = {
  h360: s => s.h.some(h => /^H36[01]/.test(h)),
  entzuendbar: s => s.h.some(h => /^H22[0-8]/.test(h)),
  sensibilisierend: s => s.h.some(h => /^H(317|334)/.test(h)) || (s.euh || []).includes('EUH208'),
  eingestuft: s => s.h.length > 0
};
function ausStoffen(index, fall, schritt) {
  const gefahrstoffe = (schritt.material || []).filter(m => index.material.get(m).merkmale.includes('m.gefahrstoff'));
  if (!gefahrstoffe.length) return { angaben: {}, stoffe: [] };
  const stoffe = [], luecke = [];
  for (const m of gefahrstoffe) {
    const zu = (fall.stoffe || []).filter(s => s.material === m && (!schritt.stoffe || schritt.stoffe.includes(s.id)));
    if (!zu.length || zu.some(s => !s.sdb)) luecke.push(m);
    stoffe.push(...zu.filter(s => s.sdb));
  }
  const angaben = {};
  if (!luecke.length) angaben.sdb = true;
  for (const [k, f] of Object.entries(AUS_H)) {
    if (stoffe.some(f)) angaben[k] = true; else if (!luecke.length) angaben[k] = false;
  }
  if (schritt.isocyanat !== undefined) angaben.isocyanat = schritt.isocyanat;
  return { angaben, stoffe: stoffe.map(s => s.id) };
}

function auswerten(b, fall) {
  pruefeFall(b, fall);
  const index = {}; for (const t of TYPEN) index[t] = new Map(b.stammdaten[t].map(x => [x.id, x]));
  const regeln = b.regeln.filter(r => r.freigabe !== 'gesperrt');
  const stationen = fall.stationen.map(s => {
    const umgebung = (s.umgebung || []).flatMap(u => index.umgebung.get(u).merkmale);
    const treffer = new Map();
    s.schritte.forEach((x, i) => {
      const merkmale = new Set([...umgebung, ...index.vorgang.get(x.vorgang).merkmale, ...index.ausfuehrung.get(x.ausfuehrung).merkmale,
        ...(x.material || []).flatMap(m => index.material.get(m).merkmale)]);
      const abgeleitet = ausStoffen(index, fall, x);
      const angaben = { ...(fall.angaben || {}), ...(s.angaben || {}), ...(x.angaben || {}), ...abgeleitet.angaben };
      for (const r of regeln) {
        const fehlt = new Set();
        const w = werte(r.wenn, merkmale, angaben, fehlt);
        if (w === false) continue;
        const nachfragen = new Set(w === null ? fehlt : []);
        if (w === true) for (const a of r.braucht || []) if (angaben[a] === undefined || angaben[a] === null) nachfragen.add(a);
        const t = treffer.get(r.id) || { regel: r.id, status: 'offen', schritte: [], fehlt: new Set() };
        if (w === true) t.status = 'trifft zu';
        t.schritte.push(i + 1);
        for (const a of nachfragen) t.fehlt.add(a);
        treffer.set(r.id, t);
      }
    });
    const liste = [...treffer.values()].map(t => ({ ...t, fehlt: [...t.fehlt].sort() }))
      .sort((a, c) => a.regel.localeCompare(c.regel, 'de', { numeric: true }));
    return { nr: s.nr, name: s.name, treffer: liste };
  });
  return { fall: fall.id, stationen };
}

// Verdichtet das Ergebnis: jede Gefährdung einmal, mit Stationen und Regeln.
function uebersicht(b, ergebnis) {
  const regel = new Map(b.regeln.map(r => [r.id, r]));
  const gef = new Map();
  const rueckfragen = new Map();
  for (const s of ergebnis.stationen) for (const t of s.treffer) {
    const r = regel.get(t.regel);
    if (t.status === 'trifft zu') {
      const g = gef.get(r.gefaehrdung) || { stationen: new Set(), regeln: new Set() };
      g.stationen.add(s.nr); g.regeln.add(r.id); gef.set(r.gefaehrdung, g);
    }
    for (const a of t.fehlt) { const k = rueckfragen.get(a) || new Set(); k.add(s.nr); rueckfragen.set(a, k); }
  }
  return {
    gefaehrdungen: b.gefaehrdungen.filter(g => gef.has(g.id)).sort((a, c) => a.faktor - c.faktor)
      .map(g => ({ id: g.id, faktor: g.faktor, name: g.name, stationen: [...gef.get(g.id).stationen], regeln: [...gef.get(g.id).regeln] })),
    rueckfragen: b.angaben.filter(a => rueckfragen.has(a.id)).map(a => ({ id: a.id, frage: a.frage, stationen: [...rueckfragen.get(a.id)] }))
  };
}

// Organisationspflichten des Betriebs: aus Betriebsangaben und aus allem, was im Betrieb vorkommt.
function pflichten(b, fall) {
  const index = {}; for (const t of TYPEN) index[t] = new Map(b.stammdaten[t].map(x => [x.id, x]));
  const merkmale = new Set();
  for (const s of fall.stationen) {
    for (const u of s.umgebung || []) for (const m of index.umgebung.get(u).merkmale) merkmale.add(m);
    for (const x of s.schritte) for (const m of [...index.vorgang.get(x.vorgang).merkmale, ...index.ausfuehrung.get(x.ausfuehrung).merkmale, ...(x.material || []).flatMap(y => index.material.get(y).merkmale)]) merkmale.add(m);
  }
  const angaben = {}; for (const [k, v] of Object.entries(fall.betrieb || {})) if (v !== null) angaben[k] = v;
  const liste = [];
  for (const p of (b.pflichten || []).filter(x => x.freigabe !== 'gesperrt')) {
    const fehlt = new Set(); const w = werte(p.wenn, merkmale, angaben, fehlt);
    if (w === false) continue;
    liste.push({ pflicht: p.id, status: w === true ? 'trifft zu' : 'offen', fehlt: [...fehlt].sort() });
  }
  return liste;
}

// Abgleich: was die Sifa beim Rundgang selbst gesehen hat, gegen das Ergebnis des Systems.
function abgleich(b, fall, ergebnis) {
  const regel = new Map(b.regeln.map(r => [r.id, r]));
  const je = []; let getroffen = 0, uebersehen = 0, ohneEintrag = 0, zusaetzlich = 0;
  for (const s of fall.stationen) {
    const beob = s.beobachtungen || []; if (!beob.length) continue;
    const t = (ergebnis.stationen.find(x => x.nr === s.nr) || { treffer: [] }).treffer;
    const system = new Set(t.map(x => regel.get(x.regel).gefaehrdung));
    const gesehen = new Set(beob.filter(o => o.gefaehrdung).map(o => o.gefaehrdung));
    const z = { nr: s.nr, name: s.name,
      getroffen: beob.filter(o => o.gefaehrdung && system.has(o.gefaehrdung)).map(o => o.text),
      uebersehen: beob.filter(o => o.gefaehrdung && !system.has(o.gefaehrdung)).map(o => o.text),
      ohneEintrag: beob.filter(o => !o.gefaehrdung).map(o => o.text),
      zusaetzlich: [...system].filter(g => !gesehen.has(g)) };
    getroffen += z.getroffen.length; uebersehen += z.uebersehen.length; ohneEintrag += z.ohneEintrag.length; zusaetzlich += z.zusaetzlich.length;
    je.push(z);
  }
  const summe = getroffen + uebersehen + ohneEintrag;
  return { stationen: je, getroffen, uebersehen, ohneEintrag, zusaetzlich, quote: summe ? Math.round(100 * getroffen / summe) : null };
}

module.exports = { auswerten, uebersicht, werte, ausStoffen, pflichten, abgleich };
