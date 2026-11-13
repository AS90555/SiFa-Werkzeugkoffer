# Auftrag Schiedsrichter, Runde R006

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R006-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-01.json`
- `R006-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-02.json`
- `R006-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-03.json`
- `R006-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-04.json`
- `R006-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-05.json`
- `R006-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-06.json`
- `R006-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-07.json`
- `R006-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/protokolle/R006-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/wahrheit/R006-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/system/R006-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R006/urteil/R006-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R006` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
