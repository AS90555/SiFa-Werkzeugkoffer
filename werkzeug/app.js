'use strict';
// Aufnahme-Werkzeug auf dem Kern der Gefährdungs-Bibliothek. KERN und BIB werden beim Bauen eingesetzt.
(function () {
  const { pruefe, pruefeFall } = KERN.laden; const { auswerten, uebersicht, pflichten, abgleich } = KERN.auswerten; const P = new Map(BIBLIOTHEK.pflichten.map(p => [p.id, p]));
  const BIB = BIBLIOTHEK; const BEISPIEL = BEISPIELFALL;
  const fehlerBib = pruefe(BIB).fehler;
  const S = BIB.stammdaten, name = (typ, id) => (S[typ].find(x => x.id === id) || { name: id }).name;
  const R = new Map(BIB.regeln.map(r => [r.id, r])), G = new Map(BIB.gefaehrdungen.map(g => [g.id, g])), Q = new Map(BIB.quellen.map(q => [q.id, q])), A = new Map(BIB.angaben.map(a => [a.id, a]));
  const gefahrstoffe = S.material.filter(m => m.merkmale.includes('m.gefahrstoff'));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const SCHL = 'gefaehrdungs-bibliothek-faelle-v1';

  let Z = { faelle: {}, aktiv: null, sicht: 'ablauf', station: null, entwurf: { material: [] }, meldung: '' };
  function laden() {
    try { const t = localStorage.getItem(SCHL); if (t) { const d = JSON.parse(t); Z.faelle = d.faelle || {}; Z.aktiv = d.aktiv; } } catch (e) { /* ohne Speicher weiter */ }
    if (!Z.aktiv || !Z.faelle[Z.aktiv]) { const f = JSON.parse(JSON.stringify(BEISPIEL)); f.beispiel = true; Z.faelle[f.id] = f; Z.aktiv = f.id; }
  }
  function sichern() { try { localStorage.setItem(SCHL, JSON.stringify({ faelle: Z.faelle, aktiv: Z.aktiv })); } catch (e) { Z.meldung = 'Speichern im Browser nicht möglich. Bitte unter Daten den Fall als Text sichern.'; } }
  const fall = () => Z.faelle[Z.aktiv];

  // Auswertung: nur Stationen mit mindestens einem Schritt gehen in den Kern.
  function rechne() {
    const f = fall(); const kopie = { ...f, stationen: f.stationen.filter(s => s.schritte.length) };
    try { pruefeFall(BIB, kopie); const e = auswerten(BIB, kopie); return { e, u: uebersicht(BIB, e), pl: pflichten(BIB, kopie), ab: abgleich(BIB, kopie, e), fehler: null }; }
    catch (x) { return { e: { stationen: [] }, u: { gefaehrdungen: [], rueckfragen: [] }, pl: [], ab: { stationen: [] }, fehler: x.message }; }
  }
  const treffer = (erg, nr) => (erg.e.stationen.find(s => s.nr === nr) || { treffer: [] }).treffer;
  const pk = (nr, mid) => nr + '|' + mid;
  function zaehle(f, erg, nr) {
    const t = treffer(erg, nr); let mass = 0, bewertet = 0, fehlt = 0; const offen = new Set();
    for (const x of t) { x.fehlt.forEach(a => offen.add(a)); if (x.status !== 'trifft zu') continue; for (const m of R.get(x.regel).massnahmen) { mass++; const w = (f.pruefung || {})[pk(nr, m.id)]; if (w) bewertet++; if (w === 'fehlt') fehlt++; } }
    return { gef: t.filter(x => x.status === 'trifft zu').length, offen: offen.size, mass, bewertet, fehlt };
  }

  // ---------- Sichten
  function sKopf() {
    const f = fall(); const tabs = [['ablauf', 'Rundgang'], ['pflichten', 'Pflichten'], ['stoffe', 'Stoffe'], ['ergebnis', 'Ergebnis'], ['daten', 'Daten']];
    return `<div class="betrieb"><h1>${esc(f.name)}</h1>${f.beispiel ? '<small>Beispiel aus dem Pilot</small>' : ''}</div>
      <nav>${tabs.map(([k, t]) => `<button data-a="sicht" data-v="${k}" aria-current="${Z.sicht === k || (k === 'ablauf' && Z.sicht === 'station')}">${t}</button>`).join('')}</nav>`;
  }
  function sAblauf(erg) {
    const f = fall();
    const bereiche = [...new Set(f.stationen.map(s => s.bereich || 'Ohne Bereich'))];
    const zeile = s => { const z = zaehle(f, erg, s.nr);
      const unter = s.schritte.length ? s.schritte.map(x => name('vorgang', x.vorgang)).join(' · ') : 'Noch kein Schritt aufgenommen';
      return `<button class="station" data-a="station" data-v="${s.nr}"><span class="nr">${s.nr}</span><span><b>${esc(s.name)}</b><span class="unter">${esc(unter)}</span></span>
        <span class="marken">${z.gef ? `<span class="marke">${z.gef} Gefährdungen</span>` : ''}${z.offen ? `<span class="marke offen">${z.offen} Angaben offen</span>` : ''}${z.fehlt ? `<span class="marke pflicht">${z.fehlt} fehlen</span>` : ''}${z.mass && z.bewertet === z.mass && !z.fehlt ? '<span class="marke gut">geprüft</span>' : ''}</span></button>`; };
    const zeilen = bereiche.map(b => `<h2>${esc(b)}</h2><div class="kette">${f.stationen.filter(s => (s.bereich || 'Ohne Bereich') === b).map(zeile).join('')}</div>`).join('');
    return `<div class="blatt"><h2>Rundgang durch den Betrieb</h2><p class="leise">Bereich für Bereich, Arbeitsplatz für Arbeitsplatz, entlang der Wertschöpfung. Nebenanlagen wie Absaugung, Werkzeugraum oder Instandhaltung gehören dazu.</p>
      <div class="reihe"><label>Bereich<input type="text" id="neu-bereich" list="bereiche" placeholder="zum Beispiel Zuschnitt" value="${esc(Z.bereich || '')}"><datalist id="bereiche">${bereiche.map(b => `<option value="${esc(b)}">`).join('')}</datalist></label><label>Neuer Arbeitsplatz<input type="text" id="neu-station" placeholder="zum Beispiel Formatkreissäge"></label><button class="knopf fest" data-a="station-neu">Anlegen</button></div></div>
      ${zeilen || '<p class="leise">Noch kein Arbeitsplatz.</p>'}`;
  }
  function sStation(erg) {
    const f = fall(); const s = f.stationen.find(x => x.nr === Z.station); if (!s) { Z.sicht = 'ablauf'; return sAblauf(erg); }
    const umg = S.umgebung.map(u => `<button class="chip" data-a="umgebung" data-v="${u.id}" aria-pressed="${(s.umgebung || []).includes(u.id)}">${esc(u.name)}</button>`).join('');
    const schritte = s.schritte.map((x, i) => `<div class="schritt"><div><b>${esc(name('vorgang', x.vorgang))}</b> · ${esc(name('ausfuehrung', x.ausfuehrung))}<div class="klein leise">${esc((x.material || []).map(m => name('material', m)).join(', ') || 'ohne Material')}</div></div><button class="knopf zweit klein" data-a="schritt-weg" data-v="${i}">Entfernen</button></div>`).join('');
    const opt = (typ, wert) => `<option value="">bitte wählen</option>` + S[typ].map(x => `<option value="${x.id}"${wert === x.id ? ' selected' : ''}>${esc(x.name)}</option>`).join('');
    const E = Z.entwurf;
    const mat = S.material.map(m => `<button class="chip" data-a="entwurf-material" data-v="${m.id}" aria-pressed="${E.material.includes(m.id)}">${esc(m.name)}</button>`).join('');
    const t = treffer(erg, s.nr);
    const offen = new Map(); for (const x of t) for (const a of x.fehlt) offen.set(a, A.get(a));
    const fragen = [...offen.values()].map(a => {
      if (a.aus_stoff) return `<div class="hinweis">${esc(a.frage)} Das beantwortet das Sicherheitsdatenblatt: Stoff unter „Stoffe“ eintragen.</div>`;
      const v = (s.angaben || {})[a.id];
      return a.typ === 'zahl'
        ? `<label>${esc(a.frage)}<input type="number" step="any" id="ang-${a.id}" data-a-change="angabe" data-v="${a.id}" value="${v == null ? '' : v}"></label>`
        : `<div><div class="klein leise">${esc(a.frage)}</div><div class="chips"><button class="chip" data-a="angabe-jn" data-v="${a.id}|1" aria-pressed="${v === true}">Ja</button><button class="chip" data-a="angabe-jn" data-v="${a.id}|0" aria-pressed="${v === false}">Nein</button></div></div>`;
    }).join('');
    const beantwortet = Object.entries(s.angaben || {}).filter(([k]) => !offen.has(k)).map(([k, v]) => `<span class="marke">${esc(A.get(k) ? A.get(k).frage : k)} ${v === true ? 'Ja' : v === false ? 'Nein' : v} <button class="zurueck klein" data-a="angabe-weg" data-v="${k}" aria-label="Angabe löschen">×</button></span>`).join('');
    const gef = t.map(x => { const r = R.get(x.regel); const g = G.get(r.gefaehrdung);
      const quelle = r.quellen.length ? r.quellen.map(q => `${Q.get(q.id).titel}${q.stelle ? ', ' + q.stelle : ' (Fundstelle offen)'}`).join('; ') : 'ohne Beleg';
      const mass = x.status === 'trifft zu' ? r.massnahmen.map(m => { const w = (f.pruefung || {})[pk(s.nr, m.id)];
        return `<div class="mass"><span class="art" title="S Ersatz, T technisch, O organisatorisch, P persönlich">${m.art}</span><span>${esc(m.text)}</span><span class="wahl">${[['ok', 'Vorhanden'], ['fehlt', 'Fehlt'], ['entfaellt', 'Trifft nicht zu']].map(([k, l]) => `<button data-a="pruef" data-v="${m.id}|${k}" data-w="${k}" aria-pressed="${w === k}">${l}</button>`).join('')}</span></div>`; }).join('')
        : `<div class="hinweis">Noch offen. Es fehlt: ${esc(x.fehlt.map(a => A.get(a).frage).join(' '))}</div>`;
      return `<div class="gef"><div class="gefkopf"><h3>${esc(g.name)}</h3><span class="marken"><span class="marke ${r.verbindlichkeit === 'pflicht' ? 'pflicht' : ''}">${esc(r.verbindlichkeit)}</span><span class="marke">${r.id}</span></span></div>
        <p class="klein leise">Entsteht durch: ${esc(r.entsteht)}</p>${mass}<p class="quelle">Quelle: ${esc(quelle)}. Beleg ${r.beleg === 'geprueft' ? 'am Text geprüft' : r.beleg === 'offen' ? 'noch nicht geprüft' : 'fehlt'}; Regel im Entwurf.</p></div>`; }).join('');
    return `<button class="zurueck" data-a="sicht" data-v="ablauf">← Zum Rundgang</button>
      <div class="blatt"><div class="reihe"><label>Arbeitsplatz ${s.nr}<input type="text" id="st-name" data-a-change="station-name" value="${esc(s.name)}"></label><label>Bereich<input type="text" id="st-bereich" data-a-change="station-bereich" value="${esc(s.bereich || '')}"></label><label>Personen<input type="number" min="0" id="st-personen" data-a-change="station-personen" value="${s.personen == null ? '' : s.personen}"></label><button class="knopf zweit fest" data-a="station-weg">Löschen</button></div>
        <div><div class="klein leise">Umgebung</div><div class="chips">${umg}</div></div></div>
      <div class="blatt"><h2>Was wird hier getan?</h2>${schritte || '<p class="leise">Noch kein Schritt. Ein Schritt ist ein Vorgang mit seiner Ausführung und dem Material.</p>'}
        <div class="reihe"><label>Vorgang<select id="e-vorgang" data-a-change="entwurf" data-v="vorgang">${opt('vorgang', E.vorgang)}</select></label><label>Ausführung<select id="e-ausf" data-a-change="entwurf" data-v="ausfuehrung">${opt('ausfuehrung', E.ausfuehrung)}</select></label></div>
        <div><div class="klein leise">Material und Stoffe in diesem Schritt</div><div class="chips">${mat}</div></div>
        <div class="reihe"><button class="knopf fest" data-a="schritt-neu">Schritt hinzufügen</button></div>
        <div class="reihe"><label>Fehlt etwas in den Listen? Kurz beschreiben, es wird als Wunsch an die Bibliothek notiert.<input type="text" id="wunsch" placeholder="zum Beispiel Kleben mit Heißleim, Kantenanleimmaschine"></label><button class="knopf zweit fest" data-a="wunsch">Notieren</button></div></div>
      ${fragen || beantwortet ? `<div class="blatt"><h2>Angaben zu dieser Station</h2>${fragen}${beantwortet ? `<div class="chips">${beantwortet}</div>` : ''}</div>` : ''}
      <div class="blatt"><h2>Eigene Beobachtungen</h2><p class="leise klein">Was du beim Rundgang selbst als Gefährdung siehst. Das System legt es gegen sein Ergebnis.</p>
        ${(s.beobachtungen || []).map((o, i) => `<div class="schritt"><div>${esc(o.text)}<div class="klein leise">${o.gefaehrdung ? esc(G.get(o.gefaehrdung).name) : 'keiner Gefährdung der Bibliothek zugeordnet'}</div></div><button class="knopf zweit klein" data-a="beob-weg" data-v="${i}">Entfernen</button></div>`).join('')}
        <div class="reihe"><label>Beobachtung<input type="text" id="beob-text" placeholder="zum Beispiel Späne auf dem Boden, Rutschgefahr"></label><label>Entspricht der Gefährdung<select id="beob-gef"><option value="">keine passende in der Liste</option>${BIB.gefaehrdungen.map(g => `<option value="${g.id}">${esc(g.name)}</option>`).join('')}</select></label><button class="knopf zweit fest" data-a="beob-neu">Notieren</button></div></div>
      <div class="blatt"><h2>Gefährdungen und Maßnahmen</h2>${gef || '<p class="leise">Sobald ein Schritt aufgenommen ist, erscheinen hier die Gefährdungen.</p>'}</div>`;
  }
  function sPflichten(erg) {
    const f = fall(); const B = f.betrieb || {};
    const fragen = BIB.angaben.filter(a => a.ebene === 'betrieb').map(a => { const v = B[a.id];
      return a.typ === 'zahl' ? `<label>${esc(a.frage)}<input type="number" min="0" id="b-${a.id}" data-a-change="betrieb" data-v="${a.id}" value="${v == null ? '' : v}"></label>`
        : `<div><div class="klein leise">${esc(a.frage)}</div><div class="chips"><button class="chip" data-a="betrieb-jn" data-v="${a.id}|1" aria-pressed="${v === true}">Ja</button><button class="chip" data-a="betrieb-jn" data-v="${a.id}|0" aria-pressed="${v === false}">Nein</button></div></div>`; }).join('');
    const liste = erg.pl.map(t => { const p = P.get(t.pflicht); const w = (f.pflichtpruefung || {})[p.id];
      const quelle = p.quellen.map(q => `${Q.get(q.id).titel}${q.stelle ? ', ' + q.stelle : ' (Fundstelle offen)'}`).join('; ');
      return `<div class="gef"><div class="gefkopf"><h3>${esc(p.name)}</h3><span class="marke">${p.id}</span></div><p>${esc(p.pflicht)}</p><p class="klein leise">Nachweis: ${esc(p.nachweis)}</p>
        ${t.status === 'offen' ? `<div class="hinweis">Noch offen. Es fehlt: ${esc(t.fehlt.map(a => A.get(a).frage).join(' '))}</div>` : `<span class="wahl">${[['ok', 'Vorhanden'], ['fehlt', 'Fehlt'], ['entfaellt', 'Trifft nicht zu']].map(([k, l]) => `<button data-a="pflicht" data-v="${p.id}|${k}" data-w="${k}" aria-pressed="${w === k}">${l}</button>`).join('')}</span>`}
        <p class="quelle">Quelle: ${esc(quelle)}. Beleg ${p.beleg === 'geprueft' ? 'am Text geprüft' : 'noch nicht geprüft'}; Pflicht im Entwurf.</p></div>`; }).join('');
    return `<div class="blatt"><h2>Angaben zum Betrieb</h2>${fragen}</div><div class="blatt"><h2>Organisationspflichten</h2><p class="leise">Ergeben sich aus den Angaben zum Betrieb und aus dem, was beim Rundgang aufgenommen wurde.</p>${liste}</div>`;
  }
  function sStoffe() {
    const f = fall(); const heute = Date.now();
    const zeilen = (f.stoffe || []).map((s, i) => { const alt = s.sdb ? (heute - new Date(s.sdb.datum)) / (365.25 * 864e5) : 0;
      return `<tr><td><b>${esc(s.name)}</b><div class="klein leise">${esc(name('material', s.material))}</div></td><td>${esc([...s.h, ...(s.euh || [])].join(', ') || 'nicht eingestuft')}</td><td>${s.sdb ? `Version ${esc(s.sdb.version || '?')} vom ${esc(s.sdb.datum.split('-').reverse().join('.'))}${alt > 3 ? `<div class="klein" style="color:var(--offen)">${Math.floor(alt)} Jahre alt, aktuelle Fassung anfordern</div>` : ''}` : 'fehlt'}</td><td><button class="knopf zweit klein" data-a="stoff-weg" data-v="${i}">Entfernen</button></td></tr>`; }).join('');
    return `<div class="blatt"><h2>Stoffe mit Sicherheitsdatenblatt</h2><p class="leise">Jeder Stoff einmal. Die Einstufung gilt dann an allen Stationen, an denen diese Stoffart im Schritt steht.</p>
      <div class="tabelle"><table><thead><tr><th>Stoff</th><th>Einstufung</th><th>Datenblatt</th><th></th></tr></thead><tbody>${zeilen || '<tr><td colspan="4" class="leise">Noch kein Stoff.</td></tr>'}</tbody></table></div></div>
      <div class="blatt"><h2>Stoff aufnehmen</h2><div class="reihe"><label>Handelsname<input type="text" id="s-name"></label><label>Stoffart<select id="s-art">${gefahrstoffe.map(m => `<option value="${m.id}">${esc(m.name)}</option>`).join('')}</select></label></div>
        <div class="reihe"><label>Version des Datenblatts<input type="text" id="s-version"></label><label>Überarbeitet am<input type="date" id="s-datum"></label></div>
        <label>Abschnitt 2 des Datenblatts hier einfügen oder H-Sätze eintippen. Leer lassen, wenn das Produkt nicht eingestuft ist.<textarea id="s-h" placeholder="H360D, H412, EUH208"></textarea></label>
        <div class="reihe"><button class="knopf fest" data-a="stoff-neu">Stoff speichern</button></div></div>`;
  }
  function sErgebnis(erg) {
    const f = fall(); const u = erg.u;
    const gef = u.gefaehrdungen.map(g => `<tr><td class="z">${g.faktor}</td><td>${esc(g.name)}</td><td class="z">${g.stationen.join(', ')}</td></tr>`).join('');
    const rf = u.rueckfragen.map(r => `<tr><td>${esc(r.frage)}</td><td class="z">${r.stationen.join(', ')}</td></tr>`).join('');
    const liste = []; let mass = 0, bewertet = 0;
    for (const s of f.stationen) for (const x of treffer(erg, s.nr)) { if (x.status !== 'trifft zu') continue; const r = R.get(x.regel);
      for (const m of r.massnahmen) { mass++; const w = (f.pruefung || {})[pk(s.nr, m.id)]; if (w) bewertet++; if (w === 'fehlt') liste.push(`<tr><td class="z">${s.nr}</td><td>${esc(m.text)}<div class="klein leise">${esc(G.get(r.gefaehrdung).name)}</div></td><td><span class="marke ${r.verbindlichkeit === 'pflicht' ? 'pflicht' : ''}">${esc(r.verbindlichkeit)}</span></td></tr>`); } }
    const wu = (f.wuensche || []).map((w, i) => `<tr><td class="z">${w.station || ''}</td><td>${esc(w.text)}</td><td><button class="knopf zweit klein" data-a="wunsch-weg" data-v="${i}">Erledigt</button></td></tr>`).join('');
    return `${erg.fehler ? `<div class="hinweis">${esc(erg.fehler)}</div>` : ''}
      <div class="blatt"><h2>Stand</h2><div class="chips"><span class="marke">${f.stationen.length} Arbeitsplätze</span><span class="marke">${u.gefaehrdungen.length} Gefährdungen</span><span class="marke">${bewertet} von ${mass} Maßnahmen vor Ort bewertet</span><span class="marke ${liste.length ? 'pflicht' : ''}">${liste.length} fehlen</span><span class="marke ${u.rueckfragen.length ? 'offen' : ''}">${u.rueckfragen.length} offene Fragen</span></div>
        <p class="klein leise">Alle Regeln der Bibliothek stehen im Entwurf. Das Ergebnis ist ein Arbeitsstand, keine freigegebene Gefährdungsbeurteilung.</p></div>
      <div class="blatt"><h2>Fehlende Maßnahmen</h2><div class="tabelle"><table><thead><tr><th>Platz</th><th>Maßnahme</th><th>Stufe</th></tr></thead><tbody>${liste.join('') || '<tr><td colspan="3" class="leise">Keine Maßnahme als fehlend markiert.</td></tr>'}</tbody></table></div></div>
      ${erg.ab.stationen.length ? `<div class="blatt"><h2>Abgleich mit deinen Beobachtungen</h2><div class="chips"><span class="marke gut">${erg.ab.getroffen} getroffen</span><span class="marke ${erg.ab.uebersehen ? 'pflicht' : ''}">${erg.ab.uebersehen} vom System übersehen</span><span class="marke ${erg.ab.ohneEintrag ? 'offen' : ''}">${erg.ab.ohneEintrag} ohne Eintrag in der Bibliothek</span><span class="marke">${erg.ab.zusaetzlich} zusätzlich gefunden</span><span class="marke">Trefferquote ${erg.ab.quote} %</span></div>
        <div class="tabelle"><table><thead><tr><th>Platz</th><th>Übersehen oder ohne Eintrag</th><th>Zusätzlich vom System</th></tr></thead><tbody>${erg.ab.stationen.map(x => `<tr><td class="z">${x.nr}</td><td>${esc([...x.uebersehen, ...x.ohneEintrag].join('; ') || 'nichts')}</td><td>${esc(x.zusaetzlich.map(g => G.get(g).name).join('; ') || 'nichts')}</td></tr>`).join('')}</tbody></table></div></div>` : ''}
      <div class="blatt"><h2>Gefährdungen im Betrieb</h2><div class="tabelle"><table><thead><tr><th>Faktor</th><th>Gefährdung</th><th>Plätze</th></tr></thead><tbody>${gef || '<tr><td colspan="3" class="leise">Noch keine.</td></tr>'}</tbody></table></div></div>
      <div class="blatt"><h2>Offene Fragen</h2><div class="tabelle"><table><thead><tr><th>Frage</th><th>Plätze</th></tr></thead><tbody>${rf || '<tr><td colspan="2" class="leise">Keine.</td></tr>'}</tbody></table></div></div>
      <div class="blatt"><h2>Wünsche an die Bibliothek</h2><div class="tabelle"><table><thead><tr><th>Platz</th><th>Was fehlt</th><th></th></tr></thead><tbody>${wu || '<tr><td colspan="3" class="leise">Keine.</td></tr>'}</tbody></table></div></div>`;
  }
  function sDaten() {
    const f = fall(); const andere = Object.values(Z.faelle).map(x => `<button class="chip" data-a="fall" data-v="${esc(x.id)}" aria-pressed="${x.id === f.id}">${esc(x.name)}</button>`).join('');
    return `<div class="blatt"><h2>Betriebe</h2><div class="chips">${andere}</div>
        <div class="reihe"><label>Neuer Betrieb<input type="text" id="neu-fall" placeholder="Name des Betriebs"></label><button class="knopf fest" data-a="fall-neu">Anlegen</button></div></div>
      <div class="blatt"><h2>Sichern und übertragen</h2><p class="leise">Die Aufnahme liegt im Browser dieses Geräts. Zum Sichern oder für ein anderes Gerät den Text kopieren und dort einfügen. Der Text ist zugleich die Datei für den Projektordner.</p>
        <textarea id="fall-text" readonly>${esc(JSON.stringify(f, null, 1))}</textarea>
        <div class="reihe"><button class="knopf fest" data-a="kopieren">Text kopieren</button>${location.protocol === 'file:' ? '<button class="knopf zweit fest" data-a="datei">Als Datei speichern</button>' : ''}</div>
        <label>Fall einfügen<textarea id="fall-ein" placeholder="Hier den kopierten Text einfügen"></textarea></label><div class="reihe"><button class="knopf zweit fest" data-a="einlesen">Einlesen</button></div></div>
      <div class="blatt"><h2>Bibliothek</h2><p class="leise">${BIB.regeln.length} Regeln, davon ${BIB.regeln.filter(r => r.beleg === 'geprueft').length} mit am Text geprüftem Beleg und ${BIB.regeln.filter(r => r.freigabe === 'geprueft').length} fachlich freigegeben. ${S.material.length + S.vorgang.length + S.ausfuehrung.length + S.umgebung.length} Stammdaten, ${BIB.gefaehrdungen.length} Gefährdungen. Stand ${esc(STAND)}.</p>${fehlerBib.length ? `<div class="hinweis">${esc(fehlerBib.join(' · '))}</div>` : ''}</div>`;
  }
  function zeichne() {
    const erg = rechne();
    document.getElementById('kopf').innerHTML = sKopf();
    const m = document.getElementById('inhalt');
    m.innerHTML = (Z.meldung ? `<div class="hinweis">${esc(Z.meldung)}</div>` : '') + ({ ablauf: sAblauf, station: sStation, pflichten: sPflichten, stoffe: sStoffe, ergebnis: sErgebnis, daten: sDaten }[Z.sicht])(erg);
    Z.meldung = '';
  }

  // ---------- Aktionen
  const wert = id => { const e = document.getElementById(id); return e ? e.value.trim() : ''; };
  const station = () => fall().stationen.find(x => x.nr === Z.station);
  const AKT = {
    sicht: v => { Z.sicht = v; },
    station: v => { Z.station = Number(v); Z.sicht = 'station'; Z.entwurf = { material: [] }; window.scrollTo(0, 0); },
    'station-neu': () => { const n = wert('neu-station'); if (!n) { Z.meldung = 'Bitte einen Namen für den Arbeitsplatz eingeben.'; return; } const f = fall(); const nr = Math.max(0, ...f.stationen.map(s => s.nr)) + 1; Z.bereich = wert('neu-bereich'); f.stationen.push({ nr, name: n, bereich: Z.bereich || undefined, umgebung: ['halle'], angaben: {}, schritte: [], beobachtungen: [] }); Z.station = nr; Z.sicht = 'station'; Z.entwurf = { material: [] }; },
    'station-weg': () => { const f = fall(); const s = station(); if (!s.loeschen) { s.loeschen = true; Z.meldung = 'Zum Löschen noch einmal auf „Löschen“ tippen.'; return; } f.stationen = f.stationen.filter(x => x.nr !== s.nr); Z.sicht = 'ablauf'; },
    umgebung: v => { const s = station(); s.umgebung = s.umgebung || []; s.umgebung = s.umgebung.includes(v) ? s.umgebung.filter(x => x !== v) : [...s.umgebung, v]; },
    'entwurf-material': v => { const m = Z.entwurf.material; Z.entwurf.material = m.includes(v) ? m.filter(x => x !== v) : [...m, v]; },
    'schritt-neu': () => { const E = Z.entwurf; if (!E.vorgang || !E.ausfuehrung) { Z.meldung = 'Bitte Vorgang und Ausführung wählen.'; return; } station().schritte.push({ material: E.material, vorgang: E.vorgang, ausfuehrung: E.ausfuehrung }); Z.entwurf = { material: [] }; },
    'schritt-weg': v => { station().schritte.splice(Number(v), 1); },
    wunsch: () => { const t = wert('wunsch'); if (!t) return; const f = fall(); (f.wuensche = f.wuensche || []).push({ station: Z.station, text: t }); Z.meldung = 'Notiert. Der Wunsch steht unter Ergebnis.'; },
    'wunsch-weg': v => { fall().wuensche.splice(Number(v), 1); },
    'angabe-jn': v => { const [k, w] = v.split('|'); const s = station(); (s.angaben = s.angaben || {})[k] = w === '1'; },
    'angabe-weg': v => { delete station().angaben[v]; },
    pruef: v => { const [mid, w] = v.split('|'); const f = fall(); f.pruefung = f.pruefung || {}; const k = pk(Z.station, mid); if (f.pruefung[k] === w) delete f.pruefung[k]; else f.pruefung[k] = w; },
    'stoff-neu': () => { const n = wert('s-name'), d = wert('s-datum'), t = wert('s-h'); if (!n || !d) { Z.meldung = 'Bitte Handelsname und Datum des Datenblatts angeben. Ohne Datenblatt bleibt der Stoff offen.'; return; }
      const h = [...new Set((t.match(/\bH[2-4]\d\d[A-Za-z]{0,2}\b/g) || []))], euh = [...new Set(t.match(/\bEUH\d{3}[A-Z]?\b/g) || [])];
      const f = fall(); (f.stoffe = f.stoffe || []).push({ id: 'stoff-' + Date.now().toString(36), name: n, material: wert('s-art'), sdb: { version: wert('s-version'), datum: d }, h, euh }); Z.meldung = `Gespeichert mit ${h.length + euh.length ? [...h, ...euh].join(', ') : 'der Angabe „nicht eingestuft“'}.`; },
    'stoff-weg': v => { fall().stoffe.splice(Number(v), 1); },
    'beob-neu': () => { const t = wert('beob-text'); if (!t) return; const s = station(); (s.beobachtungen = s.beobachtungen || []).push({ text: t, gefaehrdung: wert('beob-gef') || null }); },
    'beob-weg': v => { station().beobachtungen.splice(Number(v), 1); },
    'betrieb-jn': v => { const [k, w] = v.split('|'); const f = fall(); (f.betrieb = f.betrieb || {})[k] = w === '1'; },
    pflicht: v => { const [id, w] = v.split('|'); const f = fall(); f.pflichtpruefung = f.pflichtpruefung || {}; if (f.pflichtpruefung[id] === w) delete f.pflichtpruefung[id]; else f.pflichtpruefung[id] = w; },
    fall: v => { Z.aktiv = v; Z.sicht = 'ablauf'; },
    'fall-neu': () => { const n = wert('neu-fall'); if (!n) { Z.meldung = 'Bitte einen Namen eingeben.'; return; } const id = 'fall-' + Date.now().toString(36); Z.faelle[id] = { id, name: n, betrieb: {}, angaben: {}, stoffe: [], stationen: [], pruefung: {}, pflichtpruefung: {}, wuensche: [] }; Z.aktiv = id; Z.sicht = 'ablauf'; },
    kopieren: () => { const t = document.getElementById('fall-text'); const fertig = () => { Z.meldung = 'Text kopiert.'; zeichne(); }; try { navigator.clipboard.writeText(t.value).then(fertig, () => { t.select(); }); } catch (e) { t.select(); } return 'ohne'; },
    datei: () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(fall(), null, 1)], { type: 'application/json' })); a.download = fall().id + '.json'; a.click(); return 'ohne'; },
    einlesen: () => { try { const f = JSON.parse(wert('fall-ein')); pruefeFall(BIB, { ...f, stationen: f.stationen.filter(s => s.schritte.length) }); if (!f.id || !f.name) throw new Error('Kennung oder Name fehlt.'); delete f.beispiel; Z.faelle[f.id] = f; Z.aktiv = f.id; Z.sicht = 'ablauf'; Z.meldung = 'Fall eingelesen.'; } catch (e) { Z.meldung = 'Einlesen nicht möglich: ' + e.message; } }
  };
  const AEND = {
    entwurf: (v, w) => { Z.entwurf[v] = w; },
    'station-name': (v, w) => { if (w.trim()) station().name = w.trim(); },
    'station-bereich': (v, w) => { station().bereich = w.trim() || undefined; },
    'station-personen': (v, w) => { if (w === '') delete station().personen; else station().personen = Number(w); },
    betrieb: (v, w) => { const f = fall(); f.betrieb = f.betrieb || {}; if (w === '') delete f.betrieb[v]; else f.betrieb[v] = Number(w); },
    angabe: (v, w) => { const s = station(); s.angaben = s.angaben || {}; if (w === '') delete s.angaben[v]; else s.angaben[v] = Number(w); }
  };
  document.addEventListener('click', e => { const b = e.target.closest('[data-a]'); if (!b) return; const f = AKT[b.dataset.a]; if (!f) return; if (b.dataset.a !== 'station-weg' && Z.sicht === 'station' && station()) delete station().loeschen; if (f(b.dataset.v) === 'ohne') return; sichern(); zeichne(); });
  document.addEventListener('change', e => { const b = e.target.closest('[data-a-change]'); if (!b) return; AEND[b.dataset.aChange](b.dataset.v, b.value); sichern(); zeichne(); });
  laden(); zeichne();
})();
