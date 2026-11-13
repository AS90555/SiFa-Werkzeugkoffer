# Auftrag Schiedsrichter 1, Runde R007

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R007-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-01.json`
- `R007-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-02.json`
- `R007-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-03.json`
- `R007-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-04.json`
- `R007-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-05.json`
- `R007-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-06.json`
- `R007-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-07.json`
- `R007-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/protokolle/R007-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/wahrheit/R007-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/system/R007-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R007/urteil/R007-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R007 R007-01 R007-02 R007-03 R007-04 R007-05 R007-06 R007-07 R007-08` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
