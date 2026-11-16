# Auftrag Schiedsrichter 2, Runde R013

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R013-09`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-09.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-09.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-09.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-09.json`
- `R013-10`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-10.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-10.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-10.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-10.json`
- `R013-11`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-11.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-11.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-11.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-11.json`
- `R013-12`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-12.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-12.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-12.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-12.json`
- `R013-13`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-13.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-13.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-13.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-13.json`
- `R013-14`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-14.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-14.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-14.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-14.json`
- `R013-15`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-15.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-15.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-15.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-15.json`
- `R013-16`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/protokolle/R013-16.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/wahrheit/R013-16.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/system/R013-16.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/E013/urteil/R013-16.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen E013 R013-09 R013-10 R013-11 R013-12 R013-13 R013-14 R013-15 R013-16` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
