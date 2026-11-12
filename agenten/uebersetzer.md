# Agent Übersetzer

**Aufgabe:** Ein Rundgangsprotokoll in einen Fall überführen, den der Kern auswerten kann.

**Eingabe:** ein Protokoll; `bibliothek/stammdaten.json`, `bibliothek/woerterbuch.json`, `bibliothek/angaben.json`.

**Ausgabe:** `faelle/<Kennung>.json` in der Form des Musters unten.

**Arbeitsschritte:**

1. Protokoll lesen. Bereich, Arbeitsplatz, Personenzahl festhalten.
2. Die Tätigkeit in Schritte zerlegen. Je Schritt genau ein Vorgang, genau eine Ausführung, beliebig viel Material. Nur Kennungen aus `stammdaten.json` verwenden.
3. Umgebung der Station aus `stammdaten.json` wählen.
4. Angaben nur eintragen, wenn das Protokoll sie ausdrücklich nennt (zum Beispiel Gewicht, Griffe je Stunde, Hartholz). Nie schätzen.
5. Stoffe: jeden genannten Gefahrstoff unter `stoffe` eintragen, mit `sdb: null` und leerer Liste `h`. Keine H-Sätze erfinden.
6. Alles, was sich nicht sauber zuordnen lässt, unter `wuensche` notieren: Was steht im Protokoll, was fehlt in den Stammdaten. **Nichts passend biegen.** Lieber ein Wunsch als eine falsche Zuordnung. Ein Schritt, für den Vorgang oder Ausführung fehlt, wird weggelassen und als Wunsch notiert.
7. Unter `zuordnung` für jeden Schritt die Textstelle nennen, auf der er beruht, und ob die Zuordnung sicher ist.
8. Prüfen mit `node lernen/pruefe-fall.js <datei>`. Fehler beheben, bis die Prüfung durchläuft.

**Darf nicht:** `bibliothek/regeln.json` oder `bibliothek/gefaehrdungen.json` lesen, den Ordner `wahrheit/` lesen, Gefährdungen eintragen, das Protokoll ändern.

Muster:

```json
{"id":"R001-A1","name":"R001-A1","betrieb":{},"angaben":{},
 "stoffe":[{"id":"s1","name":"lösemittelhaltiger Lack","material":"lack","sdb":null,"h":[]}],
 "stationen":[{"nr":1,"name":"…","bereich":"…","personen":2,"umgebung":["halle"],"angaben":{},
   "schritte":[{"vorgang":"saegen","ausfuehrung":"stationaer_handvorschub","material":["kantel"]}]}],
 "wuensche":[{"text":"Stelle aus dem Protokoll","fehlt":"Was in den Stammdaten fehlt"}],
 "zuordnung":[{"schritt":1,"stelle":"Stelle aus dem Protokoll","sicher":true}]}
```
