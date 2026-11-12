# SiFa-Werkzeugkoffer

Arbeitswerkzeug für die Fachkraft für Arbeitssicherheit: Aus einem diktierten Rundgangsprotokoll wird eine strukturierte Aufnahme des Betriebs, daraus rechnet die Gefährdungs-Bibliothek Gefährdungen, Maßnahmen und Organisationspflichten mit Quelle aus.

Stand: 12.11.2026, Version 0.3. Alle Regeln und Pflichten stehen fachlich im Entwurf.

## Grundlagen

- [Zielbild](docs/01_Zielbild.md): wofür das Werkzeug da ist
- [Lastenheft](docs/02_Lastenheft.md): was es können muss
- [Pflichtenheft](docs/03_Pflichtenheft.md): wie es gebaut wird
- [Roadmap](docs/04_Roadmap.md): Meilensteine und ihre Abnahme
- [Lernkreislauf](docs/05_Lernkreislauf.md): wie erzeugte Protokolle das System füttern und prüfen

## Der Arbeitskreis

1. Rundgang diktieren, Text als Markdown in `protokolle/` ablegen. Das Protokoll wird nie verändert.
2. Protokoll in einen Fall übersetzen (`faelle/`). Hilfe: `node kern/protokoll.js protokolle/<datei>.md` zeigt, was das Wörterbuch schon kennt.
3. Auswerten: `node kern/cli.js faelle/<fall>.json`.
4. Abgleich lesen: Was hat die Sifa selbst gesehen, was das System? Trefferquote notieren.
5. Lücken schließen: Stammdatum, Wörterbuch, Regel oder Pflicht ergänzen.
6. Einfrieren und Tests laufen lassen, Eintrag ins `LERNBUCH.md`, Commit.

## Grundgedanke

Material × Vorgang × Ausführung × Umgebung → was entsteht → Gefährdung → Maßnahmen mit Quelle.

Eine Station besteht aus Schritten. Jeder Schritt hat einen Vorgang, eine Ausführung und Material. Die Umgebung gilt für die Station. Aus den gewählten Stammdaten ergeben sich Merkmale, die Regeln prüfen nur Merkmale und Angaben.

## Aufbau

| Ordner oder Datei | Inhalt |
| --- | --- |
| `bibliothek/merkmale.json` | Festes Vokabular der Merkmale (m. Material, v. Vorgang, a. Ausführung, u. Umgebung) |
| `bibliothek/stammdaten.json` | Material, Vorgang, Ausführung, Umgebung mit ihren Merkmalen |
| `bibliothek/angaben.json` | Fragen, die je Betrieb, Station oder Schritt beantwortet werden |
| `bibliothek/gefaehrdungen.json` | Jede Gefährdung einmal, mit Gefährdungsfaktor 1 bis 11 |
| `bibliothek/quellen.json` | Regelwerk mit Stufe, Stand und Datei im Ordner `regelwerk` |
| `bibliothek/regeln.json` | Wenn-dann-Regeln mit Maßnahmen, Fundstellen, Belegstatus und Freigabe |
| `bibliothek/pflichten.json` | Organisationspflichten des Betriebs, ausgelöst durch Betriebsangaben oder durch das, was im Betrieb vorkommt |
| `bibliothek/woerterbuch.json` | Alltagswörter aus Protokollen und ihre Zuordnung zu den Stammdaten |
| `protokolle/` | Diktierte Rundgänge als Markdown, unverändert |
| `werkzeug/`, `dist/Aufnahme.html` | Oberfläche zum Prüfen, Ergänzen und Bewerten vor Ort; neu bauen mit `node bauen.js` |
| `docs/Leitfaden-Rundgang.md` | Spickzettel fürs Diktieren |
| `LERNBUCH.md` | Je Protokoll: Trefferquote, Lücken, Änderungen |
| `faelle/` | Betriebe als Fälle. `fensterwerk.json` ist der Pilot. |
| `erwartet/` | Eingefrorenes Ergebnis je Fall für den Regressionstest |
| `kern/laden.js` | Lädt und prüft die Bibliothek. Fehler brechen ab. |
| `kern/auswerten.js` | Rechnet einen Fall aus. Keine KI, kein Zufall. |
| `kern/cli.js` | Bericht als Text: `node kern/cli.js faelle/fensterwerk.json` |
| `kern/vergleich.js` | Vergleich mit der Handtabelle aus dem Probe-Dokument |
| `test/` | Tests: `node --test test/kern.test.js` |

## Stoffe

Produkte eines Betriebs stehen im Fall unter `stoffe`: Name, zugehöriges Stammdatum (`material`), Sicherheitsdatenblatt mit Version und Datum, H-Sätze und EUH-Sätze. Der Kern leitet daraus die Angaben ab. Eine Eigenschaft gilt als vorhanden, sobald ein Stoff des Schritts sie hat. Verneint wird sie nur, wenn für alle Gefahrstoffe des Schritts ein Datenblatt vorliegt. Sonst bleibt sie offen.

## Regeln schreiben

Eine Bedingung ist ein Merkmal (`"a.vakuumheber"`), eine Angabe (`{"angabe":"hartholz","ist":true}`, auch `ab` und `bis` für Zahlen) oder eine Verknüpfung mit `alle`, `eine`, `nicht`.

Fehlt eine Angabe, die über die Regel entscheidet, ist das Ergebnis „offen“ und die Frage wird gestellt. Es wird nie geraten. `braucht` nennt Angaben, die eine zutreffende Regel zusätzlich für die Bewertung verlangt.

Jede Regel trägt:
- `beleg`: `geprueft` (Fundstelle am Text gelesen), `offen`, `ohne-beleg`
- `freigabe`: `entwurf`, `geprueft` (durch Andre), `gesperrt` (wird nicht ausgewertet)
- Maßnahmen mit fester Kennung (`R09-M1`) und Art S, T, O oder P

Die Prüfung beim Laden verhindert unter anderem: unbekannte Merkmale, doppelte Kennungen, Regeln ohne Quelle, „Beleg geprüft“ ohne Fundstelle, Freigabe ohne geprüften Beleg.

## Arbeitsweise

1. Daten ändern.
2. `node --test test/kern.test.js`. Schlägt der Regressionstest an, zeigt er genau, was sich im Ergebnis geändert hat.
3. Ist die Änderung gewollt: `EINFRIEREN=1 node --test test/kern.test.js` friert das neue Ergebnis ein.

## Bekannte Grenzen dieser Version

- Alle Regeln stehen auf Freigabe „entwurf“. 16 haben einen geprüften Beleg.
- Aus den H-Sätzen werden bisher vier Eigenschaften abgeleitet: fruchtschädigend (H360, H361), entzündbar (H220 bis H228), sensibilisierend (H317, H334, EUH208), eingestuft. Weitere Gruppen folgen.
- Bewertung (Nohl), Leitmerkmalmethode und Berichte fehlen noch.
- Das Regelwerk selbst (PDF) liegt nicht im Repository, sondern im Projektordner `regelwerk/`. `quellen.json` verweist auf die Dateinamen dort.
- Die Übersetzung vom Protokoll in den Fall macht bisher Claude als Vorschlag; die Auswertung bleibt rein rechnerisch.
- Läuft mit Node.js ab Version 20, ohne weitere Pakete.

## Wo stehen wir, was kommt als Nächstes?

`LEITSTAND.md` zeigt es, erzeugt von `node lernen/leitstand.js`. Der Ablauf dahinter steht in `docs/05_Lernkreislauf.md`: finden (Runden mit erzeugten Protokollen), belegen (zwei unabhängige Prüfer mit wörtlichem Zitat), freigeben (Andre, über `freigabe/F<Nr>.md`).
