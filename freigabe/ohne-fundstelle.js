#!/usr/bin/env node
'use strict';
// Schreibt die Liste aller Maßnahmen, für die beide Prüfer keine Fundstelle gefunden haben, nach freigabe/Massnahmen-ohne-Fundstelle.md.
// Andre entscheidet je Zeile: Erfahrung (bleibt, gekennzeichnet), Streichen oder Quelle nennen.
const fs = require('fs'); const path = require('path'); const { ladeBibliothek } = require('../kern/laden');
const W = path.join(__dirname, '..'); const b = ladeBibliothek(path.join(W, 'bibliothek')); const heute = (process.env.HEUTE || new Date().toISOString().slice(0, 10)).split('-').reverse().join('.');
const zeilen = b.regeln.flatMap(r => r.massnahmen.filter(m => m.fundstelle === 'keine' && m.grundlage !== 'erfahrung').map(m => `| ${m.id} | ${r.name} | ${m.text.replace(/\|/g, '/')} | ${(r.belegstand && r.belegstand.lauf) || ''} |`));
const md = ['# Maßnahmen ohne Fundstelle', '', `Stand ${heute}. ${zeilen.length} Maßnahmen. Beide Prüfer haben sie im Regelwerk gesucht und keine wörtliche Fundstelle gefunden. Die Regel selbst ist belegt; diese Maßnahmen stehen im Bericht als „fachliche Empfehlung, ohne Fundstelle“. Sie können trotzdem richtig sein. Je Zeile entscheidest du:`, '',
  '- **Erfahrung:** Die Maßnahme bleibt und wird als Empfehlung der Fachkraft gekennzeichnet.', '- **Streichen:** Die Maßnahme entfällt.', '- **Quelle:** Du nennst das Dokument, in dem sie steht; es wird geladen und geprüft.', '',
  'Antwort im Gespräch, zum Beispiel: „alle Erfahrung außer R14-M2 streichen“ oder „R07-M1 Quelle: Betriebsanleitung“.', '', '| Maßnahme | Regel | Wortlaut | Beleg-Lauf |', '| --- | --- | --- | --- |', ...zeilen, ''];
fs.writeFileSync(path.join(__dirname, 'Massnahmen-ohne-Fundstelle.md'), md.join('\n')); console.log(`${zeilen.length} Maßnahmen ohne Fundstelle → freigabe/Massnahmen-ohne-Fundstelle.md`);
