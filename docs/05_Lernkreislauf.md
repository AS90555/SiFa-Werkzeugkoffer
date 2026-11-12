# Der Lernkreislauf

Stand: 12.11.2026. Wie das System mit erzeugten Protokollen wächst und wie das gesteuert wird. Gehört zu Meilenstein 1 und 2 der Roadmap.

## Die Idee

Agenten erfinden Arbeitsplätze, sprechen sie als Rundgangsprotokoll ein und halten verdeckt fest, welche Gefährdungen dort bestehen. Ein zweiter Agent übersetzt nur das Protokoll. Der Kern rechnet. Ein Programm vergleicht das Ergebnis mit der verdeckten Wahrheit. Aus den Abweichungen entstehen Vorschläge für die Bibliothek.

## Die Rollen

| Rolle | Wer | Sieht | Liefert |
| --- | --- | --- | --- |
| Planer | Claude als Leitung | Abdeckung der bisherigen Runden | Aufträge: Kennung, Branche, Bereich. Keine Inhalte. |
| Sprecher | kleiner, günstiger Agent | Auftrag, Liste der Gefährdungen und Faktoren | Protokoll und verdeckte Wahrheit |
| Übersetzer | Agent | nur das Protokoll, Stammdaten, Wörterbuch | Fall und Wünsche |
| Kern | Programm | Fall, Bibliothek | Gefährdungen und Maßnahmen |
| Auswerter | Programm `lernen/auswerten.js` | Fall, Ergebnis, Wahrheit | Bericht mit Trefferquote und Lücken |
| Schiedsrichter | Agent | Protokoll, Wahrheit, Liste des Systems | Urteil nach Bedeutung: getroffen, Rückfrage, verfehlt; Zusatzfunde berechtigt oder unbegründet |
| Lücken-Schließer | Claude, später eigener Agent | Bericht | Vorschläge: Wörterbuch, Stammdaten, Regeln im Entwurf |
| Beleg-Prüfer und Gegenprüfer | Agenten | Regelvorschlag, Regelwerkstext | Prüfberichte |
| Freigabe | Andre | Regel, Berichte | Freigabe oder Ablehnung |

Der Sprecher kennt die Regeln nicht. Der Übersetzer kennt weder die Wahrheit noch die Regeln. Die Leitung liest die Wahrheit erst, wenn die Übersetzung fertig ist.

## Zwei Arten von Runden

- **Lernrunde:** Nach der Auswertung werden die Lücken geschlossen. Die Protokolle werden danach feste Testfälle.
- **Prüfrunde:** Neue Protokolle, an denen vorher nichts nachgebessert wurde. Nur ihre Trefferquote zählt als Messwert. Auf jede Lernrunde folgt eine Prüfrunde.

So wird nicht gemessen, wie gut das System Bekanntes wiedergibt, sondern wie gut es Neues trifft.

## Was die Bibliothek aus einer Runde lernen darf

| Art der Lücke | Wer schließt sie | Braucht Freigabe |
| --- | --- | --- |
| Wort fehlt im Wörterbuch | Lücken-Schließer | nein |
| Stammdatum fehlt (Material, Vorgang, Ausführung, Umgebung) | Lücken-Schließer | nein, aber im Lernbuch vermerkt |
| Regel löst nicht aus, obwohl sie passt | Lücken-Schließer ändert die Bedingung | ja, Regel fällt auf Entwurf zurück |
| Gefährdung oder Regel fehlt ganz | Lücken-Schließer schlägt vor, mit offenem Beleg | ja, nach Beleg-Prüfung |

**Die Grenze:** Das System lernt von selbst, was ihm fehlt. Es entscheidet nicht von selbst, was gilt. Eine Regel wird nur durch den Beleg am Regelwerk und Andres Freigabe gültig.

## Bekannte Schwächen und Gegenmittel

| Schwäche | Gegenmittel |
| --- | --- |
| Die Wahrheit stammt selbst von einer KI und kann falsch oder unvollständig sein. | Sie dient nur zum Finden von Lücken. Gültig wird eine Regel durch das Regelwerk. Andre sieht je Runde eine Stichprobe der Wahrheiten durch. |
| Sprecher und Bibliothek haben dieselben blinden Flecken. | Andres eigene Protokolle bleiben der Maßstab. Etwa jedes fünfte Protokoll kommt von ihm. |
| Der Sprecher sah bis Runde R003 die Gefährdungsliste der Bibliothek und wählte bevorzugt daraus. Je größer die Liste, desto leichter der Treffer. | Ab Runde R004 sieht der Sprecher nur noch die elf Faktoren und beschreibt Gefährdungen frei. Den Vergleich macht der Schiedsrichter. Die Quoten bis R003 sind deshalb eher zu hoch. |
| Protokolle beschreiben auch Mängel (fehlendes Schloss, lockerer Stecker). Das ist Ist-Zustand, keine Gefährdung aus der Tätigkeit. | Das System muss die Gefährdung finden; der Mangel gehört in die Bewertung „Maßnahme fehlt“. Der Übersetzer soll Mängel künftig getrennt notieren. |
| Überanpassung an erzeugte Protokolle. | Prüfrunden ohne Nachbesserung; Regressionstests; echte Protokolle als Gegenprobe. |

## Steuerung

- **Abdeckungsplan:** Die Leitung wählt Aufträge so, dass Branchen, Vorgänge, Stoffarten und alle elf Gefährdungsfaktoren abgedeckt werden. Schwerpunkt jeder Runde sind die schwächsten Faktoren der letzten.
- **Rundengröße:** sechs bis zehn Arbeitsplätze.
- **Ablage:** `lernen/runden/<Nummer>/` mit `protokolle/`, `wahrheit/`, `faelle/`, `bericht.md`, `ergebnis.json`.
- **Lernbuch:** je Runde Trefferquote, Art der Runde, wichtigste Lücken, Änderungen.
- **Kosten:** Jeder Agentenlauf hat einen festen Grundverbrauch. Deshalb erzeugt ein Sprecher künftig mehrere Arbeitsplätze in einem Lauf und ein Übersetzer bearbeitet mehrere Protokolle.
- **Stopp-Regel:** Sinkt die Trefferquote einer Prüfrunde gegenüber der letzten, wird nicht weiter gefüttert, sondern erst die Ursache gesucht.

## Stand

Runden R001 bis R003 sind ausgewertet, siehe die Berichte unter `lernen/runden/` und das Lernbuch.
