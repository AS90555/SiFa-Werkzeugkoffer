# Arbeitsregeln für Claude in diesem Repository

Sprache: Deutsch, klar, ohne Fachjargon aus der Softwareentwicklung. Andre ist Fachkraft für Arbeitssicherheit, kein Programmierer.

## Zuerst lesen

`docs/01_Zielbild.md`, `docs/02_Lastenheft.md`, `docs/03_Pflichtenheft.md`, `docs/04_Roadmap.md`. Jede Arbeit gehört zu einem Meilenstein der Roadmap. Ändert sich ein Stand im Lastenheft oder Pflichtenheft, die Spalte „Stand“ dort nachführen.

## Jede Sitzung beginnt am Leitstand

`node lernen/leitstand.js` zeigt, was als Nächstes fällig ist und was auf Andre wartet. Der Ablauf steht in `docs/05_Lernkreislauf.md`. Angefangenes zuerst zu Ende bringen.

## Grundsätze

- Die Bibliothek (`bibliothek/`) ist reine Daten. Fachliche Inhalte nie in den Programmcode schreiben.
- Die Auswertung rechnet ohne KI. KI darf nur ein Protokoll in einen Fall übersetzen, als Vorschlag mit markierten Unsicherheiten.
- Nie raten: Fehlt eine Angabe, bleibt das Ergebnis offen.
- Jede Regel und Pflicht braucht eine Quelle. `beleg: geprueft` setzt nur `node beleg/zusammenfuehren.js <Lauf> --uebernehmen`, also nur nach zwei unabhängigen Prüfern mit wörtlichem Zitat. Nie von Hand. Sonst `offen`.
- Wird eine belegte oder freigegebene Regel geändert, meldet die Prüfung das. Dann `node beleg/stand.js --bereinigen`: Beleg und Freigabe fallen zurück.
- `freigabe: geprueft` setzt nur Andre: `node freigabe/setzen.js` erst ausführen, wenn er es im Gespräch ausdrücklich gesagt hat. Ein Bericht eines Agenten ist keine Freigabe.
- `grundlage: erfahrung` an einer Maßnahme setzt nur Andre.
- Agenten bekommen ihre Aufträge aus den erzeugten Auftragsdateien, nicht frei formuliert. Sprecher laufen auf dem kleinsten Modell.
- Protokolle in `protokolle/` nie verändern.
- Keine Unterlagen von Andres Arbeitgeber verwenden.
- Protokolle und Fälle enthalten keinen Firmennamen, keinen Ort und keine Personennamen. Taucht so etwas in einem Diktat auf, vor dem Ablegen durch eine neutrale Bezeichnung ersetzen und Andre darauf hinweisen.
- Kein Microsoft Office. Dokumente als Markdown, HTML oder Claude Docs.

## Nach jeder Änderung

1. `npm test` (das sind `test/kern.test.js` und `test/werkstatt.test.js`)
2. Ändert sich ein eingefrorenes Ergebnis gewollt: `EINFRIEREN=1 node --test test/kern.test.js` und die Änderung im Commit begründen.
3. `node bauen.js`, wenn Bibliothek, Kern oder Oberfläche geändert wurden.
4. Eintrag im `LERNBUCH.md`, wenn ein Protokoll, eine Runde oder ein Beleg-Lauf verarbeitet wurde.
5. `node lernen/leitstand.js`, damit `LEITSTAND.md` stimmt.

## Ein Protokoll verarbeiten

1. Text unverändert nach `protokolle/JJJJ-MM-TT_betrieb_bereich.md`.
2. `node kern/protokoll.js <datei>` für die bekannten Wörter.
3. Fall in `faelle/` anlegen oder ergänzen: Bereich, Arbeitsplatz, Personen, Schritte, Stoffe, Angaben, Beobachtungen. Alles, was nicht in die Stammdaten passt, unter `wuensche` notieren, nicht passend biegen.
4. Auswerten, Abgleich und Trefferquote berichten.
5. Lücken schließen: zuerst Wörterbuch, dann Stammdaten, dann Regeln. Neue Regeln als Entwurf mit offenem Beleg.
6. Fall einfrieren (`erwartet/`), Lernbuch, Commit.
