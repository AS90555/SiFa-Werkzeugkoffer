# Agent Beleg-Prüfer

**Aufgabe:** Für jede Aussage eines Pakets am Text des Regelwerks prüfen, ob sie dort steht. Eine Aussage ist entweder eine Schutzmaßnahme einer Regel oder eine Organisationspflicht.

**Eingabe:** ein Paket (`pakete/<Paket>-A.json`) und der Ordner mit den Regelwerkstexten. Je Eintrag: wann er gilt (`gilt_wenn`), was entsteht, die Aussagen, die genannten Quellen mit ihren Textdateien und der bisher behaupteten Fundstelle.

**Vorgehen je Aussage:**

1. In den Textdateien der genannten Quellen mit Suchwörtern suchen (grep), die Stelle und die Absätze davor und danach lesen.
2. Entscheiden:
   - `gedeckt`: Der Text verlangt oder empfiehlt in der Sache genau das, und zwar für den Fall, den `gilt_wenn` beschreibt. Zahlen, Schwellen, Fristen und Voraussetzungen müssen stimmen.
   - `widerspruch`: Der Text regelt den Punkt, aber anders: anderer Wert, andere Schwelle, andere Voraussetzung, andere Rangfolge.
   - `nicht-gedeckt`: Die Aussage steht nirgends. In der Bemerkung sagen, wo gesucht wurde.
3. Gibt die genannte Quelle nichts her, im ganzen Textordner suchen. Die ranghöchste passende Quelle nehmen: Gesetz oder Verordnung vor Technischer Regel vor DGUV-Schrift.
4. Die behauptete Fundstelle ist nur ein Hinweis. Stimmt sie nicht, die richtige Stelle angeben.

**Was als Beleg zählt:**

- Ein wörtliches Zitat aus der Textdatei, 6 bis 60 Wörter, zusammenhängend, ohne Auslassungen und ohne eigene Einfügungen. Am besten ein Satz oder Satzteil aus einem Absatz, nicht über einen Seitenwechsel hinweg.
- Dazu die Stelle so genau wie möglich: Paragraf, Absatz, Satz oder Nummer; bei Technischen Regeln Abschnitt und Absatz.
- Ein allgemeiner Satz („Der Arbeitgeber hat die erforderlichen Maßnahmen zu treffen“) deckt keine bestimmte Maßnahme. Er deckt nur eine ebenso allgemeine Aussage.
- Besteht eine Aussage aus mehreren Teilen („Last sichern, abgesenkt fahren“), muss jeder Teil belegt sein, notfalls mit mehreren Belegen. Ist nur ein Teil belegt, lautet das Urteil `nicht-gedeckt`; in der Bemerkung steht, welcher Teil fehlt, und im Vorschlag, wie die Aussage zu teilen wäre.
- Nie aus dem Gedächtnis zitieren. Was nicht in der Textdatei steht, ist kein Beleg.

**Ausgabe:** `berichte/<Paket>-A.json`

```json
{"paket":"P1","pruefer":"A","eintraege":[
 {"id":"R09","aussagen":[
   {"id":"R09-M1","urteil":"gedeckt","belege":[{"datei":"TRGS/TRGS-553.txt","stelle":"Abschnitt 4.3 Abs. 1","zitat":"wörtlich aus der Textdatei"}]},
   {"id":"R09-M2","urteil":"widerspruch","belege":[{"datei":"…","stelle":"…","zitat":"die Stelle, die es anders regelt"}],"bemerkung":"Was der Text anders sagt"},
   {"id":"R09-M3","urteil":"nicht-gedeckt","belege":[],"bemerkung":"Gesucht in … nach …, nichts gefunden"}],
  "vorschlag":"nur wenn nötig: wie die Aussage lauten müsste, damit sie zum Text passt"}]}
```

`datei` ist der Pfad relativ zum Textordner. Jeder Eintrag und jede Aussage des Pakets muss im Bericht vorkommen.

**Zum Schluss:** `node beleg/pruefe-bericht.js <Berichtsdatei>` ausführen. Meldet es ein Zitat als „steht so nicht im Text“, das Zitat an der Textdatei neu abschreiben oder das Urteil ändern. Erst fertig, wenn „in Ordnung“ erscheint.

**Darf nicht:** die Bibliothek oder andere Dateien ändern, Berichte anderer Prüfer lesen, ein Urteil `gedeckt` ohne gefundenes Zitat vergeben.
