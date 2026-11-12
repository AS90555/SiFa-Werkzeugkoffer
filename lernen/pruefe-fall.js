#!/usr/bin/env node
'use strict';
// Prüft, ob ein Fall formal stimmt. Aufruf: node lernen/pruefe-fall.js <fall.json>
const fs = require('fs'); const path = require('path');
const { ladeBibliothek, pruefeFall } = require('../kern/laden');
const b = ladeBibliothek(path.join(__dirname, '..', 'bibliothek'));
try { const f = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); pruefeFall(b, f); console.log('in Ordnung'); }
catch (e) { console.error(e.message); process.exit(1); }
