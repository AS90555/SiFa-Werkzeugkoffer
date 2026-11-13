# Der Kreislauf: finden, belegen, freigeben

Stand: 12.11.2026. Wie das System von selbst besser wird und trotzdem nur gilt, was im Regelwerk steht und Andre freigegeben hat. Gehört zu Meilenstein 1 und 2 der Roadmap. Den aktuellen Stand zeigt immer `LEITSTAND.md`.

## Was Trainieren bedeutet

Trainiert wird nicht die KI, sondern die Bibliothek: Wörterbuch, Stammdaten und Regeln, die ein festes Programm durchrechnet. Eine Trainingsrunde zeigt dem System Arbeitsplätze, stellt fest, was es übersieht oder ohne Anlass behauptet, und trägt das Fehlende ein. Zwischen den Runden lernt das System nichts von selbst; jede Änderung ist sichtbar und rückgängig zu machen. Belegen und Freigeben sind kein Training: Training macht vollständiger, gültig wird eine Regel durch Regelwerk und Freigabe.

| Festlegung | Inhalt |
| --- | --- |
| Feld | Betriebe der BGHM, gegliedert nach den zehn Gefahrtarifstellen (`lernen/abdeckung.json`, `feld: bghm`) |
| Rhythmus | zwei Lernrunden mit acht Arbeitsplätzen, dann eine Prüfrunde mit sechzehn |
| Messwert | nur die Prüfrunde; bei sechzehn Plätzen schwankt die Quote noch um etwa zehn Punkte, deshalb zählen zwei Prüfrunden hintereinander |
| Ziel | zweimal hintereinander mindestens 80 %, dazu sinkende Zahl der Funde ohne Anlass |
| Gegenprobe | Andres eigene Protokolle |
| Stopp | fällt die Quote einer Prüfrunde im Feld gegenüber der letzten, erst die Ursache klären |

Die Runden R004 bis R006 lagen bewusst außerhalb des Feldes (Erkundung). Sie werden nicht mit den Runden im Feld verglichen.

## Drei Schleifen

| Schleife | Frage | Wer arbeitet | Ergebnis |
| --- | --- | --- | --- |
| **Finden** (Runden) | Erkennt das System, was an einem fremden Arbeitsplatz gefährlich ist? | Sprecher, Übersetzer, Kern, Schiedsrichter | Trefferquote und Liste der Lücken |
| **Belegen** (Beleg-Läufe) | Steht jede Maßnahme wirklich im Regelwerk? | Prüfer und Gegenprüfer, Zitat-Kontrolle durch das Programm | Regel doppelt belegt oder zurück an die Werkbank |
| **Freigeben** (Pakete) | Würde ich das einem Kunden so sagen? | Andre | Regel gilt |

**Die Grenze:** Das System lernt von selbst, was ihm fehlt. Es entscheidet nicht von selbst, was gilt. Eine Regel gilt erst, wenn zwei unabhängige Prüfer sie mit wörtlichem Zitat belegt haben und Andre sie freigegeben hat. Wird sie danach geändert, verfallen Beleg und Freigabe von selbst (Fingerabdruck).

## Der Leitstand

`node lernen/leitstand.js` liest den ganzen Stand und schreibt `LEITSTAND.md`: was als Nächstes fällig ist, was auf Andre wartet, Kennzahlen, Runden, Beleg-Läufe. Jede Arbeitssitzung beginnt dort. So muss niemand im Kopf behalten, wo wir stehen.

Reihenfolge, nach der der Leitstand entscheidet:

1. Bibliothek fehlerhaft: reparieren.
2. Angefangenes zu Ende bringen: offener Beleg-Lauf, offene Runde, offene Lücken.
3. Stopp-Regel Belege: Sind weniger als ein Viertel der Regeln doppelt belegt, kommt ein Beleg-Lauf vor der nächsten Lernrunde.
4. Stopp-Regel Quote: Fällt die Quote einer Prüfrunde gegenüber der letzten vergleichbaren, wird erst die Ursache gesucht.
5. Reife Regeln als Freigabe-Paket an Andre.
6. Sonst: neue Prüfrunde.

## Schleife Finden

| Schritt | Befehl oder Agent | Wer sieht was |
| --- | --- | --- |
| Runde anlegen | `node lernen/runde.js neu pruef` | Das Programm wählt acht Aufträge aus `lernen/abdeckung.json`: schwache und selten geprüfte Faktoren zuerst, Branchen gemischt. Es schreibt fertige Aufträge nach `lernen/runden/<Runde>/auftraege/`. |
| Sprecher (2 Läufe, kleinstes Modell) | Auftrag `sprecher-1.md`, `sprecher-2.md` | Kennt nur Branche, Bereich und die elf Faktoren. Kennt die Bibliothek nicht. Schreibt Protokoll und verdeckte Wahrheit in eigenen Worten. |
| Übersetzer (2 Läufe) | Auftrag `uebersetzer-1.md`, `uebersetzer-2.md` | Kennt nur Protokoll, Stammdaten, Wörterbuch. Kennt weder Wahrheit noch Regeln. |
| Rechnen | `node lernen/runde.js system <Runde>` | Programm, ohne KI. |
| Schiedsrichter (je acht Plätze ein Lauf) | Auftrag `schiedsrichter-1.md`, bei Prüfrunden auch `schiedsrichter-2.md` | Vergleicht nach Bedeutung: getroffen, Rückfrage, verfehlt, unbegründet; Zusatzfunde berechtigt oder nicht. |
| Auswerten | `node lernen/runde.js auswerten <Runde>` | Bericht, Verlauf, Faktor-Statistik. |
| Lücken schließen | Leitung | Wörterbuch, dann Stammdaten, dann Regeln als Entwurf mit offenem Beleg. Danach `node lernen/runde.js geschlossen <Runde>`. |

Nach jeder Stufe: `node lernen/runde.js pruefen <Runde>`. Das Programm prüft Wortzahl, Form, ob jeder Anlass wörtlich im Protokoll steht, ob jeder Fall gültig ist und ob das Urteil vollständig ist. Agenten prüfen ihre Arbeit damit selbst.

**Lernrunde und Prüfrunde:** In einer Lernrunde werden die Lücken geschlossen. Als Messwert zählt nur eine Prüfrunde mit neuen Protokollen, an denen vorher nichts nachgebessert wurde.

**Vergleichbarkeit:** Bis R003 kannte der Sprecher die Gefährdungsliste der Bibliothek, die Quoten waren deshalb zu hoch. Seit R004 ist er blind. R004 ist der neue Ausgangswert.

## Schleife Belegen

| Schritt | Befehl oder Agent |
| --- | --- |
| Lauf zusammenstellen | `node beleg/vorbereiten.js`: die meistgenutzten, noch nicht doppelt belegten Regeln und Pflichten, in Paketen mit Aufträgen. |
| Prüfer (A) | bekommt die bisher behauptete Fundstelle als Hinweis. |
| Gegenprüfer (B) | bekommt keine Fundstelle, kennt den Bericht von A nicht, sucht Gründe dagegen. |
| Selbstkontrolle | `node beleg/pruefe-bericht.js <Bericht>`: Jedes Zitat muss wörtlich im Text stehen. |
| Zusammenführen | `node beleg/zusammenfuehren.js <Lauf>`, ansehen, dann mit `--uebernehmen`. |

Eine Aussage gilt als belegt, wenn A und B unabhängig ein Zitat liefern, das wörtlich im abgelegten Regelwerkstext steht. Eine Regel wird nur dann `geprueft`, wenn alle ihre Maßnahmen so belegt sind. Findet ein Prüfer einen Widerspruch zum Text, ist die Regel strittig und geht zurück an die Werkbank. Früher nur einfach geprüfte Regeln, die die Gegenprüfung nicht bestehen, fallen auf `offen` zurück.

Maßnahmen ohne Fundstelle werden gestrichen, umformuliert oder von Andre als Erfahrungswissen gekennzeichnet (`grundlage: erfahrung`). Sie erscheinen dann offen als Empfehlung der Fachkraft, nicht als Vorschrift.

Die Regelwerkstexte liegen außerhalb des Repositorys (Umgebungsvariable `REGELWERK_TEXT`, sonst der Nachbarordner `regelwerk-text`). Sie entstehen aus den PDF-Dateien im Regelwerk-Ordner auf Andres Rechner.

## Schleife Freigeben

`node freigabe/paket.js` schreibt `freigabe/F<Nr>.md`: je Regel die Bedingung in Worten, die Gefährdung, jede Maßnahme mit beiden Zitaten. Andre antwortet im Gespräch. Erst dann trägt `node freigabe/setzen.js F<Nr> --von Andre` die Freigabe ein. Niemand sonst setzt eine Freigabe.

## Bekannte Schwächen und Gegenmittel

| Schwäche | Gegenmittel |
| --- | --- |
| Die Wahrheit stammt von einer KI und kann falsch sein. | Sie dient nur zum Finden von Lücken. Der Schiedsrichter darf sie als unbegründet verwerfen. Gültig wird eine Regel durch Regelwerk und Freigabe. |
| Sprecher und Bibliothek haben dieselben blinden Flecken. | Blinder Sprecher; Andres eigene Protokolle bleiben der Maßstab. |
| Zwei Prüfer derselben Bauart können denselben Fehler machen. | Der zweite sucht ohne Fundstelle und mit Gegenauftrag; das Programm prüft jedes Zitat wörtlich; am Ende entscheidet Andre. |
| Überanpassung an erzeugte Protokolle. | Prüfrunden ohne Nachbesserung, eingefrorene Testfälle, echte Protokolle als Gegenprobe. |
| Agenten tun mehr als verlangt. | Aufträge nennen erlaubte Werkzeuge und Dateien; die Programme prüfen das Ergebnis, nicht der Agent. |

## Kosten

Eine Lernrunde braucht fünf Agentenläufe (zwei kleine Sprecher, zwei Übersetzer, ein Schiedsrichter), eine Prüfrunde mit sechzehn Plätzen zehn, ein Beleg-Lauf mit zwei Paketen vier. Rechnen, Prüfen, Auswählen und Zusammenführen macht das Programm ohne KI.
