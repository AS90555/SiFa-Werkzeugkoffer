#!/usr/bin/env node
'use strict';
// Baut das Werkzeug als eine Datei: dist/Aufnahme.html (zum Doppelklicken) und dist/artifact.html (zum Veröffentlichen).
const fs = require('fs'); const path = require('path'); const w = __dirname; const lies = p => fs.readFileSync(path.join(w, p), 'utf8');
const bib = {}; for (const n of ['merkmale', 'angaben', 'stammdaten', 'quellen', 'gefaehrdungen', 'regeln', 'pflichten', 'woerterbuch']) bib[n] = JSON.parse(lies(`bibliothek/${n}.json`));
require('./kern/laden').ladeBibliothek(path.join(w, 'bibliothek')); // bricht bei Fehlern ab
const modul = (n) => `(function(){const module={exports:{}};const require=function(x){if(x==='./laden')return KERN.laden;return {};};${lies(`kern/${n}.js`).replace("'use strict';", '')};return module.exports;})()`;
const stand = new Date().toISOString().slice(0, 10).split('-').reverse().join('.');
const js = `const KERN={};KERN.laden=${modul('laden')};KERN.auswerten=${modul('auswerten')};\nconst BIBLIOTHEK=${JSON.stringify(bib)};\nconst BEISPIELFALL=${JSON.stringify(JSON.parse(lies('faelle/fensterwerk.json')))};\nconst STAND=${JSON.stringify(stand)};\n${lies('werkzeug/app.js')}`.replace(/<\/script/g, '<\\/script');
const koerper = `<title>Sifa-Werkzeugkoffer Aufnahme</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600&display=swap">\n<style>\n${lies('werkzeug/app.css')}</style>\n<header class="kopf"><div class="innen" id="kopf"></div></header>\n<main class="innen" id="inhalt"></main>\n<script>\n${js}\n</script>\n`;
fs.mkdirSync(path.join(w, 'dist'), { recursive: true });
fs.writeFileSync(path.join(w, 'dist/artifact.html'), koerper); // nur zum Veröffentlichen, nicht im Repo
fs.writeFileSync(path.join(w, 'dist/Aufnahme.html'), `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>\n${koerper}</body></html>`);
console.log('gebaut', (koerper.length / 1024).toFixed(0) + ' KB');
