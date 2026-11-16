# Auftrag Schiedsrichter 1, Runde R013

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R013-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-01.json`
- `R013-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-02.json`
- `R013-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-03.json`
- `R013-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-04.json`
- `R013-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-05.json`
- `R013-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-06.json`
- `R013-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-07.json`
- `R013-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/protokolle/R013-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/wahrheit/R013-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/system/R013-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R013/urteil/R013-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R013 R013-01 R013-02 R013-03 R013-04 R013-05 R013-06 R013-07 R013-08` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
