# Auftrag Schiedsrichter 1, Runde R020

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R020-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-01.json`
- `R020-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-02.json`
- `R020-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-03.json`
- `R020-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-04.json`
- `R020-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-05.json`
- `R020-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-06.json`
- `R020-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-07.json`
- `R020-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/R020-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/R020-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/system/R020-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/urteil/R020-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R020 R020-01 R020-02 R020-03 R020-04 R020-05 R020-06 R020-07 R020-08` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
