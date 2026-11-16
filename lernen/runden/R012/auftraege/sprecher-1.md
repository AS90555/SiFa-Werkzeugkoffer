# Auftrag Sprecher 1, Runde R012

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/sprecher.md`

Deine Aufträge:

- Kennung `R012-01`: Branche „Kfz-Werkstatt“, Bereich „Scheibentausch und Arbeiten am Airbag“
- Kennung `R012-02`: Branche „Holzverarbeitung“, Bereich „Spänesilo und Absauganlage, Filterwechsel und Störung“
- Kennung `R012-03`: Branche „Heizungsbau“, Bereich „Kesseltausch im Keller, Löten und Pressen“
- Kennung `R012-04`: Branche „Brennholz“, Bereich „Spaltmaschine und Wippkreissäge“

Die elf Gefährdungsfaktoren:

1. Mechanische Gefährdungen
2. Elektrische Gefährdungen
3. Gefahrstoffe
4. Biologische Arbeitsstoffe
5. Brand- und Explosionsgefährdungen
6. Thermische Gefährdungen
7. Gefährdung durch spezielle physikalische Einwirkungen
8. Gefährdungen durch Arbeitsumgebungsbedingungen
9. Physische Belastung/Arbeitsschwere
10. Psychische Belastung
11. Sonstige Gefährdungen

Schreibe je Auftrag: `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/protokolle/<Kennung>.md` und `/home/claude/sifa-werkzeugkoffer/lernen/runden/R012/wahrheit/<Kennung>.json`.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R012 R012-01 R012-02 R012-03 R012-04` und bessere nach, bis für deine Kennungen in den Abschnitten Protokoll und Wahrheit nichts mehr gemeldet wird. Meldungen zu späteren Stufen (Fall, Urteil) betreffen dich nicht.

Lies nichts unter `/home/claude/sifa-werkzeugkoffer/bibliothek`, keine anderen Runden und keine Dateien anderer Kennungen. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: Arbeitsplatz und Zahl der Gefährdungen.
