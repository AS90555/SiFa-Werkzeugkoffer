# Auftrag Sprecher 1, Runde R020

Lies zuerst deine Arbeitsanweisung vollständig: `/home/claude/sifa-werkzeugkoffer/agenten/sprecher.md`

Deine Aufträge:

- Kennung `R020-01`: Branche „Leiterplattenfertigung“, Bereich „Ätzen und Galvanik“
- Kennung `R020-02`: Branche „Kfz-Werkstatt“, Bereich „Hochvoltsystem eines Elektrofahrzeugs freischalten“
- Kennung `R020-03`: Branche „Gießerei“, Bereich „Schmelzbetrieb am Induktionsofen“
- Kennung `R020-04`: Branche „Plattenwerk“, Bereich „Instandhaltung an der Kontipresse“

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

Schreibe je Auftrag: `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/protokolle/<Kennung>.md` und `/home/claude/sifa-werkzeugkoffer/lernen/runden/R020/wahrheit/<Kennung>.json`.
Prüfe zum Schluss mit: `cd /home/claude/sifa-werkzeugkoffer && node lernen/runde.js pruefen R020 R020-01 R020-02 R020-03 R020-04` und bessere nach, bis für deine Kennungen in den Abschnitten Protokoll und Wahrheit nichts mehr gemeldet wird. Meldungen zu späteren Stufen (Fall, Urteil) betreffen dich nicht.

Lies nichts unter `/home/claude/sifa-werkzeugkoffer/bibliothek`, keine anderen Runden und keine Dateien anderer Kennungen. Benutze nur: Dateien lesen, Dateien schreiben und die hier genannten Befehle. Kein Internet, keine Erinnerungen oder geplanten Aufgaben, keine weiteren Agenten. Antworte am Ende nur mit einer Zeile je Kennung: Arbeitsplatz und Zahl der Gefährdungen.
