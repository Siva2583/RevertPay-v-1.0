import Icon from "./Icon";
import {
  formatMoney,
  formatDate,
} from "../utils/formatters";

function LedgerTable({ ledger, compact = false }) {
  const data = compact
    ? ledger.slice(-6).reverse()
    : [...ledger].reverse();

  if (!ledger.length) {
    return (
      <div className="empty-ledger">
        <div className="empty-ledger-icon">
          <Icon name="book" size={24} />
        </div>

        <strong>No ledger activity yet</strong>

        <p>
          When funds move, immutable debit and credit
          records will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="ledger-list">
      <div className="ledger-columns">
        <span>Entry</span>
        <span>Reference</span>
        <span>Recorded at</span>
        <span>Amount</span>
      </div>

      {data.map((entry) => {
        const isCredit = entry.type === "CREDIT";

        return (
          <div className="ledger-entry" key={entry.id}>
            <div className="ledger-type">
              <div
                className={`entry-direction ${
                  isCredit ? "in" : "out"
                }`}
              >
                {isCredit ? "+" : "−"}
              </div>

              <div>
                <strong>
                  {isCredit
                    ? "Credit posted"
                    : "Debit posted"}
                </strong>

                <span>{entry.type} ENTRY</span>
              </div>
            </div>

            <div className="reference">
              <span className="mobile-ledger-label">
                Reference
              </span>

              {entry.referenceId || "—"}
            </div>

            <div className="date">
              <span className="mobile-ledger-label">
                Recorded
              </span>

              {formatDate(entry.createdAt)}
            </div>

            <div
              className={`entry-amount ${
                isCredit ? "positive" : "negative"
              }`}
            >
              {isCredit ? "+" : "−"}{" "}
              {formatMoney(entry.amount)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default LedgerTable;