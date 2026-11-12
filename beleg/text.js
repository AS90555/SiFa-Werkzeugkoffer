'use strict';
// Zugriff auf die Regelwerkstexte und wörtliche Zitat-Kontrolle.
// Die Texte liegen außerhalb des Repositorys: Umgebungsvariable REGELWERK_TEXT oder ../regelwerk-text
const fs = require('fs'); const path = require('path');
const ORT = process.env.REGELWERK_TEXT || path.join(__dirname, '..', '..', 'regelwerk-text');
const WURZEL = path.join(__dirname, '..');
const STUFE = { pflicht: 3, vermutungswirkung: 2, empfehlung: 1 };

// Vergleichsform: nur Buchstaben und Ziffern, klein. So stören Zeilenumbrüche, Trennstriche und Anführungszeichen nicht.
const kompakt = s => s.toLowerCase().replace(/­/g, '').replace(/[^a-z0-9äöüß§]/g, '');
const cache = new Map();
function textVon(datei) { // datei relativ zum Textordner, z. B. TRGS/TRGS-553.txt
  if (cache.has(datei)) return cache.get(datei);
  const p = path.join(ORT, datei); let t = null;
  if (!path.resolve(p).startsWith(path.resolve(ORT))) t = null;
  else if (fs.existsSync(p) && fs.statSync(p).isFile()) t = kompakt(fs.readFileSync(p, 'utf8'));
  cache.set(datei, t); return t;
}
function textDateien(quelle) { // Quelle aus quellen.json → Liste vorhandener Textdateien
  if (!quelle.datei) return [];
  if (quelle.datei.endsWith('/')) { const o = path.join(ORT, quelle.datei); return fs.existsSync(o) ? fs.readdirSync(o).filter(x => x.endsWith('.txt')).sort().map(x => quelle.datei + x) : []; }
  const d = quelle.datei.replace(/\.pdf$/i, '.txt'); return fs.existsSync(path.join(ORT, d)) ? [d] : [];
}
function quelleZuDatei(b, datei) { // Textdatei → Quelle aus quellen.json oder null
  return b.quellen.find(q => q.datei && (q.datei.replace(/\.pdf$/i, '.txt') === datei || (q.datei.endsWith('/') && datei.startsWith(q.datei)))) || null;
}
// Prüft ein Zitat. Rückgabe: null wenn in Ordnung, sonst der Grund.
function zitatFehler(beleg) {
  if (!beleg || typeof beleg.datei !== 'string' || typeof beleg.zitat !== 'string' || typeof beleg.stelle !== 'string' || !beleg.stelle.trim()) return 'Beleg braucht datei, stelle und zitat';
  const worte = beleg.zitat.trim().split(/\s+/).length;
  if (worte < 6) return `Zitat zu kurz (${worte} Wörter, mindestens 6)`;
  if (worte > 60) return `Zitat zu lang (${worte} Wörter, höchstens 60)`;
  if (/\.\.\.|…|\[/.test(beleg.zitat)) return 'Zitat enthält Auslassungen oder Klammern; nur zusammenhängenden Wortlaut zitieren';
  const t = textVon(beleg.datei);
  if (t === null) return `Textdatei ${beleg.datei} gibt es nicht`;
  if (!t.includes(kompakt(beleg.zitat))) return 'Zitat steht so nicht im Text';
  return null;
}
module.exports = { ORT, WURZEL, STUFE, kompakt, textVon, textDateien, quelleZuDatei, zitatFehler };
