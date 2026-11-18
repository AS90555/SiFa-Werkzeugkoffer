#!/usr/bin/env node
'use strict';
// Liste der Regeln, die zwei Prüfer im geladenen Regelwerk nicht belegen konnten. Ein weiterer Prüflauf auf denselben Text bringt nichts.
// Andre entscheidet je Regel: Quelle nennen (wird geladen und geprüft), als Erfahrung behalten (dann je Maßnahme), umformulieren oder streichen.
const fs = require('fs'); const path = require('path'); const { ladeBibliothek } = require('../kern/laden'); const { klartext } = require('../kern/klartext');
const W = path.join(__dirname, '..'); const b = ladeBibliothek(path.join(W, 'bibliothek')); const Q = new Map(b.quellen.map(q => [q.id, q])); const G = new Map(b.gefaehrdungen.map(g => [g.id, g]));
const heute = (process.env.HEUTE || new Date().toISOString().slice(0, 10)).split('-').reverse().join('.');
const offen = b.regeln.filter(r => !(r.belegstand && r.belegstand.pruefungen >= 2));
const md = ['# Regeln ohne Beleg', '', `Stand ${heute}. ${offen.length} von ${b.regeln.length} Regeln. Zwei Prüfer haben im geladenen Regelwerk keine Stelle gefunden, die eine ihrer Maßnahmen wörtlich deckt. Die Regeln wirken trotzdem in der Auswertung, sind dort aber als „Entwurf“ gekennzeichnet.`, '',
  'Je Regel entscheidest du: **Quelle** (du nennst das Dokument, es wird geladen und geprüft), **Erfahrung** (die Maßnahmen bleiben als deine Empfehlung), **ändern** (was anders sein soll) oder **streichen**.', '',
  'Antwort im Gespräch, zum Beispiel: „R121 Quelle: DGUV Information 209-015“ oder „R131 Erfahrung“ oder „R140 streichen“.', ''];
for (const r of offen) md.push(`## ${r.id} ${r.name}`, '', `- **Gilt, wenn:** ${klartext(b, r.wenn)}`, `- **Gefährdung:** ${G.get(r.gefaehrdung).name}`,
  `- **Maßnahmen:** ${r.massnahmen.map(m => m.text).join(' · ')}`, `- **Genannte Quellen:** ${(r.quellen || []).map(q => Q.get(q.id).titel).join(', ') || 'keine'}`, '');
fs.writeFileSync(path.join(__dirname, 'Regeln-ohne-Beleg.md'), md.join('\n')); console.log(`${offen.length} Regeln ohne Beleg → freigabe/Regeln-ohne-Beleg.md`);
