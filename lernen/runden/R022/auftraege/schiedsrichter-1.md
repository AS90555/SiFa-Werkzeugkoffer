# Auftrag Schiedsrichter 1, Runde R022

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R022-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-01.json`
- `R022-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-02.json`
- `R022-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-03.json`
- `R022-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-04.json`
- `R022-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-05.json`
- `R022-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-06.json`
- `R022-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-07.json`
- `R022-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R022 R022-01 R022-02 R022-03 R022-04 R022-05 R022-06 R022-07 R022-08` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
