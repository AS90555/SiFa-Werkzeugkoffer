# Pflichtenheft

Stand: 12.11.2026. Wie der SiFa-Werkzeugkoffer die Anforderungen des Lastenhefts umsetzt. In Klammern stehen die Nummern aus dem Lastenheft.

## 1 Aufbau in Schichten

| Schicht | Aufgabe | Ort | Stand |
| --- | --- | --- | --- |
| 1 Regelwerk | Gesetze, Verordnungen, Technische Regeln, DGUV-Schriften als Dateien mit Ausgabestand | Projektordner `regelwerk/`, nicht im Repository | vorhanden |
| 2 Bibliothek | Stammdaten, Regeln, Pflichten, Quellen, Wörterbuch als Daten | `bibliothek/` | vorhanden, wächst |
| 3 Kern | Lädt, prüft und rechnet. Ohne KI, ohne Zufall. | `kern/` | vorhanden |
| 4 Fälle | Aufnahme eines Betriebs mit Bewertungen und Nachweisen | heute `faelle/`, künftig getrennter Kundenordner | Trennung offen |
| 5 Erzeuger | Machen aus Fall und Ergebnis die Dokumente | neu: `erzeuger/` | offen |
| 6 Oberfläche | Prüfen, Ergänzen, Bewerten vor Ort; Anzeige der Ergebnisse | `werkzeug/`, `dist/` | Aufnahme vorhanden |
| 7 Agenten | KI-Helfer: übersetzen, auslesen, prüfen, überwachen. Liefern Vorschläge und Prüfberichte. | neu: `agenten/` | offen |

Die Schichten 3, 5 und 6 arbeiten nur mit den Daten aus 2 und 4. Die Agenten in Schicht 7 schreiben nie direkt in Freigaben oder Ergebnisse, sondern legen Vorschläge und Berichte ab, die ein Mensch übernimmt.

## 2 Datenmodell

**Bibliothek (gehört dem Produkt)**

| Baustein | Inhalt |
| --- | --- |
| Merkmal | Festes Vokabular, getrennt nach Material, Vorgang, Ausführung, Umgebung |
| Stammdatum | Material, Vorgang, Ausführung oder Umgebung mit seinen Merkmalen |
| Angabe | Frage an Betrieb, Arbeitsplatz oder Schritt; manche folgen aus dem Sicherheitsdatenblatt |
| Gefährdung | Jede einmal, geordnet nach den elf Gefährdungsfaktoren |
| Regel | Wenn-Bedingung, was entsteht, Gefährdung, Maßnahmen mit fester Kennung und Art (S, T, O, P), Quellen mit Fundstelle, Verbindlichkeit, Belegstatus, Freigabe |
| Pflicht | Wenn-Bedingung auf Betriebsebene, Pflicht, erwarteter Nachweis, Quellen, Belegstatus, Freigabe |
| Quelle | Titel, Stufe, Ausgabestand, Datei im Regelwerk |
| Wörterbuch | Alltagswort und seine Zuordnung zu Stammdaten |

Neu hinzu kommen: **Schwere** je Gefährdung für die Bewertung (C2), **Prüfpflicht** je Ausführung für das Prüfkataster (D2), **Vorsorgeanlass** je Regel (D3), **Unterweisungsthema** je Regel (C8), **Textbausteine** für Betriebsanweisungen (C7).

**Fall (gehört dem Kunden)**

| Baustein | Inhalt |
| --- | --- |
| Betrieb | Name, Betriebsangaben |
| Bereich, Arbeitsplatz | Name, Personenzahl, Umgebung, Angaben, eigene Beobachtungen |
| Schritt | Vorgang, Ausführung, Material |
| Stoff | Handelsname, Stoffart, Datenblatt mit Version und Datum, H- und EUH-Sätze |
| Bewertung vor Ort | Je Maßnahme und Pflicht: vorhanden, fehlt, trifft nicht zu |
| Maßnahmenplan | Verantwortlicher, Termin, erledigt, Wirksamkeit geprüft |
| Nachweise | Unterweisungen, Prüfungen, Vorsorge, Begehungen |
| Version | Stand der Bibliothek, mit dem der Fall gerechnet wurde |

## 3 Module

| Modul | Deckt ab | Baut auf | Stand |
| --- | --- | --- | --- |
| M-Kern: Laden, Prüfen, Auswerten | B1, B2, B6, I1, I3 | Bibliothek | vorhanden |
| M-Stoffe: Eigenschaften aus dem Datenblatt | B5, C5, F5 | Kern | vorhanden, auszubauen |
| M-Abgleich: Beobachtungen gegen Ergebnis | A6, I4 | Kern | vorhanden |
| M-Aufnahme: Oberfläche für Rundgang und Bewertung | A1 bis A3, A5, A8 | Kern | vorhanden |
| M-Protokoll: Übersetzung des Diktats | A4, G1, G7 | Wörterbuch, Agent Übersetzer | Wörterbuch vorhanden, Agent offen |
| M-Bewertung: Nohl und andere Verfahren | C2 | Kern, Schwere je Gefährdung | offen |
| M-Maßnahmen: Plan mit Wirksamkeit | C3 | Bewertung vor Ort | offen |
| M-Dokumente: Gefährdungsbeurteilung, Pflichten-Check, Gefahrstoffverzeichnis, Arbeitsplatzkarte, Entscheidungsvorlage | C1, C4 bis C6, C9, C10 | Kern, Bewertung, Maßnahmen | offen |
| M-Betriebsanweisung | C7 | Regeln, Stoffe, Textbausteine | offen |
| M-Unterweisung | C8 | Regeln, Pflichten | offen |
| M-Begehung | D1 | Aufnahme, Maßnahmen | im Prototyp, zu übertragen |
| M-Prüfkataster | D2 | Prüfpflicht je Ausführung | im Prototyp angelegt |
| M-Vorsorge | D3 | Vorsorgeanlass je Regel | offen |
| M-Fristen | D4 | Unterweisung, Prüfkataster, Vorsorge | offen |
| M-Sifa: Einsatzzeit, Stunden, Jahresbericht, Ausschuss | E1 bis E4 | Fälle | Einsatzzeit im Prototyp |
| M-Freigabe: Ansicht und Ablauf | B3, B4 | Prüfberichte der Agenten | offen |
| M-Versionen: Bibliotheksstand, eingefrorene Kundenstände | F4, Z7 | Repository | teilweise |
| M-Wächter: Änderungen am Regelwerk | F2, F3 | Regelwerk, Quellen | offen |

## 4 Die Agenten

Jeder Agent hat eine eng umrissene Aufgabe, feste Eingaben und einen Bericht als Ausgabe. Keiner darf eine Freigabe setzen.

| Agent | Aufgabe | Eingabe | Ausgabe |
| --- | --- | --- | --- |
| Übersetzer | Protokoll in einen Fall überführen | Protokoll, Stammdaten, Wörterbuch | Fall-Vorschlag mit Textstelle je Zuordnung, Liste der Unsicherheiten und Lücken |
| Datenblatt-Leser | Einstufung, Schutzausrüstung, Grenzwerte aus dem Sicherheitsdatenblatt ziehen | Datenblatt | Stoff-Eintrag mit Seitenangabe |
| Beleg-Prüfer | Prüfen, ob die Aussage einer Regel an der Fundstelle steht | Regel, Text aus dem Regelwerk | Prüfbericht: trägt, trägt teilweise, trägt nicht; mit wörtlicher Textstelle |
| Gegenprüfer | Dieselbe Prüfung unabhängig wiederholen, ohne den ersten Bericht zu kennen | wie Beleg-Prüfer | zweiter Bericht; weichen beide ab, geht die Regel an Andre |
| Lücken-Finder | Eine Technische Regel durchgehen und fehlende Regeln der Bibliothek benennen | Regelwerkstext, Bibliothek | Liste: Anforderung, Fundstelle, vorhandene oder fehlende Regel |
| Wächter | Ausgabestände im Regelwerk mit den Quellen der BAuA, der DGUV und des Gesetzgebers vergleichen | Quellenliste | Änderungsliste mit betroffenen Regeln und Kunden |

**Freigabeablauf einer Regel:** Entwurf → Beleg-Prüfer → Gegenprüfer → bei Einigkeit „Beleg geprüft“, bei Abweichung zur Klärung → Andre liest Regel und beide Berichte → Freigabe oder Änderung. Die Berichte werden zur Regel abgelegt, damit die Freigabe später nachvollziehbar ist.

Was die Agenten leisten können: prüfen, ob etwas im Text steht, und zwar vollständig und wiederholbar. Was sie nicht leisten: entscheiden, ob eine Maßnahme im konkreten Betrieb angemessen ist. Das bleibt Aufgabe der Sifa vor Ort.

## 5 Qualitätssicherung

- Prüfung beim Laden: unbekannte Merkmale, doppelte Kennungen, Regeln ohne Quelle, „Beleg geprüft“ ohne Fundstelle, Freigabe ohne Beleg (I3).
- Regressionstest je Fall mit eingefrorenem Ergebnis (I2).
- Trefferquote je Protokoll im Lernbuch (I4).
- Jede Änderung an der Bibliothek läuft durch alle Tests, bevor sie ins Repository geht.
- Erzeugte Dokumente werden an Musterfällen geprüft: Jede Pflichtangabe aus der Rechtsgrundlage des Dokuments muss enthalten sein.

## 6 Technische Festlegungen

- Bibliothek und Fälle als Textdateien (JSON), Dokumente als HTML zum Drucken und als Markdown.
- Kern in JavaScript ohne Fremdpakete; läuft im Browser und auf dem Rechner mit Node.js.
- Oberfläche als eine einzige Datei, die ohne Internet läuft.
- Versionsverwaltung mit Git; privates Repository auf GitHub für das Produkt.
- Kein Microsoft Office.

## 7 Offene Entscheidungen

| Nr. | Frage | Bis wann nötig |
| --- | --- | --- |
| E1 | Wo liegen echte Kundendaten: nur lokal, in einem zweiten privaten Repository oder verschlüsselt? | vor dem ersten echten Kunden |
| E2 | Wie wird der KI-Einsatz dem Kunden gegenüber geregelt (Vertrag, Auftragsverarbeitung)? | vor dem ersten echten Kunden |
| E3 | Wie arbeiten Handy und Laptop mit demselben Stand? | vor der Generalprobe |
| E4 | Womit wird im Betrieb diktiert und wie kommt der Text ins System? | vor der Generalprobe |
| E5 | Wie laufen die Agenten: von Hand angestoßen in Claude oder als feste, wiederholbare Abläufe? | zu Meilenstein 2 |
| E6 | Wie weit werden Betriebsanweisungen aus Bausteinen erzeugt, wie weit von Hand ergänzt? | zu Meilenstein 4 |
