import { profile } from '../data/profile'

export function Work() {
  return (
    <section className="section" id="work">
      <div className="wrap">
        <div className="section-head">
          <h2>Work.</h2>
          <p>
            Production records, not a bullet-point dump. Kafka across 19 services. Serializable
            isolation when a race could double-spend. Relayers, RBAC, and on-chain rules for
            products that settle value.
          </p>
        </div>
        <div className="roles">
          {profile.experience.map((role) => (
            <article className="role" id={`role-${role.id}`} key={role.id}>
              <div className="role-top">
                <h3>{role.company}</h3>
                <div className="role-meta">
                  {role.role} · {role.period}
                  {role.kind ? ` · ${role.kind}` : ''}
                </div>
              </div>
              <p className="role-product">{role.product}</p>
              {role.problem ? (
                <p className="problem">
                  <strong>Problem. </strong>
                  {role.problem}
                </p>
              ) : null}
              <ul>
                {role.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {role.products ? (
                <div className="products">
                  {role.products.map((product) => (
                    <div className="product" key={product.name}>
                      <h4>{product.name}</h4>
                      <p>{product.body}</p>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="chips">
                {role.stack.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
