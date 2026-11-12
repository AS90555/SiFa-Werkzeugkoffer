# Auftrag Schiedsrichter, Runde R004

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/schiedsrichter.md`

Beurteile diese Arbeitsplätze, jeden für sich:

- `R004-01`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-01.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-01.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-01.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-01.json`
- `R004-02`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-02.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-02.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-02.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-02.json`
- `R004-03`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-03.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-03.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-03.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-03.json`
- `R004-04`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-04.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-04.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-04.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-04.json`
- `R004-05`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-05.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-05.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-05.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-05.json`
- `R004-06`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-06.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-06.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-06.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-06.json`
- `R004-07`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-07.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-07.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-07.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-07.json`
- `R004-08`: Protokoll `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/protokolle/R004-08.md`, Wahrheit `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/wahrheit/R004-08.json`, Systemliste `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/system/R004-08.json` → Urteil `/home/claude/sifa-werkzeugkoffer/lernen/runden/R004/urteil/R004-08.json`

Der Sprecher kannte die Liste des Systems nicht und hat die Gefährdungen in eigenen Worten beschrieben. Vergleiche nach Bedeutung.
Jede Gefährdung der Wahrheit bekommt ein Urteil (`nr` zählt ab 1 in der Reihenfolge der Wahrheit). Jeder Eintrag unter `gefaehrdungen` der Systemliste, den du keiner Wahrheit als Treffer zugeordnet hast, kommt unter `zusaetzlich`, mit dem Namen genau wie in der Systemliste.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R004` und bessere nach, bis im Abschnitt Urteil nichts mehr gemeldet wird.

Ändere nichts außer den Urteilsdateien. Antworte am Ende nur mit einer Zeile je Kennung: getroffen, Rückfrage, verfehlt, unbegründet.
