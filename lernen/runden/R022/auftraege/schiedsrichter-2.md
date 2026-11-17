# Auftrag Schiedsrichter 2, Runde R022

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R022-09`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-09.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-09.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-09.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-09.json`
- `R022-10`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-10.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-10.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-10.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-10.json`
- `R022-11`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-11.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-11.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-11.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-11.json`
- `R022-12`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-12.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-12.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-12.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-12.json`
- `R022-13`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-13.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-13.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-13.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-13.json`
- `R022-14`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-14.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-14.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-14.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-14.json`
- `R022-15`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-15.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-15.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-15.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-15.json`
- `R022-16`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/protokolle/R022-16.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/wahrheit/R022-16.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/system/R022-16.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R022/urteil/R022-16.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R022 R022-09 R022-10 R022-11 R022-12 R022-13 R022-14 R022-15 R022-16` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
