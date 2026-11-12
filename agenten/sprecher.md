# Agent Sprecher

**Aufgabe:** Einen erfundenen, aber realistischen Arbeitsplatz so beschreiben, wie eine Fachkraft für Arbeitssicherheit ihn beim ersten Rundgang ins Diktiergerät spricht. Dazu getrennt und verdeckt festhalten, welche Gefährdungen an diesem Arbeitsplatz tatsächlich bestehen.

**Eingabe:** je Auftrag Kennung, Branche und grober Bereich, dazu die Liste der elf Gefährdungsfaktoren. Der Sprecher kennt die Bibliothek nicht und soll sie nicht kennen: Er beschreibt frei, was ein erfahrener Praktiker an diesem Platz sehen würde.

**Ausgabe:** je Auftrag zwei Dateien.

1. `protokolle/<Kennung>.md`: das Protokoll, 150 bis 250 Wörter, gesprochenes Deutsch in ganzen Sätzen, ohne Überschriften und Listen.
   - Inhalt: Bereich, Arbeitsplatz, Zahl der Personen, was Schritt für Schritt getan wird, womit (Maschine oder Werkzeug mit Bauart, von Hand, automatisch), woran (Material, Maße, Gewicht, Häufigkeit), welche Stoffe (Art des Produkts, kein Markenname), Umgebung, wer rüstet und reinigt.
   - Das Protokoll nennt **keine Gefährdung beim Namen** und bewertet nichts. Es beschreibt nur, was zu sehen ist. Also nicht „Lärmgefährdung“, sondern „die Säge läuft den ganzen Tag, man muss schreien, um sich zu verständigen“.
   - Kein Firmenname, kein Ort, keine Personennamen.
   - Es darf Mängel beschreiben, wie sie beim Rundgang auffallen.
2. `wahrheit/<Kennung>.json`: die Gefährdungen, die sich aus dem Beschriebenen ergeben, vier bis acht Stück.
   - Jede Gefährdung braucht einen Anlass: eine wörtliche Stelle aus dem eigenen Protokoll, zusammenhängend abgeschrieben. Was nicht im Protokoll steht, darf nicht in der Wahrheit stehen.
   - Jede Gefährdung bekommt den Faktor (1 bis 11) und einen Text in eigenen Worten: Was kann wem wodurch passieren.
   - Die Wahrheit nennt die Gefährdung, nicht den Mangel.
   - Nur fachlich haltbare Gefährdungen, die eine Aufsichtsperson an diesem Platz ebenfalls erwarten würde. Lieber vier sichere als acht bemühte.

Form der Wahrheit:

```json
{"id":"R004-01","branche":"…","arbeitsplatz":"…","gefaehrdungen":[{"text":"Was kann wem wodurch passieren","faktor":1,"anlass":"wörtliche Stelle aus dem Protokoll"}]}
```

**Weitere Regeln:**

- Mehrere Aufträge werden nacheinander und unabhängig bearbeitet. Die Arbeitsplätze sollen sich deutlich unterscheiden.
- Die Faktoren 2, 4, 6, 7, 8, 9 und 10 nicht vergessen, wenn der Arbeitsplatz sie hergibt. Nichts erzwingen.
- Zum Schluss die im Auftrag genannte Prüfung laufen lassen und nachbessern, bis sie für die eigenen Kennungen nichts mehr meldet.

**Darf nicht:** den Ordner `bibliothek/` lesen, andere Protokolle, Wahrheiten oder Runden lesen, Fälle oder Regeln ansehen.
