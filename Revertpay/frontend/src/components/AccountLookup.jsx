import { useState } from "react";
import Icon from "./Icon";
import AccountSnapshot from "./AccountSnapshot";
import LedgerTable from "./LedgerTable";
import API from "../services/api";
import { readResponse } from "../utils/formatters";

function AccountLookup({ token, setToast, onLoaded }) {
  const [accountNumber, setAccountNumber] = useState("");
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const findAccount = async (event) => {
    event?.preventDefault();

    if (!accountNumber.trim()) {
      setError("Enter an account number first.");
      return;
    }

    setLoading(true);
    setError("");
    setAccount(null);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const number = accountNumber.trim();

      const accountResponse = await fetch(
        API.getAccount(number),
        { headers }
      );

      if (!accountResponse.ok) {
        setError(
          "No account was found with that account number."
        );
        return;
      }

      const accountData =
        await readResponse(accountResponse);

      const [balanceResponse, ledgerResponse] =
        await Promise.all([
          fetch(API.getBalance(number), { headers }),
          fetch(API.getLedger(number), { headers }),
        ]);

      const balanceData = balanceResponse.ok
        ? await readResponse(balanceResponse)
        : 0;

      const ledgerData = ledgerResponse.ok
        ? await readResponse(ledgerResponse)
        : [];

      setAccount(accountData);
      setBalance(balanceData);
      setLedger(
        Array.isArray(ledgerData)
          ? ledgerData
          : []
      );

      onLoaded?.(
        accountData,
        balanceData,
        ledgerData
      );

      setToast({
        type: "success",
        title: "Account loaded",
        message: `Ledger data for ${number} is ready.`,
      });
    } catch {
      setError(
        "Could not connect to the backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lookup-page">
      <section className="lookup-command">
        <div className="lookup-icon">
          <Icon name="search" size={24} />
        </div>

        <div>
          <p className="micro-label">
            ACCOUNT EXPLORER
          </p>

          <h2>Inspect a ledger account.</h2>

          <p>
            Search using the account number assigned by
            RevertPay.
          </p>
        </div>

        <form
          onSubmit={findAccount}
          className="lookup-form"
        >
          <input
            placeholder="Example: ACC1001"
            value={accountNumber}
            onChange={(e) =>
              setAccountNumber(e.target.value)
            }
          />

          <button disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
      </section>

      {error && (
        <div className="page-alert">{error}</div>
      )}

      {!account &&
        !loading &&
        !error && (
          <section className="lookup-placeholder">
            <div className="scanner-line" />

            <Icon name="wallet" size={34} />

            <h3>Ready for account lookup</h3>

            <p>
              Search an account number to reveal its
              derived balance, ledger totals, and
              transaction records.
            </p>
          </section>
        )}

      {account && (
        <div className="loaded-account">
          <AccountSnapshot
            account={account}
            balance={balance}
            ledger={ledger}
          />

          <section className="ledger-panel">
            <div className="panel-heading">
              <div>
                <p className="micro-label">
                  IMMUTABLE RECORDS
                </p>

                <h2>Complete ledger history</h2>
              </div>

              <span className="record-count">
                {ledger.length} entries
              </span>
            </div>

            <LedgerTable ledger={ledger} />
          </section>
        </div>
      )}
    </div>
  );
}

export default AccountLookup;