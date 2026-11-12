# Arbeitsregeln für Claude in diesem Repository

Sprache: Deutsch, klar, ohne Fachjargon aus der Softwareentwicklung. Andre ist Fachkraft für Arbeitssicherheit, kein Programmierer.

## Zuerst lesen

`docs/01_Zielbild.md`, `docs/02_Lastenheft.md`, `docs/03_Pflichtenheft.md`, `docs/04_Roadmap.md`. Jede Arbeit gehört zu einem Meilenstein der Roadmap. Ändert sich ein Stand im Lastenheft oder Pflichtenheft, die Spalte „Stand“ dort nachführen.

## Grundsätze

- Die Bibliothek (`bibliothek/`) ist reine Daten. Fachliche Inhalte nie in den Programmcode schreiben.
- Die Auswertung rechnet ohne KI. KI darf nur ein Protokoll in einen Fall übersetzen, als Vorschlag mit markierten Unsicherheiten.
- Nie raten: Fehlt eine Angabe, bleibt das Ergebnis offen.
- Jede Regel und Pflicht braucht eine Quelle. `beleg: geprueft` nur, wenn die Fundstelle am Text im Ordner `regelwerk/` gelesen wurde. Sonst `offen` mit `stelle: null`.
- `freigabe: geprueft` setzt nur Andre.
- Protokolle in `protokolle/` nie verändern.
- Keine Unterlagen von Andres Arbeitgeber verwenden.
- Kein Microsoft Office. Dokumente als Markdown, HTML oder Claude Docs.

## Nach jeder Änderung

1. `node --test test/kern.test.js`
2. Ändert sich ein eingefrorenes Ergebnis gewollt: `EINFRIEREN=1 node --test test/kern.test.js` und die Änderung im Commit begründen.
3. `node bauen.js`, wenn Bibliothek, Kern oder Oberfläche geändert wurden.
4. Eintrag im `LERNBUCH.md`, wenn ein Protokoll verarbeitet wurde.

## Ein Protokoll verarbeiten

1. Text unverändert nach `protokolle/JJJJ-MM-TT_betrieb_bereich.md`.
2. `node kern/protokoll.js <datei>` für die bekannten Wörter.
3. Fall in `faelle/` anlegen oder ergänzen: Bereich, Arbeitsplatz, Personen, Schritte, Stoffe, Angaben, Beobachtungen. Alles, was nicht in die Stammdaten passt, unter `wuensche` notieren, nicht passend biegen.
4. Auswerten, Abgleich und Trefferquote berichten.
5. Lücken schließen: zuerst Wörterbuch, dann Stammdaten, dann Regeln. Neue Regeln als Entwurf mit offenem Beleg.
6. Fall einfrieren (`erwartet/`), Lernbuch, Commit.
