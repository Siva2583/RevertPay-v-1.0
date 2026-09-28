import { formatMoney } from "../utils/formatters";

function AccountSnapshot({ account, balance, ledger }) {
  const credits = ledger
    .filter((entry) => entry.type === "CREDIT")
    .reduce(
      (sum, entry) => sum + Number(entry.amount || 0),
      0
    );

  const debits = ledger
    .filter((entry) => entry.type === "DEBIT")
    .reduce(
      (sum, entry) => sum + Number(entry.amount || 0),
      0
    );

  return (
    <>
      <section className="account-banner">
        <div className="account-identity">
          <p>ACTIVE LEDGER ACCOUNT</p>

          <h2>{account.accountNumber}</h2>

          <div className="account-tags">
            <span>Owner ID · {account.ownerId}</span>
            <span>{account.ownerType}</span>
          </div>
        </div>

        <div className="balance-figure">
          <span>DERIVED BALANCE</span>
          <strong>{formatMoney(balance)}</strong>
          <small>
            Calculated from ledger entries
          </small>
        </div>
      </section>

      <section className="metric-row">
        <div className="metric-card credit-card">
          <span>Incoming credits</span>
          <strong>{formatMoney(credits)}</strong>
          <small>All recorded CREDIT entries</small>
        </div>

        <div className="metric-card debit-card">
          <span>Outgoing debits</span>
          <strong>{formatMoney(debits)}</strong>
          <small>All recorded DEBIT entries</small>
        </div>

        <div className="metric-card neutral-card">
          <span>Ledger records</span>
          <strong>{ledger.length}</strong>
          <small>Immutable transaction entries</small>
        </div>
      </section>
    </>
  );
}

export default AccountSnapshot;