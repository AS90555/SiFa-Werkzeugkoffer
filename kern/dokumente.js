#!/usr/bin/env node
'use strict';
// Meilenstein 3: die Unterlagen, die der Unternehmer in der Hand hält. Eine druckfertige HTML-Datei mit
//   1. Entscheidungsvorlage   2. Gefährdungsbeurteilung (Ergebnis, Maßnahmen, Überprüfung; je Arbeitsplatz alle elf Faktoren)
//   3. Maßnahmenplan          4. Pflichten-Check   5. Gefahrstoffverzeichnis   6. Arbeitsplatzkarten
// Rechnet ohne KI aus Bibliothek und Fall. Was die Fachkraft noch eintragen muss (Bewertung, Wer, Bis wann, Wirksamkeit), bleibt sichtbar offen.
// Aufruf: node kern/dokumente.js faelle/fensterwerk.json [ausgabe/fensterwerk-unterlagen.html]
const fs = require('fs'); const path = require('path');
const { ladeBibliothek } = require('./laden'); const { auswerten, uebersicht, pflichten, maengelliste, istStand } = require('./auswerten');

function dokumente(b, fall, { heute = new Date().toISOString().slice(0, 10) } = {}) {
  const e = auswerten(b, fall); const u = uebersicht(b, e);
  const R = new Map(b.regeln.map(r => [r.id, r])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g])); const Q = new Map(b.quellen.map(q => [q.id, q]));
  const A = new Map(b.angaben.map(a => [a.id, a])); const P = new Map(b.pflichten.map(p => [p.id, p])); const F = b.faktoren.faktoren;
  const BW = b.bewertung || null; const verfahren = BW ? BW.verfahren.find(v => v.id === (fall.bewertungsverfahren || BW.standard)) : null;
  const h = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const datum = d => (d ? d.split('-').reverse().join('.') : '');
  const ART = { S: 'Ersetzen', T: 'Technisch', O: 'Organisatorisch', P: 'Persönlich' }; const ARTRANG = { S: 0, T: 1, O: 2, P: 3 };
  const quelle = r => (r.quellen || []).map(q => `${Q.get(q.id).titel}${q.stelle ? ', ' + q.stelle : ''}`).join('; ') || 'ohne Quelle';
  const stand = r => (r.freigabe === 'geprueft' ? 'freigegeben' : r.beleg === 'geprueft' ? 'belegt, Freigabe offen' : 'Entwurf');
  const herkunft = m => (m.grundlage === 'erfahrung' ? 'Erfahrung der Fachkraft' : m.fundstelle === 'keine' ? 'Empfehlung ohne Fundstelle' : '');
  const plan = fall.massnahmenplan || {}; const bew = fall.bewertung || {};
  const stationen = e.stationen.map(s => ({ ...s, fs: fall.stationen.find(x => x.nr === s.nr) }));
  const ml = maengelliste(b, fall);

  // Bewertung je Gefährdung und Arbeitsplatz: nur, was die Fachkraft eingetragen hat. Nie raten.
  const bewerte = (nr, gid) => { const x = bew[`${nr}:${gid}`]; if (!x || !verfahren || !verfahren.stufen) return null;
    const s = verfahren.schwere.findIndex(y => y.id === x.schwere) + 1, w = verfahren.wahrscheinlichkeit.findIndex(y => y.id === x.wahrscheinlichkeit) + 1; if (!s || !w) return null;
    const wert = s * w; const st = verfahren.stufen.find(y => wert >= y.ab); return { wert, stufe: st ? st.name : '', s: verfahren.schwere[s - 1].name, w: verfahren.wahrscheinlichkeit[w - 1].name }; };

  // Maßnahmen je Arbeitsplatz, nach Rangfolge S-T-O-P, ohne Doppelungen.
  const massnahmen = s => { const seen = new Map();
    for (const t of s.treffer) { const r = R.get(t.regel); for (const m of r.massnahmen) { const k = m.text.trim().toLowerCase(); if (!seen.has(k)) seen.set(k, { m, r, offen: t.status === 'offen', ist: istStand(fall, s.nr, m.id) }); } }
    return [...seen.values()].sort((a, b2) => ARTRANG[a.m.art] - ARTRANG[b2.m.art]); };

  // Maßnahmenplan: zuerst Mängel (nach Dringlichkeit), dann Maßnahmen „nicht erfüllt“. „Zu prüfen“ geht in die Prüfliste für den Rundgang.
  const zeilen = [];
  for (const m of ml) zeilen.push({ quelle: 'Mangel', station: m.station, was: m.massnahme || `Mangel abstellen: ${m.text}`, anlass: m.text, dringlichkeit: m.dringlichkeit || 'offen', key: `mangel:${m.station || 0}:${m.text}` });
  for (const s of stationen) for (const x of massnahmen(s)) if (x.ist === 'nicht erfüllt') zeilen.push({ quelle: 'Maßnahme', station: s.nr, was: x.m.text, anlass: G.get(x.r.gefaehrdung).name, dringlichkeit: 'kurzfristig', key: `${x.m.id}@${s.nr}` });
  const pruefliste = stationen.flatMap(s => massnahmen(s).filter(x => x.ist === 'zu prüfen').map(x => ({ s, x })));

  const pl = pflichten(b, fall); const pflOffen = pl.filter(t => t.status === 'offen' || !((fall.pflichtpruefung || {})[t.pflicht]));
  const stoffe = fall.stoffe || []; const alt = s => (s.sdb ? (new Date(heute) - new Date(s.sdb.datum)) / (365.25 * 864e5) : null);
  const entwurf = [...new Set(stationen.flatMap(s => s.treffer.map(t => R.get(t.regel)).filter(r => r.freigabe !== 'geprueft').map(r => r.id)))];
  const name = fall.name || fall.id; const sofort = ml.filter(m => m.dringlichkeit === 'sofort');

  const o = [];
  o.push('<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">', `<title>Unterlagen ${h(name)}</title>`, `<style>${CSS}</style></head><body>`);
  o.push(`<header class="deck"><h1>Unterlagen zur Gefährdungsbeurteilung</h1><p class="gross">${h(name)}</p><table class="kopf"><tr><th>Stand</th><td>${datum(heute)}</td></tr><tr><th>Erstellt von</th><td>${h(fall.fachkraft || '…………………………… (Fachkraft für Arbeitssicherheit)')}</td></tr><tr><th>Verantwortlich</th><td>${h(fall.unternehmer || '…………………………… (Unternehmer)')}</td></tr><tr><th>Arbeitsplätze</th><td>${stationen.length}</td></tr></table>`);
  o.push(`<p class="hinweis">Erstellt mit dem SiFa-Werkzeugkoffer. Die Gefährdungen werden ohne KI aus einer geprüften Bibliothek abgeleitet. ${entwurf.length ? `<strong>${entwurf.length} der verwendeten Regeln sind noch nicht fachlich freigegeben</strong> und als „Entwurf“ gekennzeichnet.` : 'Alle verwendeten Regeln sind fachlich freigegeben.'} Was beim Rundgang noch zu bestätigen ist, steht als „zu prüfen“ da.</p>`);
  o.push('<nav><ol><li><a href="#vorlage">Entscheidungsvorlage</a></li><li><a href="#gbu">Gefährdungsbeurteilung</a></li><li><a href="#plan">Maßnahmenplan</a></li><li><a href="#pflichten">Pflichten-Check</a></li><li><a href="#stoffe">Gefahrstoffverzeichnis</a></li><li><a href="#karten">Arbeitsplatzkarten</a></li></ol></nav></header>');

  // 1 Entscheidungsvorlage
  o.push('<section id="vorlage"><h2>1 Entscheidungsvorlage</h2><p>Für die Unternehmensleitung: was jetzt zu entscheiden ist.</p><table class="zahlen">',
    `<tr><th>Arbeitsplätze betrachtet</th><td>${stationen.length}</td></tr>`, `<tr><th>Gefährdungen erkannt</th><td>${u.gefaehrdungen.length}</td></tr>`,
    `<tr><th>Mängel sofort abzustellen</th><td>${sofort.length}</td></tr>`, `<tr><th>Mängel und Maßnahmen im Plan</th><td>${zeilen.length}</td></tr>`,
    `<tr><th>Beim Rundgang zu prüfen</th><td>${pruefliste.length} Maßnahmen</td></tr>`, `<tr><th>Organisationspflichten offen</th><td>${pflOffen.length} von ${pl.length}</td></tr>`,
    `<tr><th>Gefahrstoffe ohne aktuelles Datenblatt</th><td>${stoffe.filter(s => !s.sdb || alt(s) > 3).length} von ${stoffe.length}</td></tr>`,
    `<tr><th>Offene Angaben</th><td>${u.rueckfragen.length}</td></tr></table>`, '<h3>Zu entscheiden</h3><ol>');
  if (sofort.length) o.push(`<li>Die ${sofort.length} sofort abzustellenden Mängel freigeben und einen Verantwortlichen je Mangel benennen (Abschnitt 3).</li>`);
  o.push('<li>Für jede Zeile des Maßnahmenplans Verantwortlichen und Termin festlegen.</li>');
  if (pflOffen.length) o.push(`<li>Die ${pflOffen.length} offenen Organisationspflichten klären (Abschnitt 4).</li>`);
  if (stoffe.some(s => !s.sdb || alt(s) > 3)) o.push('<li>Fehlende oder veraltete Sicherheitsdatenblätter beim Lieferanten anfordern (Abschnitt 5).</li>');
  if (u.rueckfragen.length) o.push(`<li>Die ${u.rueckfragen.length} offenen Angaben beantworten; erst dann sind alle Gefährdungen abschließend beurteilt.</li>`);
  o.push('</ol>');
  if (sofort.length) { o.push('<h3>Sofort</h3><ul>'); for (const m of sofort) o.push(`<li>${m.station ? `Platz ${m.station}: ` : ''}${h(m.text)} → ${h(m.massnahme)}</li>`); o.push('</ul>'); }
  o.push('<p class="unterschrift">Entschieden am ……………… &nbsp;&nbsp; Unterschrift ………………………………</p></section>');

  // 2 Gefährdungsbeurteilung
  o.push('<section id="gbu"><h2>2 Gefährdungsbeurteilung</h2>', '<p>Nach § 5 und § 6 Arbeitsschutzgesetz: Ergebnis der Beurteilung, festgelegte Maßnahmen und Ergebnis ihrer Überprüfung. Die elf Gefährdungsfaktoren nach ASR V3 und DGUV Grundsatz 311-003 sind je Arbeitsplatz einzeln betrachtet.</p>');
  if (verfahren) o.push(`<p>Bewertung: ${h(verfahren.name)}. ${h(verfahren.hinweis || '')}</p>`);
  if (fall.annahmen && fall.annahmen.length) o.push('<p><strong>Annahmen:</strong></p><ul>' + fall.annahmen.map(a => `<li>${h(a)}</li>`).join('') + '</ul>');
  for (const s of stationen) {
    o.push(`<article class="platz"><h3>Arbeitsplatz ${s.nr}: ${h(s.name)}${s.fs.bereich ? ` <span class="klein">(${h(s.fs.bereich)})</span>` : ''}</h3>`, '<h4>Teil 1: Ergebnis der Beurteilung</h4><table><thead><tr><th>Faktor</th><th>Gefährdung</th><th>Bewertung</th><th>Stand der Regel</th></tr></thead><tbody>');
    for (const f of F) { const gs = [...new Map(s.treffer.map(t => R.get(t.regel)).filter(r => G.get(r.gefaehrdung).faktor === f.nr).map(r => [r.gefaehrdung, r])).values()];
      if (!gs.length) { o.push(`<tr class="leer"><td>${f.nr} ${h(f.name)}</td><td colspan="3">Aus dem Protokoll keine Gefährdung abgeleitet. Beim Rundgang zu bestätigen.</td></tr>`); continue; }
      gs.forEach((r, i) => { const bw = bewerte(s.nr, r.gefaehrdung); const offen = s.treffer.some(t => R.get(t.regel).gefaehrdung === r.gefaehrdung && t.status === 'offen');
        o.push(`<tr>${i === 0 ? `<td rowspan="${gs.length}">${f.nr} ${h(f.name)}</td>` : ''}<td>${h(G.get(r.gefaehrdung).name)}${offen ? ' <span class="marke">offen bis zur Angabe</span>' : ''}<div class="klein">${h(r.entsteht)}</div></td><td>${bw ? `${h(bw.s)} × ${h(bw.w)} = ${bw.wert}<br><strong>${h(bw.stufe)}</strong>` : '<span class="offen">von der Fachkraft zu bewerten</span>'}</td><td>${stand(r)}</td></tr>`); }); }
    o.push('</tbody></table>', '<h4>Teil 2: Festgelegte Maßnahmen</h4><table><thead><tr><th>Art</th><th>Maßnahme</th><th>Ist-Stand</th><th>Grundlage</th></tr></thead><tbody>');
    for (const x of massnahmen(s)) o.push(`<tr><td>${ART[x.m.art]}</td><td>${h(x.m.text)}</td><td class="ist-${x.ist.replace(/\s/g, '-')}">${x.ist}</td><td class="klein">${herkunft(x.m) || h(quelle(x.r))}</td></tr>`);
    o.push('</tbody></table>', `<h4>Teil 3: Überprüfung der Wirksamkeit</h4><table class="leerfeld"><tr><th>Überprüft am</th><td>${h((fall.ueberpruefung || {})[s.nr] ? datum(fall.ueberpruefung[s.nr].datum) : '')}</td><th>von</th><td>${h((fall.ueberpruefung || {})[s.nr] ? fall.ueberpruefung[s.nr].von : '')}</td></tr><tr><th>Ergebnis</th><td colspan="3">${h((fall.ueberpruefung || {})[s.nr] ? fall.ueberpruefung[s.nr].ergebnis : 'Maßnahmen wirksam? Neue Gefährdungen?')}</td></tr></table></article>`);
  }
  o.push('</section>');

  // 3 Maßnahmenplan
  o.push('<section id="plan"><h2>3 Maßnahmenplan</h2><p>Reihenfolge nach Dringlichkeit. Verantwortliche und Fristen sind festzulegen (DGUV Grundsatz 311-003, Schritt 5).</p><table><thead><tr><th>Nr</th><th>Dringlichkeit</th><th>Platz</th><th>Was</th><th>Anlass</th><th>Wer</th><th>Bis wann</th><th>Erledigt</th><th>Wirksam</th></tr></thead><tbody>');
  const RANG = { sofort: 0, kurzfristig: 1, einplanen: 2 };
  zeilen.sort((a, b2) => (RANG[a.dringlichkeit] ?? 9) - (RANG[b2.dringlichkeit] ?? 9) || (a.station || 0) - (b2.station || 0)).forEach((z, i) => { const p = plan[z.key] || {};
    o.push(`<tr><td>${i + 1}</td><td class="d-${h(z.dringlichkeit)}">${h(z.dringlichkeit)}</td><td>${z.station || 'Betrieb'}</td><td>${h(z.was)}</td><td class="klein">${h(z.anlass)}</td><td>${h(p.wer || '')}</td><td>${h(datum(p.bis))}</td><td>${h(datum(p.erledigt))}</td><td>${h(p.wirksam || '')}</td></tr>`); });
  if (!zeilen.length) o.push('<tr><td colspan="9">Keine Mängel und keine Maßnahme „nicht erfüllt“. Die Prüfliste unten ist beim Rundgang abzuarbeiten.</td></tr>');
  o.push('</tbody></table>', `<h3>Prüfliste für den Rundgang (${pruefliste.length})</h3><p class="klein">Maßnahmen, deren Ist-Stand noch nicht festgestellt ist. Was nicht erfüllt ist, kommt in den Plan.</p><table><thead><tr><th>Platz</th><th>Maßnahme</th><th>erfüllt</th><th>nicht erfüllt</th></tr></thead><tbody>`);
  for (const { s, x } of pruefliste) o.push(`<tr><td>${s.nr}</td><td>${h(x.m.text)}</td><td class="box">☐</td><td class="box">☐</td></tr>`);
  o.push('</tbody></table></section>');

  // 4 Pflichten-Check
  o.push('<section id="pflichten"><h2>4 Pflichten-Check</h2><p>Organisationspflichten, die für diesen Betrieb gelten.</p><table><thead><tr><th>Pflicht</th><th>Was nachzuweisen ist</th><th>Quelle</th><th>Stand</th></tr></thead><tbody>');
  for (const t of pl) { const p = P.get(t.pflicht); const st = t.status === 'offen' ? 'offen: ' + t.fehlt.map(a => A.get(a).frage).join(' ') : ((fall.pflichtpruefung || {})[p.id] || 'nachzuweisen');
    o.push(`<tr><td>${h(p.name)}</td><td>${h(p.nachweis)}</td><td class="klein">${h(quelle(p))}</td><td>${h(st)}</td></tr>`); }
  o.push('</tbody></table></section>');

  // 5 Gefahrstoffverzeichnis
  o.push('<section id="stoffe"><h2>5 Gefahrstoffverzeichnis</h2><p>Mindestangaben nach § 6 Absatz 12 Gefahrstoffverordnung: Bezeichnung, Einstufung, Mengenbereich, Arbeitsbereiche, Verweis auf das Sicherheitsdatenblatt.</p><table><thead><tr><th>Bezeichnung</th><th>Einstufung</th><th>Menge im Betrieb</th><th>Arbeitsbereiche</th><th>Sicherheitsdatenblatt</th></tr></thead><tbody>');
  for (const st of stoffe) { const wo = fall.stationen.filter(x => x.schritte.some(y => (y.stoffe || []).includes(st.id) || (y.material || []).includes(st.material))).map(x => `${x.nr} ${x.name}`);
    const a = alt(st); o.push(`<tr><td>${h(st.name)}</td><td>${h([...(st.h || []), ...(st.euh || [])].join(', ') || 'nicht eingestuft')}</td><td>${h(st.menge || '…………')}</td><td>${h(wo.join('; ') || '…………')}</td><td>${st.sdb ? `Version ${h(st.sdb.version)} vom ${datum(st.sdb.datum)}${a > 3 ? ` <span class="marke">${Math.floor(a)} Jahre alt, beim Lieferanten aktuelles anfordern</span>` : ''}` : '<span class="marke">fehlt</span>'}</td></tr>`); }
  if (!stoffe.length) o.push('<tr><td colspan="5">Im Protokoll sind keine Gefahrstoffe mit Datenblatt erfasst. Beim Rundgang Gebinde und Lager prüfen.</td></tr>');
  o.push('</tbody></table></section>');

  // 6 Arbeitsplatzkarten
  o.push('<section id="karten"><h2>6 Arbeitsplatzkarten</h2><p>Zum Aushang am Arbeitsplatz und für die Unterweisung.</p>');
  for (const s of stationen) { const gs = [...new Set(s.treffer.map(t => R.get(t.regel).gefaehrdung))].map(g => G.get(g).name); const ms = massnahmen(s);
    o.push(`<article class="karte"><h3>${s.nr} ${h(s.name)}</h3><div class="spalten"><div><h4>Gefahren</h4><ul>${gs.map(x => `<li>${h(x)}</li>`).join('')}</ul></div><div><h4>So schützt du dich</h4><ul>${ms.filter(x => x.m.art === 'P').map(x => `<li>${h(x.m.text)}</li>`).join('') || '<li>Keine persönliche Schutzausrüstung abgeleitet.</li>'}</ul><h4>Regeln am Platz</h4><ul>${ms.filter(x => x.m.art === 'O').slice(0, 8).map(x => `<li>${h(x.m.text)}</li>`).join('')}</ul></div></div><p class="klein">Unterwiesen am ……………… durch ……………………</p></article>`); }
  o.push('</section></body></html>');
  return { html: o.join('\n'), zahlen: { stationen: stationen.length, gefaehrdungen: u.gefaehrdungen.length, plan: zeilen.length, pruefliste: pruefliste.length, pflichten: pl.length, stoffe: stoffe.length, entwurf: entwurf.length } };
}

const CSS = `:root{--t:#1b1f23;--g:#5b636b;--l:#d7dbdf;--h:#f4f6f8;--r:#b42318;--o:#b54708;--gr:#067647}
body{font:10.5pt/1.4 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:var(--t);background:#fff;margin:0 auto;max-width:1000px;padding:16px}
h1{font-size:20pt;margin:0 0 4px}h2{font-size:15pt;border-bottom:2px solid var(--t);padding-bottom:3px;margin-top:28px}h3{font-size:12pt;margin:18px 0 6px}h4{font-size:10.5pt;margin:12px 0 4px}
table{width:100%;border-collapse:collapse;margin:6px 0 10px}th,td{border:1px solid var(--l);padding:4px 6px;text-align:left;vertical-align:top}th{background:var(--h);font-weight:600}
.gross{font-size:14pt;margin:0 0 10px}.kopf{width:auto}.kopf th{width:130px}.klein{font-size:9pt;color:var(--g)}.hinweis{background:var(--h);padding:8px 10px;border-left:3px solid var(--g)}
.leer td{color:var(--g)}.offen{color:var(--o)}.marke{color:var(--o);font-size:9pt}.ist-nicht-erfüllt{color:var(--r);font-weight:600}.ist-erfüllt{color:var(--gr)}.ist-zu-prüfen{color:var(--o)}
.d-sofort{color:var(--r);font-weight:600}.box{text-align:center;width:70px}.zahlen{width:auto}.zahlen td{text-align:right;min-width:60px}.unterschrift{margin-top:24px}
.karte{border:2px solid var(--t);padding:10px 12px;margin:12px 0}.spalten{display:grid;grid-template-columns:1fr 1fr;gap:16px}nav ol{columns:2}
@media (max-width:640px){.spalten{grid-template-columns:1fr}table{font-size:9pt}nav ol{columns:1}}
@media print{body{max-width:none;padding:0}section{break-before:page}.platz,.karte{break-inside:avoid}nav{display:none}a{color:inherit;text-decoration:none}}`;

module.exports = { dokumente };
if (require.main === module) {
  const datei = process.argv[2]; if (!datei) { console.error('Aufruf: node kern/dokumente.js <fall.json> [ziel.html]'); process.exit(2); }
  const b = ladeBibliothek(path.join(__dirname, '..', 'bibliothek')); const fall = JSON.parse(fs.readFileSync(datei, 'utf8'));
  const ziel = process.argv[3] || path.join(__dirname, '..', 'ausgabe', path.basename(datei, '.json') + '-unterlagen.html');
  const { html, zahlen } = dokumente(b, fall, { heute: process.env.HEUTE }); fs.writeFileSync(ziel, html);
  console.log(`${path.relative(process.cwd(), ziel)}: ${zahlen.stationen} Arbeitsplätze, ${zahlen.gefaehrdungen} Gefährdungen, ${zahlen.plan} Zeilen im Maßnahmenplan, ${zahlen.pruefliste} zu prüfen, ${zahlen.pflichten} Pflichten, ${zahlen.stoffe} Gefahrstoffe, ${zahlen.entwurf} Regeln im Entwurf.`);
}
