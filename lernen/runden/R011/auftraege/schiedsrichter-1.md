# Auftrag Schiedsrichter 1, Runde R011

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R011-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-01.json`
- `R011-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-02.json`
- `R011-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-03.json`
- `R011-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-04.json`
- `R011-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-05.json`
- `R011-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-06.json`
- `R011-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-07.json`
- `R011-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/protokolle/R011-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/wahrheit/R011-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/system/R011-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R011/urteil/R011-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R011 R011-01 R011-02 R011-03 R011-04 R011-05 R011-06 R011-07 R011-08` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
