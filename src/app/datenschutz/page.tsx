import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Datenschutz — AI Suite',
};

export default function DatenschutzPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-background text-foreground flex-1 py-16 px-4 md:px-8 outline-none"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground">
            Datenschutzerklärung
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-prose">
            Diese Erklärung informiert Sie darüber, welche personenbezogenen Daten bei der Nutzung
            von AI Suite verarbeitet werden.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-xl font-bold uppercase tracking-wide">1. Verantwortlicher</h2>
          <p className="text-muted-foreground leading-relaxed">
            Rushan Engalychev
            <br />
            c/o Block Services
            <br />
            Stuttgarter Str. 106
            <br />
            70736 Fellbach
            <br />
            Deutschland
            <br />
            E-Mail:{' '}
            <a href="mailto:rushan@engalychev.com" className="underline text-foreground">
              rushan@engalychev.com
            </a>
          </p>
        </section>

        <section className="space-y-2 border-t border-border pt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide">2. Allgemeines</h2>
          <p className="text-muted-foreground leading-relaxed">
            AI Suite ist ein privates Demo-/Portfolio-Projekt zur Veranschaulichung technischer
            Fähigkeiten. Es werden keine Daten zu Werbezwecken ausgewertet, keine
            Analyse-/Tracking-Tools eingesetzt und keine Daten verkauft.
          </p>
        </section>

        <section className="space-y-2 border-t border-border pt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide">3. Hosting (Vercel)</h2>
          <p className="text-muted-foreground leading-relaxed">
            Diese Anwendung wird über Vercel Inc. gehostet (Vercel Inc., 340 S Lemon Ave #4133,
            Walnut, CA 91789, USA). Beim Aufruf der Seite verarbeitet Vercel automatisch technische
            Zugriffsdaten (u. a. IP-Adresse, Datum/Uhrzeit des Zugriffs, aufgerufene Seite,
            Browsertyp) in Server-Logfiles, um den Betrieb der Seite technisch sicherzustellen.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem sicheren
            und funktionsfähigen Betrieb). Dabei kann es zu einer Datenübermittlung in die USA
            (Drittland) kommen; nach Angaben von Vercel stützt sich das Unternehmen hierfür auf
            geeignete Garantien (u. a. EU-Standardvertragsklauseln).
          </p>
        </section>

        <section className="space-y-2 border-t border-border pt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            4. Verarbeitete Daten in dieser Anwendung
          </h2>

          <div className="space-y-4 pt-2">
            <div>
              <h3 className="font-semibold text-foreground">a) Ratenbegrenzung (IP-Adresse)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Um Missbrauch der KI-Funktionen zu verhindern und Hosting-Kosten kalkulierbar zu
                halten, wird die IP-Adresse jedes Aufrufs der Chat- und Zusammenfassungs-Endpunkte
                zusammen mit dem aufgerufenen Endpunkt und dem Datum in der Datenbank (siehe Punkt
                4e) gespeichert, um ein tägliches Nutzungslimit durchzusetzen. Die IP-Adresse wird
                nicht mit einem Nutzerkonto verknüpft. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse am Schutz vor Missbrauch und an kalkulierbaren
                Betriebskosten).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                b) Anonyme Sitzungen (Supabase Auth)
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Wenn Sie dem Hinweis vor der Nutzung des Chatbots oder des Text-Summarizers
                zustimmen (siehe Punkt 4g), wird eine anonyme, pseudonyme Sitzungs-ID erzeugt und in
                einem Cookie im Browser gespeichert. Vor Ihrer Zustimmung – etwa beim bloßen Besuch
                der Startseite – wird keine Sitzung angelegt. Diese ID wird verwendet, um
                Chatverläufe und gespeicherte Zusammenfassungen dem jeweiligen Gerät zuordnen zu
                können, ohne dass eine Registrierung, ein Name oder eine E-Mail-Adresse erforderlich
                ist. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Erbringung der von Ihnen
                angefragten Funktion).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">c) Theme-Cookie</h3>
              <p className="text-muted-foreground leading-relaxed">
                Ein technisch notwendiges Cookie speichert die von Ihnen gewählte Darstellung
                (hell/dunkel). Es enthält keine personenbezogenen Daten und dient ausschließlich der
                Funktionalität der Seite. Rechtsgrundlage: § 25 Abs. 2 Nr. 2 TDDDG bzw. Art. 6 Abs.
                1 lit. f DSGVO — eine Einwilligung ist hierfür nicht erforderlich.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">
                d) Chat-Nachrichten und Textzusammenfassungen
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Wenn Sie den Chatbot oder den Text-Summarizer nutzen, wird der von Ihnen eingegebene
                Text zur Erzeugung der Antwort bzw. Zusammenfassung an einen der folgenden
                KI-Anbieter übermittelt:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground leading-relaxed space-y-1 mt-2">
                <li>
                  <span className="text-foreground">OpenAI</span> (OpenAI Ireland Ltd. / OpenAI,
                  L.L.C., USA) — für Chat-Antworten und optional für Zusammenfassungen
                </li>
                <li>
                  <span className="text-foreground">Hugging Face</span> (Hugging Face, Inc.) —
                  optional für Zusammenfassungen, sofern Sie diesen Anbieter auswählen
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-2">
                Die Übermittlung an diese Anbieter kann eine Verarbeitung außerhalb der EU
                (insbesondere USA) beinhalten. Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
                (Erbringung der von Ihnen angefragten Funktion). Bitte geben Sie keine sensiblen
                oder identifizierenden Daten in den Chat oder die Zusammenfassungs-Eingabe ein.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">e) Speicherung in Supabase</h3>
              <p className="text-muted-foreground leading-relaxed">
                Chatnachrichten, KI-generierte Sitzungszusammenfassungen sowie von Ihnen
                gespeicherte Text-Zusammenfassungen werden in einer Supabase-Datenbank mit
                Serverstandort EU (Irland) gespeichert. Der Zugriff ist über Row-Level-Security auf
                die jeweilige anonyme Sitzungs-ID beschränkt. Rechtsgrundlage: Art. 6 Abs. 1 lit. b
                DSGVO.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">f) Bildvorschau (Lorem Picsum)</h3>
              <p className="text-muted-foreground leading-relaxed">
                Auf der About-Seite lädt Ihr Browser direkt Vorschaubilder vom Drittanbieter Lorem
                Picsum (picsum.photos). Dabei kann Ihre IP-Adresse an diesen Anbieter übermittelt
                werden. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einer
                funktionsfähigen Darstellung der Seite).
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-foreground">g) Hinweis- und Zustimmungsdialog</h3>
              <p className="text-muted-foreground leading-relaxed">
                Vor der ersten Nutzung des Chatbots oder des Text-Summarizers werden Sie über die
                Verarbeitung (Übermittlung an KI-Anbieter, Speicherung, Sitzungs-Cookie) informiert
                und um Ihre Zustimmung gebeten. Ihre Entscheidung wird mit Versionsnummer und
                Zeitpunkt im lokalen Speicher (localStorage) Ihres Browsers abgelegt, nicht auf dem
                Server. Lehnen Sie ab, werden Sie zur Startseite geleitet und es wird nichts
                gespeichert. Sie können die Zustimmung jederzeit widerrufen, indem Sie die
                Website-Daten Ihres Browsers löschen; bei einer Änderung dieser Erklärung wird die
                Zustimmung erneut abgefragt. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO sowie, für
                die Übermittlung in Drittländer, Art. 49 Abs. 1 lit. a DSGVO.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-2 border-t border-border pt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide">5. Speicherdauer</h2>
          <p className="text-muted-foreground leading-relaxed">
            Die Ratenbegrenzungs-Daten (IP-Adresse) werden tagesbezogen geführt. Chatnachrichten,
            Sitzungszusammenfassungen und gespeicherte Text-Zusammenfassungen werden gespeichert,
            bis Sie deren Löschung beantragen (siehe Punkt 6) — eine automatische Löschung erfolgt
            derzeit nicht.
          </p>
        </section>

        <section className="space-y-2 border-t border-border pt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide">6. Ihre Rechte</h2>
          <p className="text-muted-foreground leading-relaxed">
            Sie haben nach der DSGVO insbesondere folgende Rechte: Auskunft (Art. 15), Berichtigung
            (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18),
            Datenübertragbarkeit (Art. 20) sowie Widerspruch (Art. 21) gegen die Verarbeitung. Da
            diese Anwendung derzeit keine Selbstbedienungs-Funktion zur Löschung Ihrer Daten
            anbietet, wenden Sie sich hierfür bitte per E-Mail an{' '}
            <a href="mailto:rushan@engalychev.com" className="underline text-foreground">
              rushan@engalychev.com
            </a>{' '}
            — nennen Sie nach Möglichkeit den ungefähren Zeitpunkt Ihres Besuchs, damit ich Ihre
            Daten zuordnen kann.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Außerdem haben Sie das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren,
            z. B. beim Landesbeauftragten für den Datenschutz und die Informationsfreiheit
            Baden-Württemberg.
          </p>
        </section>

        <section className="space-y-2 border-t border-border pt-8">
          <h2 className="text-xl font-bold uppercase tracking-wide">
            7. Keine automatisierte Entscheidungsfindung
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Es findet keine automatisierte Entscheidungsfindung im Sinne des Art. 22 DSGVO statt,
            die rechtliche oder ähnlich erhebliche Auswirkungen auf Sie hätte.
          </p>
        </section>
      </div>
    </main>
  );
}
