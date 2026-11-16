# Auftrag Schiedsrichter 1, Runde R012

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R012-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-01.json`
- `R012-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-02.json`
- `R012-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-03.json`
- `R012-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-04.json`
- `R012-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-05.json`
- `R012-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-06.json`
- `R012-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-07.json`
- `R012-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/R012-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/R012-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/system/R012-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/urteil/R012-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R012 R012-01 R012-02 R012-03 R012-04 R012-05 R012-06 R012-07 R012-08` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
