# Mängel auswerten: Vorschlag zur Entscheidung

Stand: 13.11.2026, Entwurf. Gebaut wird erst, wenn Andre entschieden hat. Gehört zu Meilenstein 1 (Erkennen) und bereitet Meilenstein 3 (Ergebnis für den Kunden) vor.

## Der Befund

In den 24 Arbeitsplätzen der Runden R004 bis R006 hat der Übersetzer 116 Mängel getrennt erfasst. Die Auswertung rechnet bisher nur mit der Tätigkeit und übergeht sie. In R006 lag etwa die Hälfte der Fehlschläge genau dort.

Ein Mangel ist eine Beobachtung zum Ist-Zustand: etwas fehlt, ist defekt, verstellt, offen, wird nicht benutzt. Er beschreibt nicht, was an diesem Arbeitsplatz grundsätzlich gefährlich ist, sondern wo der Betrieb heute vom Soll abweicht.

## Wonach sich die 116 Mängel ordnen lassen

Von Hand durchgesehen, Zahlen gerundet:

| Art des Mangels | etwa | Beispiel aus den Protokollen |
| --- | --- | --- |
| Schutzeinrichtung oder Sicherung fehlt, ist defekt, offen oder umgangen | 20 | Schutzhaube offen, weil sie beim Einrichten im Weg ist |
| Stoff offen, unbeschriftet, falsch gelagert oder neben einer Zündquelle | 18 | Verdünnung im offenen Eimer neben der Spritzpistole |
| Boden und Wege nass, uneben, verstellt oder verschmutzt | 16 | Feuerlöscher hinten an der Wand, der Weg mit Kartons zugestellt |
| Schutzausrüstung fehlt, wird nicht getragen oder ist ungeeignet | 13 | Schutzbrille hängt im Schrank, beim Umfüllen trägt sie niemand |
| Arbeitsmittel beschädigt, abgenutzt oder defekt | 11 | Pfannengriff sitzt locker |
| Lüftung oder Absaugung unzureichend | 11 | Filter der Absaugung verschmutzt |
| Elektrische Leitung beschädigt, im Weg oder im Nassen | 7 | Kabelstrang lose über den Boden |
| Beleuchtung schwach, ausgefallen oder flackernd | 7 | Leuchten über den Gassen teilweise ausgefallen |
| Hilfsmittel fehlt oder wird nicht benutzt | 6 | Lifter steht im Flur, wird selten genutzt |
| Organisation: Prüfung, Reinigung, Notruf, Zeitdruck | 6 | Kein Funk und kein Empfang im Revier |
| Gefährliche Arbeitsweise oder Lage | 5 | Motorsäge ohne Kettenbremse am Rücken getragen |
| Einrichtung des Arbeitsplatzes passt nicht | 3 | Tisch zu niedrig eingestellt |

Zwölf Arten decken alles ab. Das ist eine kleine, feste Liste, kein offenes Feld.

## Der Vorschlag

**1. Der Zustand wird eine eigene Schicht der Stammdaten.** Neben Material, Vorgang, Ausführung und Umgebung gibt es die Mangelart. Der Übersetzer ordnet jede Beobachtung einer Art zu und nennt den Gegenstand (welche Schutzeinrichtung, welcher Stoff). Was er nicht zuordnen kann, bleibt wie bisher ein Wunsch.

**2. Jede Mangelart hat eigene Regeln, wie bei den Tätigkeiten.** Beispiel: „Schutzeinrichtung umgangen“ führt zur Gefährdung, vor der die Einrichtung schützt, und zur Maßnahme „Arbeitsmittel erst wieder benutzen, wenn die Schutzeinrichtung wirksam ist“. Das Programm rechnet das ohne KI. Die Rechtsgrundlagen (voraussichtlich Betriebssicherheitsverordnung, Arbeitsstättenverordnung, PSA-Benutzungsverordnung, Gefahrstoffverordnung, DGUV Vorschrift 1 und 3) laufen durch denselben Beleg-Lauf wie alle anderen Regeln.

**3. Wo eine Regel der Tätigkeit schon eine passende Maßnahme nennt, wird der Mangel daran gehängt.** Dann steht dort nicht nur „Gehörschutz tragen“, sondern „Gehörschutz tragen: vor Ort nicht erfüllt“. Das ist der Ist-Soll-Vergleich.

**4. Das Ergebnis trennt zwei Dinge.** Die Gefährdungsbeurteilung sagt, was an diesem Arbeitsplatz dauerhaft gilt. Die Mängelliste sagt, was heute abweicht und abzustellen ist. Aus der Mängelliste wird später der Maßnahmenplan für den Kunden.

**5. Nie raten gilt weiter.** Sagt das Protokoll nur „Schutzbrille hängt im Schrank“, ist das kein Mangel. Erst „wird nicht getragen“ ist einer.

## Was das bringt und was nicht

- Das System nennt, was dir beim Rundgang auffällt, und nicht nur, was die Tätigkeit erwarten lässt.
- Es entsteht der Rohstoff für Begehungsprotokoll und Maßnahmenplan.
- Es bringt nichts bei Mängeln, die niemand ausspricht. Was im Protokoll nicht steht, kennt das System nicht.
- Die Zuordnung zur Mangelart macht eine KI als Vorschlag. Sie kann danebenliegen; deshalb bleibt der Wortlaut der Beobachtung immer sichtbar.

## Was Andre entscheiden muss

1. **Dringlichkeit:** Soll das System je Mangel eine Stufe vorschlagen (sofort abstellen, kurzfristig, einplanen)? Wenn ja, nach welcher Faustregel? Vorschlag: Schutzeinrichtung umgangen und beschädigte Elektrik sofort, alles andere kurzfristig, bis du es änderst.
2. **Verhalten:** „Wird nicht getragen“ ist ein Mangel am Verhalten. Soll das System daraus zusätzlich eine Frage an die Organisation machen (Unterweisung, Aufsicht, Eignung der Ausrüstung)?
3. **Maßnahmenplan:** Soll aus jedem Mangel gleich eine Zeile werden mit Was, Wer, Bis wann, Wirksam geprüft? Oder erst in Meilenstein 3?
4. **Ansage beim Diktieren:** Reicht es, wenn du Mängel einfach mit erzählst, oder willst du ein Ansagewort („Mangel:“) für den Spickzettel?
5. **Zwölf Arten:** Fehlt dir eine Art, die du aus der Praxis kennst? Zum Beispiel fehlende Unterweisung, fehlende Prüfplakette, fehlende Betriebsanweisung.

## Aufwand

Stammdaten und Kern erweitern, Übersetzer anpassen, zwölf bis zwanzig Regeln als Entwurf, Tests. Danach ein Beleg-Lauf für die neuen Regeln und die drei Skills nachziehen. Erst dann die nächste Lernrunde.
