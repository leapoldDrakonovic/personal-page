import { profile } from '../data/profile'

export function Contact() {
  return (
    <section className="section" id="contact">
      <div className="wrap">
        <div className="contact-card">
          <div>
            <h2>Hire the person who already shipped it.</h2>
            <p>
              Backend and distributed systems for fintech and Web3. Event-driven platforms, gRPC
              service meshes, and on-chain integrations with the boring parts — auth, isolation,
              retries — done properly.
            </p>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`mailto:${profile.email}`}>
                Email me
              </a>
              <a className="btn btn-ghost" href={profile.telegramUrl} target="_blank" rel="noreferrer">
                Telegram
              </a>
              <a className="btn btn-ghost" href={profile.cvPath} download>
                CV PDF
              </a>
            </div>
          </div>
          <div className="contact-list">
            <a href={`mailto:${profile.email}`}>
              {profile.email}
              <small>Email</small>
            </a>
            <a href={profile.telegramUrl} target="_blank" rel="noreferrer">
              {profile.telegram}
              <small>Telegram</small>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
              <small>Profile</small>
            </a>
            <a href={profile.phoneUrl}>
              {profile.phone}
              <small>Phone</small>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <span>
          {profile.name} · {profile.title}
        </span>
        <span>Obsidian / White · type `help` in the machine</span>
      </div>
    </footer>
  )
}
