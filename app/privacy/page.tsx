import PageHero from "@/components/PageHero";

export const metadata = {
  title: "Privacy · Maria Aguilera",
  description: "Privacy policy for mariaa.tech",
};

export default function PrivacyPage() {
  return (
    <main className="blog-page">
      <PageHero
        title="Privacy"
        subtitle="A short, honest note about what this site does and doesn't collect"
        icon="shield"
      />

      <section className="blog-body">
        <div className="blog-body__container">
          <div className="page-content">
            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>The short version</h2>
                <p className="talks-section__lead">
                  This is a personal portfolio site. It does not require accounts, does not
                  store user data, and does not sell or share anything. Below is the longer
                  list of every third-party tool the site uses and what it actually does with
                  data — in case you are curious or auditing for a Pinterest / API integration
                  review.
                </p>
              </div>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>What this site collects directly</h2>
                <p className="talks-section__lead">
                  Nothing personal. No accounts, no comments, no forms that store input. The
                  pages you visit are static or server-rendered from public data; nothing you do
                  on the site is persisted by me.
                </p>
              </div>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Hosting and analytics</h2>
                <p className="talks-section__lead">
                  The site is hosted on Vercel. Vercel records standard request metadata
                  (IP-derived region, user-agent, timestamps) for operational and analytics
                  purposes. See Vercel&apos;s privacy policy for details. I do not run any
                  additional analytics, cookies, or trackers of my own.
                </p>
              </div>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Third-party APIs the site reads from</h2>
                <p className="talks-section__lead">
                  The Beyond Work page fetches a few read-only pieces of public data on each
                  page load (cached for up to an hour by Vercel):
                </p>
              </div>
              <ul className="home-panel__list">
                <li>
                  Chess.com&apos;s public REST API — to display my own chess rating.
                </li>
                <li>
                  The Pinterest API — to display pins from my own boards as design
                  inspiration. Only my own boards and pins are accessed; the integration uses a
                  Trial-tier app-owner access token, not a user OAuth flow, so no other user
                  ever signs in here.
                </li>
              </ul>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Embedded images</h2>
                <p className="talks-section__lead">
                  Some images load directly from <code>i.pinimg.com</code> (Pinterest&apos;s
                  CDN). When that happens, your browser makes a direct request to Pinterest and
                  Pinterest will see that request as part of normal CDN traffic. I have no
                  control over what they log.
                </p>
              </div>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Cookies</h2>
                <p className="talks-section__lead">
                  This site sets no cookies of its own. Vercel may set operational cookies for
                  routing and caching. There is no advertising, no cross-site tracking, no
                  fingerprinting.
                </p>
              </div>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <h2>Contact</h2>
                <p className="talks-section__lead">
                  If you have a question or want anything removed, email{" "}
                  <a href="mailto:mariaaguilera979797@gmail.com">
                    mariaaguilera979797@gmail.com
                  </a>
                  .
                </p>
              </div>
            </section>

            <section className="page-section talks-section">
              <div className="talks-section__header">
                <p className="talks-section__lead">
                  Last updated: 2026-05-18
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}
