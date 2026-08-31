import { profile } from '../data/profile'

export function Hero() {
  return (
    <section className="hero wrap" id="top">
      <div className="hero-grid">
        <div>
          <p className="kicker">
            {/*

            <i />
            {profile.title} · {profile.location}
            */}
          </p>
          <h1 className="hero-title">
            
            {/*profile.name*/}
            <span className="hero-title-sub">Backend for systems that move money.</span>
          </h1>
          <p className="lede">{profile.pitch}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#terminal">
              Open terminal
            </a>
            <a className="btn btn-ghost" href={profile.cvPath} download>
              Download CV
            </a>
          </div>
        </div>

        {/*
          LAYERS ON HERO SECTION
          TODO: Remote to 3d three js object
        */}
        <div className="layers" aria-hidden="true">
          <div className="layer layer-a" />
          <div className="layer layer-b" />
          <div className="layer layer-c" />
        </div>
      </div>
    </section>
  )
}
