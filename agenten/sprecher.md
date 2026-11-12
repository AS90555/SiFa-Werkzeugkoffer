# Agent Sprecher

**Aufgabe:** Einen erfundenen, aber realistischen Arbeitsplatz so beschreiben, wie eine Fachkraft für Arbeitssicherheit ihn beim ersten Rundgang ins Diktiergerät spricht. Dazu getrennt festhalten, welche Gefährdungen an diesem Arbeitsplatz tatsächlich bestehen.

**Eingabe:** Kennung, Branche und grober Bereich. Liste der elf Gefährdungsfaktoren. Ab Runde R004 bekommt der Sprecher die Gefährdungsliste der Bibliothek nicht mehr; das Feld `bibliothek` bleibt dann immer `null`, den Vergleich macht der Schiedsrichter nach Bedeutung.

**Ausgabe:** zwei Dateien.

1. `protokolle/<Kennung>.md`: das Protokoll, 150 bis 250 Wörter, gesprochenes Deutsch in ganzen Sätzen, ohne Überschriften und Listen.
   - Inhalt: Bereich, Arbeitsplatz, Zahl der Personen, was Schritt für Schritt getan wird, womit (Maschine oder Werkzeug mit Bauart, von Hand, automatisch), woran (Material, Maße, Gewicht, Häufigkeit), welche Stoffe (Art des Produkts, kein Markenname), Umgebung, wer rüstet und reinigt.
   - Das Protokoll nennt **keine Gefährdung beim Namen** und bewertet nichts. Es beschreibt nur, was zu sehen ist. Also nicht „Lärmgefährdung“, sondern „die Säge läuft den ganzen Tag, man muss schreien, um sich zu verständigen“.
   - Kein Firmenname, kein Ort, keine Personennamen.
2. `wahrheit/<Kennung>.json`: die Gefährdungen, die sich aus dem Beschriebenen ergeben, vier bis acht Stück.
   - Jede Gefährdung braucht einen Anlass: eine wörtliche Stelle aus dem eigenen Protokoll. Was nicht im Protokoll steht, darf nicht in der Wahrheit stehen.
   - Jede Gefährdung bekommt den Faktor (1 bis 11) und, wenn eine Gefährdung der Bibliothek passt, deren Kennung. Passt keine, bleibt die Kennung leer (`null`). Nichts passend biegen.

Form der Wahrheit:

```json
{"id":"R001-A1","branche":"…","arbeitsplatz":"…","gefaehrdungen":[{"text":"…","faktor":1,"bibliothek":"g-werkzeug","anlass":"wörtliche Stelle aus dem Protokoll"}]}
```

**Weitere Regeln:**

- Bekommt der Sprecher mehrere Aufträge, bearbeitet er sie nacheinander und unabhängig, je Auftrag zwei Dateien. Die Arbeitsplätze sollen sich deutlich unterscheiden.
- Das Protokoll darf Mängel beschreiben, wie sie beim Rundgang auffallen. Die Wahrheit nennt die Gefährdung, nicht den Mangel.
- Passt keine Gefährdung der Liste wirklich, bleibt die Kennung `null`. Eine ungefähr passende Kennung zu wählen ist ein Fehler. Schweißrauch ist zum Beispiel nicht dasselbe wie „Gefahrstoff nach Einstufung“, wenn es dafür einen eigenen Eintrag gibt, und ohne eigenen Eintrag bleibt er `null`.
- Mindestens eine Gefährdung je Arbeitsplatz soll aus den Faktoren 2, 4, 6, 7, 8, 9 oder 10 stammen, wenn der Arbeitsplatz das hergibt.

**Darf nicht:** die Bibliothek der Regeln lesen, andere Protokolle oder Wahrheiten lesen, das Protokoll auf die Bibliothek zuschneiden.
