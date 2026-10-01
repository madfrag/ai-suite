import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum — AI Suite',
};

export default function ImpressumPage() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="bg-background text-foreground flex-1 py-16 px-4 md:px-8 outline-none"
    >
      <div className="max-w-3xl mx-auto space-y-12">
        <div lang="de" className="space-y-12">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold uppercase tracking-tight text-foreground">
              Impressum
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              Angaben gemäß § 5 DDG (Digitale-Dienste-Gesetz)
            </p>
            <p className="text-sm">
              <a href="#english" lang="en" className="underline text-foreground">
                English version below ↓
              </a>
            </p>
          </div>

          <section className="space-y-2">
            <p className="text-foreground leading-relaxed">
              Rushan Engalychev
              <br />
              c/o Block Services
              <br />
              Stuttgarter Str. 106
              <br />
              70736 Fellbach
              <br />
              Deutschland
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">Kontakt</h2>
            <p className="text-muted-foreground leading-relaxed">
              E-Mail:{' '}
              <a href="mailto:rushan@engalychev.com" className="underline text-foreground">
                rushan@engalychev.com
              </a>
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">
              Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Rushan Engalychev (Anschrift wie oben)
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">EU-Streitschlichtung</h2>
            <p className="text-muted-foreground leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS)
              bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . Meine E-Mail-Adresse finden Sie oben. Ich bin nicht bereit und nicht verpflichtet,
              an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">Haftung für Inhalte</h2>
            <p className="text-muted-foreground leading-relaxed">
              Als Diensteanbieter bin ich gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten
              nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG bin ich als
              Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde
              Informationen zu überwachen oder nach Umständen zu forschen, die auf eine
              rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der
              Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
              Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer
              konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
              Rechtsverletzungen werde ich diese Inhalte umgehend entfernen.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">Haftung für Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dieses Projekt ist eine private Demo-/Portfolio-Anwendung und enthält Links zu
              externen Webseiten Dritter (z. B. GitHub), auf deren Inhalte ich keinen Einfluss habe.
              Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die
              Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
              Seiten verantwortlich.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">Urheberrecht</h2>
            <p className="text-muted-foreground leading-relaxed">
              Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten
              unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche
              gekennzeichnet.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h2 className="text-xl font-bold uppercase tracking-wide">Hinweis</h2>
            <p className="text-muted-foreground leading-relaxed">
              Dieses Projekt ist eine nicht-kommerzielle Demo-/Portfolio-Anwendung zu
              Demonstrationszwecken und stellt keine geschäftsmäßige, gewinnorientierte
              Dienstleistung dar.
            </p>
          </section>
        </div>

        <div
          lang="en"
          id="english"
          className="scroll-mt-16 space-y-12 border-t-2 border-border pt-12"
        >
          <div className="space-y-4">
            <h2 className="text-4xl font-bold uppercase tracking-tight text-foreground">
              Legal Notice
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-prose">
              Information pursuant to § 5 DDG (German Digital Services Act)
            </p>
            <p className="text-sm italic text-muted-foreground leading-relaxed max-w-prose">
              This English text is a convenience translation. In case of any discrepancy, the German
              version prevails.
            </p>
          </div>

          <section className="space-y-2">
            <p className="text-foreground leading-relaxed">
              Rushan Engalychev
              <br />
              c/o Block Services
              <br />
              Stuttgarter Str. 106
              <br />
              70736 Fellbach
              <br />
              Germany
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h3 className="text-xl font-bold uppercase tracking-wide">Contact</h3>
            <p className="text-muted-foreground leading-relaxed">
              Email:{' '}
              <a href="mailto:rushan@engalychev.com" className="underline text-foreground">
                rushan@engalychev.com
              </a>
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h3 className="text-xl font-bold uppercase tracking-wide">
              Responsible for content pursuant to § 18 (2) MStV
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Rushan Engalychev (address as above)
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h3 className="text-xl font-bold uppercase tracking-wide">EU Dispute Resolution</h3>
            <p className="text-muted-foreground leading-relaxed">
              The European Commission provides a platform for online dispute resolution (ODR):{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-foreground"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . My email address can be found above. I am neither willing nor obliged to take part
              in dispute resolution proceedings before a consumer arbitration board.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h3 className="text-xl font-bold uppercase tracking-wide">Liability for Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              As a service provider, I am responsible for my own content on these pages in
              accordance with general law pursuant to § 7 (1) DDG. Under §§ 8 to 10 DDG, however, I
              am not obliged to monitor transmitted or stored third-party information or to
              investigate circumstances that indicate unlawful activity. Obligations to remove or
              block the use of information under general law remain unaffected. Liability in this
              regard is only possible from the point in time at which a concrete infringement
              becomes known. Upon becoming aware of such infringements, I will remove the relevant
              content immediately.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h3 className="text-xl font-bold uppercase tracking-wide">Liability for Links</h3>
            <p className="text-muted-foreground leading-relaxed">
              This project is a private demo/portfolio application and contains links to external
              third-party websites (e.g. GitHub) over whose content I have no influence. I therefore
              cannot accept any liability for this external content. The respective provider or
              operator of the linked pages is always responsible for their content.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h3 className="text-xl font-bold uppercase tracking-wide">Copyright</h3>
            <p className="text-muted-foreground leading-relaxed">
              The content and works created by the site operator on these pages are subject to
              German copyright law. Contributions by third parties are marked as such.
            </p>
          </section>

          <section className="space-y-2 border-t border-border pt-8">
            <h3 className="text-xl font-bold uppercase tracking-wide">Note</h3>
            <p className="text-muted-foreground leading-relaxed">
              This project is a non-commercial demo/portfolio application for demonstration purposes
              and is not a commercial, profit-oriented service.
            </p>
          </section>

          <p className="text-sm">
            <a href="#main-content" lang="de" className="underline text-foreground">
              Zur deutschen Fassung ↑
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
