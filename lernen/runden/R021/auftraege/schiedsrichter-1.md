# Auftrag Schiedsrichter 1, Runde R021

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R021-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-01.json`
- `R021-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-02.json`
- `R021-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-03.json`
- `R021-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-04.json`
- `R021-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-05.json`
- `R021-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-06.json`
- `R021-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-07.json`
- `R021-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/protokolle/R021-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/wahrheit/R021-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/system/R021-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R021/urteil/R021-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R021 R021-01 R021-02 R021-03 R021-04 R021-05 R021-06 R021-07 R021-08` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
