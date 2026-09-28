import Icon from "./Icon";

function Overview({ setPage }) {
  return (
    <div className="content-grid overview-grid">
      <section className="welcome-panel">
        <div className="welcome-orbit orbit-one" />
        <div className="welcome-orbit orbit-two" />

        <p className="micro-label">
          WEEK 1 FOUNDATION
        </p>

        <h2>
          The ledger is the
          <span> source of truth.</span>
        </h2>

        <p>
          RevertPay does not rely on editable account
          balance fields. Every balance is calculated
          from permanent debit and credit ledger entries.
        </p>

        <div className="welcome-actions">
          <button
            className="action-main"
            onClick={() => setPage("accounts")}
          >
            Find an account
            <Icon name="search" size={17} />
          </button>

          <button
            className="action-quiet"
            onClick={() => setPage("create")}
          >
            Create account
          </button>
        </div>
      </section>

      <section className="system-map">
        <div className="panel-heading">
          <div>
            <p className="micro-label">
              SYSTEM DESIGN
            </p>

            <h2>Core invariants</h2>
          </div>

          <Icon name="shield" />
        </div>

        <div className="invariant-list">
          <div>
            <span>01</span>

            <p>
              <strong>JWT protected access</strong>

              <small>
                Only authenticated users can access
                operations.
              </small>
            </p>
          </div>

          <div>
            <span>02</span>

            <p>
              <strong>Derived account balance</strong>

              <small>
                Balance = total credits − total debits.
              </small>
            </p>
          </div>

          <div>
            <span>03</span>

            <p>
              <strong>Double-entry movement</strong>

              <small>
                Each transfer must create matching
                records.
              </small>
            </p>
          </div>
        </div>
      </section>

      <section className="next-up">
        <p className="micro-label">
          NEXT MILESTONE
        </p>

        <h2>Escrow state machine</h2>

        <p>
          Week 2 transforms the ledger foundation into
          a secure marketplace escrow workflow.
        </p>

        <div className="state-preview">
          <span>CREATED</span>
          <i />
          <span>FUNDED</span>
          <i />
          <span>SHIPPED</span>
          <i />
          <span>RELEASED</span>
        </div>
      </section>
    </div>
  );
}

export default Overview;