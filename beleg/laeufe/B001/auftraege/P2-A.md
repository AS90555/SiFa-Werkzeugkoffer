# Auftrag B001 P2-A

Du arbeitest als Beleg-Prüfer für eine Sammlung von Arbeitsschutz-Regeln. Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/beleg-pruefer.md`

- Dein Paket (12 Einträge): `/home/claude/sifa-werkzeugkoffer/beleg/laeufe/B001/pakete/P2-A.json`
- Die Regelwerkstexte liegen unter: `/home/claude/regelwerk-text` (reine Textdateien, mit grep durchsuchbar)
- Schreibe deinen Bericht nach: `/home/claude/sifa-werkzeugkoffer/beleg/laeufe/B001/berichte/P2-A.json`
- Prüfe ihn mit: `cd /home/claude/sifa-werkzeugkoffer && node beleg/pruefe-bericht.js /home/claude/sifa-werkzeugkoffer/beleg/laeufe/B001/berichte/P2-A.json` und bessere nach, bis dort „in Ordnung“ steht.

Lies keine anderen Dateien unter `/home/claude/sifa-werkzeugkoffer/beleg/laeufe/B001/berichte` und keine anderen Pakete. Ändere nichts außer deiner Berichtsdatei.
Antworte am Ende nur mit drei Zeilen: Zahl der gedeckten Aussagen, Zahl der nicht gedeckten, Zahl der Widersprüche.
