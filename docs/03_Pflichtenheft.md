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

## 2 Der Maßstab: Was die öffentlichen Stellen vorgeben

Das Werkzeug erfindet keine eigene Systematik. Es folgt den Vorgaben, an denen Berufsgenossenschaft und Aufsichtsbehörde eine Gefährdungsbeurteilung messen. „Gelesen“ heißt: Die Fundstelle wurde am Text im Ordner `regelwerk/` geprüft.

### 2.1 Die sieben Prozessschritte

Quelle: DGUV Grundsatz 311-003 „Erstellung von Handlungshilfen zur Gefährdungsbeurteilung“ (März 2020), Abschnitt 5.1, gelesen. Der Grundsatz verlangt, dass Handlungshilfen diese Schritte zugrunde legen. Er verweist auf die Leitlinie „Gefährdungsbeurteilung und Dokumentation“ der Gemeinsamen Deutschen Arbeitsschutzstrategie.

| Schritt | Vorgabe | Im Werkzeug | Stand |
| --- | --- | --- | --- |
| 1 | Festlegen von Arbeitsbereichen und Tätigkeiten | Betrieb, Bereich, Arbeitsplatz, Schritte | vorhanden |
| 2 | Ermitteln der Gefährdungen | Regeln der Bibliothek, dazu eigene Beobachtungen | vorhanden |
| 3 | Bewerten der Gefährdungen | Modul Bewertung | offen |
| 4 | Festlegen konkreter Arbeitsschutzmaßnahmen | Maßnahmen je Regel in der Rangfolge S, T, O, P | vorhanden |
| 5 | Durchführen der Maßnahmen | Maßnahmenplan mit Verantwortlichem und Termin | offen |
| 6 | Überprüfen der Wirksamkeit | Maßnahmenplan, Begehung | offen |
| 7 | Fortschreiben der Gefährdungsbeurteilung | Versionen, Anlässe, Wächter | teilweise |

### 2.2 Die elf Gefährdungsfaktoren

Quelle: DGUV Grundsatz 311-003 Abschnitt 3.4, gelesen. Dieselben elf Gruppen stehen in der ASR V3 „Gefährdungsbeurteilung“, Abschnitt 5.2.2, mit Beispielen im Anhang, gelesen. Sie liegen jetzt als Daten in `bibliothek/faktoren.json`.

1 Mechanische Gefährdungen · 2 Elektrische Gefährdungen · 3 Gefahrstoffe · 4 Biologische Arbeitsstoffe · 5 Brand- und Explosionsgefährdungen · 6 Thermische Gefährdungen · 7 Spezielle physikalische Einwirkungen · 8 Arbeitsumgebungsbedingungen · 9 Physische Belastung · 10 Psychische Belastung · 11 Sonstige Gefährdungen

Daraus folgen zwei Festlegungen:

- **Vollständigkeit je Arbeitsplatz:** Die Gefährdungsbeurteilung zeigt je Arbeitsplatz alle elf Faktoren. Wo keine Regel ausgelöst hat, steht nicht einfach nichts, sondern die Sifa bestätigt „betrachtet, nicht zutreffend“. Erst das belegt, dass jeder Faktor geprüft wurde.
- **Feingliederung:** Die Unterpunkte je Faktor (zum Beispiel 1.1 ungeschützt bewegte Maschinenteile) übernehmen wir aus dem Handbuch Gefährdungsbeurteilung der BAuA und der Leitlinie der Arbeitsschutzstrategie, sobald beide im Ordner liegen. Bis dahin ordnet die Bibliothek nur dem Hauptfaktor zu. Aus dem Kopf übernehmen wir die Nummern nicht.

Stand der Bibliothek je Faktor: Regeln gibt es für 1, 3, 5, 6, 7, 8, 9 und 11. Für 2 (elektrisch), 4 (biologisch) und 10 (psychisch) gibt es noch keine einzige Regel. Das sind die größten Lücken.

### 2.3 Mindestanforderungen an eine Handlungshilfe

Quelle: DGUV Grundsatz 311-003 Abschnitt 6.2, gelesen. Der Grundsatz richtet sich an die Unfallversicherungsträger. Wir nehmen ihn als Prüfliste für unser eigenes Werkzeug.

| Anforderung des Grundsatzes | Stand im Werkzeug |
| --- | --- |
| Hinweis, dass eine funktionierende Arbeitsschutzorganisation Voraussetzung ist | teilweise: Organisationspflichten vorhanden |
| Hinweis auf Verantwortlichkeiten für die Durchführung | offen |
| Aussage, dass bei Bedarf weitere Expertise hinzuzuziehen ist | offen |
| Besondere Personengruppen betrachten: Jugendliche, werdende und stillende Mütter, Beschäftigte ohne ausreichende Deutschkenntnisse, Menschen mit Behinderung, Leiharbeitnehmer, Praktikanten, Berufsanfänger | teilweise: Jugendliche, Mutterschutz, Fremdfirmen |
| Abweichende Betriebszustände: Wartung, Instandhaltung, Reinigung, Störungsbeseitigung | vorhanden: Sonderbetrieb |
| Alle sieben Prozessschritte berücksichtigen | teilweise, siehe 2.1 |
| Hinweise zur Bewertung, zur Priorisierung und zur Rangfolge der Schutzmaßnahmen | teilweise: Rangfolge ja, Bewertung offen |
| Geeignete Maßnahmen zur Auswahl vorschlagen, Maßnahmenhierarchie beachten | vorhanden |
| Hinweise zur Wirksamkeitsprüfung | offen |
| Hinweise, wann zu aktualisieren ist | offen |
| Hinweise zur Dokumentation | offen |
| Vorlagen ermöglichen Maßnahmen, Verantwortliche, Termine und Wirksamkeitskontrolle | offen im neuen Kern |
| Hinweis, dass die Anwendung allein keine vollständige Gefährdungsbeurteilung ergibt | teilweise: steht im Ergebnis als Entwurfshinweis |
| Hinweis auf die Rechtsunverbindlichkeit | offen |

Empfohlen wird außerdem, die DGUV Branchenregeln einzubeziehen. Für uns sind das die DGUV Regel 109-606 (Tischler und Schreiner) und 109-607 (Metallbau), beide im Ordner.

## 3 Vorgaben aus dem Regelwerk je Modul

| Modul | Wo steht es | Was verlangt wird | Am Text gelesen |
| --- | --- | --- | --- |
| Gefährdungsbeurteilung | ArbSchG § 5, § 6; BetrSichV § 3; GefStoffV § 6; ArbStättV § 3 mit ASR V3; TRBS 1111; TRGS 400; MuSchG § 10; JArbSchG § 28a | Beurteilen je nach Art der Tätigkeit, auch psychische Belastungen (§ 5 Abs. 3 Nr. 6); dokumentieren; für Mutterschutz und Jugendliche eigene Beurteilung | ArbSchG, BetrSichV § 3, MuSchG § 10, JArbSchG § 28a, ASR V3 ja; TRBS 1111 und TRGS 400 nur Gliederung |
| Fortschreiben | ArbSchG § 3; BetrSichV § 3 Abs. 7 | Maßnahmen auf Wirksamkeit prüfen und anpassen; Gefährdungsbeurteilung regelmäßig überprüfen, Stand der Technik berücksichtigen | BetrSichV § 3 Abs. 7 ja; ArbSchG § 3 nur Überschrift |
| Maßnahmen und Rangfolge | ArbSchG § 4 | Gefahren an der Quelle bekämpfen, individuelle Schutzmaßnahmen nachrangig | nur Überschrift |
| Bewertung | kein Verfahren vorgeschrieben; DGUV Grundsatz 311-003 verlangt Hinweise zur Bewertung | Nohl ist anerkanntes Verfahren, aber nicht Pflicht; deshalb umstellbar | 311-003 ja |
| Gefahrstoffverzeichnis | GefStoffV § 6 Abs. 12 | Verzeichnis der verwendeten Gefahrstoffe mit Verweis auf die Sicherheitsdatenblätter | Pflicht ja; Mindestinhalt noch nicht gelesen |
| Betriebsanweisung Gefahrstoffe | GefStoffV § 14 Abs. 1; TRGS 555 Abschnitt 3 | Schriftlich, in verständlicher Form und Sprache, zugänglich; Gliederung nach TRGS 555 Abschnitt 3.2 | § 14 ja; TRGS 555 Gliederung ja, Inhalt je Abschnitt noch nicht |
| Betriebsanweisung Arbeitsmittel | BetrSichV § 12 Abs. 2 | Schriftliche Betriebsanweisung in verständlicher Form; die Gebrauchsanleitung des Herstellers kann genügen, wenn sie die Angaben enthält | ja |
| Unterweisung | ArbSchG § 12; DGUV Vorschrift 1 § 4; GefStoffV § 14 Abs. 2; BetrSichV § 12; JArbSchG § 29; LärmVibrationsArbSchV § 11 | Mindestens einmal jährlich und dokumentiert (DGUV Vorschrift 1); bei Gefahrstoffen vor Aufnahme und mindestens jährlich, arbeitsplatzbezogen; Jugendliche mindestens halbjährlich | DGUV Vorschrift 1 § 4, GefStoffV § 14, JArbSchG § 29 ja; übrige nur Überschrift |
| Begehung | ASiG § 6 | Die Fachkraft begeht die Arbeitsstätten in regelmäßigen Abständen, teilt Mängel mit und schlägt Maßnahmen vor | ja |
| Prüfkataster | BetrSichV § 3 Abs. 6, § 14, § 16, § 17; TRBS 1201; TRBS 1203 | Art, Umfang und Fristen der Prüfungen festlegen; Prüfungen aufzeichnen | § 3 Abs. 6 und § 17 ja; TRBS nur Gliederung |
| Vorsorgekartei | ArbMedVV § 3 Abs. 4 | Kartei mit Angaben, dass, wann und aus welchen Anlässen Vorsorge stattgefunden hat; auf Anordnung an die Behörde | ja |
| Vorsorgeanlässe | ArbMedVV § 4, § 5 und Anhang | Pflicht- und Angebotsvorsorge je Anlass | Lärm und Hartholzstaub ja, übrige Anlässe nicht |
| Arbeitsschutzausschuss | ASiG § 11 | Ab mehr als 20 Beschäftigten, mindestens einmal vierteljährlich | ja |
| Sicherheitsbeauftragte | DGUV Vorschrift 1 § 20 | Ab regelmäßig mehr als 20 Beschäftigten | ja |
| Erste Hilfe | ArbSchG § 10; DGUV Vorschrift 1 § 24 bis § 26; ASR A4.3 | Ersthelfer, Material, Einrichtungen | Paragrafen ja, Anzahl der Ersthelfer noch nicht |
| Brandschutz | ASR A2.2 | Feuerlöscher, Brandschutzhelfer | noch nicht |
| Elektrische Anlagen | DGUV Vorschrift 3 | Prüfung elektrischer Anlagen und Betriebsmittel | Vorschrift fehlt im Ordner |
| Bildschirmarbeit | ArbStättV Anhang Nr. 6 | Anforderungen an Bildschirmarbeitsplätze | nur Anwendungsbereich |
| Einsatzzeit und Bericht der Sifa | ASiG § 5, § 6; DGUV Vorschrift 2 | Einsatzzeiten, Aufgaben, Bericht | ASiG ja; DGUV Vorschrift 2 fehlt im Ordner |
| Fremdfirmen | ArbSchG § 8; DGUV Vorschrift 1 § 6 | Zusammenarbeit und Abstimmung | noch nicht |

### 3.1 Was im Ordner noch fehlt

| Dokument | Wofür |
| --- | --- |
| Leitlinie „Gefährdungsbeurteilung und Dokumentation“ der Gemeinsamen Deutschen Arbeitsschutzstrategie | Maßstab der Aufsicht für Angemessenheit und Dokumentation |
| Handbuch Gefährdungsbeurteilung der BAuA | Feingliederung der Gefährdungsfaktoren |
| Gefährdungskatalog oder Handlungshilfe der BGHM | Branchenmaßstab; die zuerst geladene DGUV Information 203-063 gilt für die Abwasserentsorgung und ist als unpassend markiert |
| DGUV Vorschrift 2 | Einsatzzeit, Aufgaben und Bericht der Sifa |
| DGUV Vorschrift 3 | Elektrische Anlagen und Betriebsmittel |
| DGUV Information 211-010 „Sicherheit durch Betriebsanweisungen“ | Muster und Aufbau der Betriebsanweisungen |
| DGUV Regel 108-007 | Lagereinrichtungen |
| Arbeitsmedizinische Regeln | Fristen und Aufbewahrung in der Vorsorge |

## 4 Datenmodell

**Bibliothek (gehört dem Produkt)**

| Baustein | Inhalt |
| --- | --- |
| Merkmal | Festes Vokabular, getrennt nach Material, Vorgang, Ausführung, Umgebung |
| Stammdatum | Material, Vorgang, Ausführung oder Umgebung mit seinen Merkmalen |
| Angabe | Frage an Betrieb, Arbeitsplatz oder Schritt; manche folgen aus dem Sicherheitsdatenblatt |
| Gefährdungsfaktor | Die elf Gruppen nach DGUV Grundsatz 311-003 und ASR V3 |
| Gefährdung | Jede einmal, einem Gefährdungsfaktor zugeordnet |
| Regel | Wenn-Bedingung, was entsteht, Gefährdung, Maßnahmen mit fester Kennung und Art (S, T, O, P), Quellen mit Fundstelle, Verbindlichkeit, Belegstatus, Freigabe |
| Pflicht | Wenn-Bedingung auf Betriebsebene, Pflicht, erwarteter Nachweis, Quellen, Belegstatus, Freigabe |
| Quelle | Titel, Stufe, Ausgabestand, Datei im Regelwerk |
| Wörterbuch | Alltagswort und seine Zuordnung zu Stammdaten |

Neu hinzu kommen: **Feingliederung** der Gefährdungsfaktoren (2.2), **Schwere** je Gefährdung für die Bewertung (C2), **Prüfpflicht** je Ausführung für das Prüfkataster (D2), **Vorsorgeanlass** je Regel (D3), **Unterweisungsthema** je Regel (C8), **Textbausteine** für Betriebsanweisungen (C7).

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

## 5 Module

| Modul | Deckt ab | Baut auf | Stand |
| --- | --- | --- | --- |
| M-Kern: Laden, Prüfen, Auswerten | B1, B2, B6, I1, I3 | Bibliothek | vorhanden |
| M-Stoffe: Eigenschaften aus dem Datenblatt | B5, C5, F5 | Kern | vorhanden, auszubauen |
| M-Abgleich: Beobachtungen gegen Ergebnis | A6, I4 | Kern | vorhanden |
| M-Aufnahme: Oberfläche für Rundgang und Bewertung | A1 bis A3, A5, A8 | Kern | vorhanden |
| M-Protokoll: Übersetzung des Diktats | A4, G1, G7 | Wörterbuch, Agent Übersetzer | Wörterbuch vorhanden, Agent offen |
| M-Bewertung: Nohl und andere Verfahren | C2 | Kern, Schwere je Gefährdung | offen |
| M-Maßnahmen: Plan mit Wirksamkeit | C3 | Bewertung vor Ort | offen |
| M-Vollständigkeit: alle elf Faktoren je Arbeitsplatz betrachtet | B10 | Kern, Faktoren | offen |
| M-Dokumente: Gefährdungsbeurteilung, Pflichten-Check, Gefahrstoffverzeichnis, Arbeitsplatzkarte, Entscheidungsvorlage | C1, C4 bis C6, C9, C10, B11 | Kern, Bewertung, Maßnahmen | offen |
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

## 6 Die Agenten

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

## 7 Qualitätssicherung

- Prüfung beim Laden: unbekannte Merkmale, doppelte Kennungen, Regeln ohne Quelle, „Beleg geprüft“ ohne Fundstelle, Freigabe ohne Beleg (I3).
- Regressionstest je Fall mit eingefrorenem Ergebnis (I2).
- Trefferquote je Protokoll im Lernbuch (I4).
- Jede Änderung an der Bibliothek läuft durch alle Tests, bevor sie ins Repository geht.
- Erzeugte Dokumente werden an Musterfällen geprüft: Jede Pflichtangabe aus der Rechtsgrundlage des Dokuments muss enthalten sein.

## 8 Technische Festlegungen

- Bibliothek und Fälle als Textdateien (JSON), Dokumente als HTML zum Drucken und als Markdown.
- Kern in JavaScript ohne Fremdpakete; läuft im Browser und auf dem Rechner mit Node.js.
- Oberfläche als eine einzige Datei, die ohne Internet läuft.
- Versionsverwaltung mit Git; privates Repository auf GitHub für das Produkt.
- Kein Microsoft Office.

## 9 Entscheidungen zum Betrieb

Stand 12.11.2026.

| Nr. | Frage | Entscheidung | Status |
| --- | --- | --- | --- |
| E1 | Wo liegen echte Kundendaten? | Zurückgestellt, bis der erste echte Kunde ansteht. Dann wird der übliche Standard ermittelt (Ablageort, Verschlüsselung, Aufbewahrung). Bis dahin gibt es nur Beispiele aus dem Kopf. | zurückgestellt |
| E2 | Wie wird der KI-Einsatz gegenüber dem Kunden geregelt? | Die KI erfährt nichts über den Kunden. Protokolle beschreiben nur Arbeitsplätze, ohne Firmenname, Ort und Personennamen. Der Bezug zwischen Fall und Kunde liegt allein bei Andre. Ob darüber hinaus eine vertragliche Regelung nötig ist, wird mit E1 geklärt. | entschieden, rechtliche Prüfung offen |
| E3 | Wie arbeiten Handy und Laptop mit demselben Stand? | Vorerst über diesen Weg: Andre spricht am Handy in die Claude-App, die Sitzung läuft auf dem Laptop, dort und im Repository liegt alles. Ein eigener Abgleich wird erst gebaut, wenn die Oberfläche am Handy vor Ort gebraucht wird. | entschieden für jetzt |
| E4 | Womit wird diktiert? | Vorerst mit dem Handy in der Claude-App. Ein eigenes Diktiergerät mit automatischer Verschriftung wird später geprüft. Das System nimmt in jedem Fall Text entgegen, das Gerät ist austauschbar. | entschieden für jetzt |
| E5 | Wie laufen die Agenten? | Als feste, schriftlich beschriebene Abläufe im Repository, ausgeführt von Claude und von Hand angestoßen. Siehe 9.1. | entschieden |
| E6 | Wie entstehen Betriebsanweisungen? | Durch einen festen Ablauf aus Bausteinen, ohne frei formulierende KI. Siehe 9.2. | entschieden im Grundsatz, Feinplanung zu M4 |

### 9.1 Betriebsweise der Agenten (E5)

- Jeder Agent ist eine Datei in `agenten/`: Aufgabe, Eingaben, Arbeitsschritte, Form des Berichts, was er nicht darf.
- Ausgeführt wird er von Claude, hier im Chat oder mit Claude Code auf dem Laptop. Es gibt vorerst keinen eigenen Dienst und keine laufenden Kosten.
- Jeder Lauf legt einen Bericht in `pruefberichte/` ab: Regel, Fundstelle, wörtliche Textstelle, Urteil, Datum, Stand des Regelwerks. Der Kern prüft die Form der Berichte.
- Der Gegenprüfer läuft in einem frischen Durchgang ohne Zugriff auf den ersten Bericht.
- „Beleg geprüft“ setzt der Kern nur, wenn zwei übereinstimmende Berichte vorliegen. Die Freigabe setzt Andre.
- Ein eigener, selbstständig laufender Dienst wird erst gebaut, wenn die Menge es verlangt. Die Beschreibungen in `agenten/` bleiben dann dieselben.

Begründung: gleiche Qualität wie ein fest eingebauter Dienst, aber sofort nutzbar, nachvollziehbar und ohne Infrastruktur. Was sich bewährt, lässt sich später automatisieren, ohne die Abläufe neu zu erfinden.

### 9.2 Betriebsanweisungen aus Bausteinen (E6)

- Die Gliederung gibt das Regelwerk vor: für Gefahrstoffe TRGS 555 Abschnitt 3.2, für Arbeitsmittel BetrSichV § 12 Abs. 2 und die DGUV Information 211-010 (noch zu beschaffen).
- Jede Maßnahme der Bibliothek bekommt die Angabe, in welchen Abschnitt der Betriebsanweisung sie gehört (Schutzmaßnahmen und Verhaltensregeln, Verhalten bei Störungen, Erste Hilfe, Instandhaltung und Entsorgung).
- Für einen fertig aufgenommenen Arbeitsplatz setzt der Erzeuger die Betriebsanweisung zusammen: aus den ausgelösten Regeln, aus den Daten der Stoffe (Gefahren aus den H-Sätzen, Schutzausrüstung, Erste Hilfe, Entsorgung aus dem Sicherheitsdatenblatt) und aus den Angaben zum Arbeitsplatz.
- Was sich nicht aus Daten füllen lässt, erscheint als sichtbare Lücke „zu ergänzen“, nicht als erfundener Text.
- KI liest höchstens das Sicherheitsdatenblatt aus. Den Text der Betriebsanweisung formuliert sie nicht.
- Andre ergänzt betriebliche Besonderheiten von Hand. Die Ergänzungen bleiben bei einer Neuerzeugung erhalten.

Vorteil dieses Wegs: Ändert sich eine Regel oder ein Datenblatt, lassen sich alle betroffenen Betriebsanweisungen neu erzeugen und die Änderungen benennen.
