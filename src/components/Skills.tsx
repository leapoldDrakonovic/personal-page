import { profile } from '../data/profile'

export function Skills() {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="section-head">
          <h2>Stack.</h2>
          <p>
            Chosen for load, consistency, and observability — not for a buzzword slide. The same
            tools that held 15K jobs a day and a live Mini App at 117K MAU.
          </p>
        </div>
        <dl className="specs">
          {profile.skillGroups.map((group) => (
            <div className="spec" key={group.id}>
              <dt>{group.label}</dt>
              <dd>{group.items.join('  ·  ')}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
