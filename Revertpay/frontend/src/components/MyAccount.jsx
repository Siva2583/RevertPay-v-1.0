import { useEffect, useState } from "react";
import Icon from "./Icon";
import LedgerTable from "./LedgerTable";
import API from "../services/api";
import {
  formatMoney,
  readResponse,
} from "../utils/formatters";

function MyAccount({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMyAccount = async () => {
      try {
        const response = await fetch(API.me, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await readResponse(response);

        if (!response.ok) {
          setError(
            typeof result === "string"
              ? result
              : result.message ||
                "Could not load your account."
          );

          return;
        }

        setData(result);
      } catch {
        setError(
          "Could not connect to the backend server."
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyAccount();
  }, [token]);

  if (loading) {
    return (
      <div className="lookup-placeholder">
        <Icon name="wallet" size={34} />

        <h3>Loading your account...</h3>

        <p>
          Fetching your RevertPay account details.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-alert">{error}</div>
    );
  }

  if (!data) {
    return null;
  }

  const account = data.account;
  const ledger = data.ledger || [];

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
    <div className="loaded-account">
      <section className="account-banner">
        <div className="account-identity">
          <p>MY REVERTPAY PROFILE</p>

          <h2>{data.name}</h2>

          <div className="account-tags">
            <span>User ID · {data.userId}</span>
            <span>{data.role}</span>
          </div>
        </div>

        <div className="balance-figure">
          <span>DERIVED BALANCE</span>

          <strong>
            {formatMoney(data.balance)}
          </strong>

          <small>
            Calculated from ledger entries
          </small>
        </div>
      </section>

      <section className="metric-row">
        <div className="metric-card neutral-card">
          <span>Account ID</span>

          <strong>{account.id}</strong>

          <small>
            RevertPay account identifier
          </small>
        </div>

        <div className="metric-card credit-card">
          <span>Account Number</span>

          <strong>
            {account.accountNumber}
          </strong>

          <small>
            Assigned ledger account
          </small>
        </div>

        <div className="metric-card neutral-card">
          <span>Owner ID</span>

          <strong>{account.ownerId}</strong>

          <small>Account owner</small>
        </div>
      </section>

      <section className="metric-row">
        <div className="metric-card credit-card">
          <span>Incoming credits</span>

          <strong>
            {formatMoney(credits)}
          </strong>

          <small>
            All recorded CREDIT entries
          </small>
        </div>

        <div className="metric-card debit-card">
          <span>Outgoing debits</span>

          <strong>
            {formatMoney(debits)}
          </strong>

          <small>
            All recorded DEBIT entries
          </small>
        </div>

        <div className="metric-card neutral-card">
          <span>Ledger records</span>

          <strong>{ledger.length}</strong>

          <small>
            Immutable transaction entries
          </small>
        </div>
      </section>

      <section className="ledger-panel">
        <div className="panel-heading">
          <div>
            <p className="micro-label">
              IMMUTABLE RECORDS
            </p>

            <h2>My ledger history</h2>
          </div>

          <span className="record-count">
            {ledger.length} entries
          </span>
        </div>

        <LedgerTable ledger={ledger} />
      </section>
    </div>
  );
}

export default MyAccount;