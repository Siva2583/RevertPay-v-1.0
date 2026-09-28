import { useState } from "react";
import Icon from "./Icon";
import API from "../services/api";
import { readResponse } from "../utils/formatters";

function Transfer({ token, setToast }) {
  const [fromAccount, setFromAccount] =
    useState("");

  const [toAccount, setToAccount] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [referenceId, setReferenceId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const transfer = async (event) => {
    event.preventDefault();

    if (Number(amount) <= 0) {
      setToast({
        type: "error",
        title: "Invalid amount",
        message:
          "Transfer amount must be greater than zero.",
      });

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        API.transfer,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            account1: fromAccount.trim(),
            account2: toAccount.trim(),
            amount: Number(amount),
            referenceId: Number(referenceId),
          }),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        setToast({
          type: "error",
          title: "Transfer rejected",

          message:
            typeof data === "string"
              ? data
              : data.message ||
                "The ledger transfer could not be completed.",
        });

        return;
      }

      setToast({
        type: "success",
        title: "Transfer recorded",
        message:
          "Matching debit and credit entries were created.",
      });

      setFromAccount("");
      setToAccount("");
      setAmount("");
      setReferenceId("");
    } catch {
      setToast({
        type: "error",
        title: "Connection failed",
        message:
          "Cannot reach the backend server.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer-layout-new">
      <section className="transfer-workspace">
        <div className="panel-heading">
          <div>
            <p className="micro-label">
              DOUBLE-ENTRY TRANSFER
            </p>

            <h2>
              Record a fund movement
            </h2>
          </div>

          <div className="transfer-live">
            <span />
            Ready
          </div>
        </div>

        <form
          onSubmit={transfer}
          className="transfer-form-new"
        >
          <div className="account-flow">
            <div className="flow-field">
              <label>Debit from</label>

              <input
                placeholder="Source account number"
                value={fromAccount}
                onChange={(e) =>
                  setFromAccount(
                    e.target.value.toUpperCase()
                  )
                }
                required
              />

              <small>
                Source receives a DEBIT entry
              </small>
            </div>

            <div className="flow-arrow">
              <Icon
                name="arrows"
                size={22}
              />
            </div>

            <div className="flow-field">
              <label>Credit to</label>

              <input
                placeholder="Destination account number"
                value={toAccount}
                onChange={(e) =>
                  setToAccount(
                    e.target.value.toUpperCase()
                  )
                }
                required
              />

              <small>
                Destination receives a CREDIT entry
              </small>
            </div>
          </div>

          <div className="transfer-input-grid">
            <div>
              <label>Transfer amount</label>

              <div className="amount-input">
                <span>₹</span>

                <input
                  type="number"
                  min="1"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) =>
                    setAmount(e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div>
              <label>Reference ID</label>

              <input
                type="number"
                min="1"
                placeholder="Transaction reference"
                value={referenceId}
                onChange={(e) =>
                  setReferenceId(
                    e.target.value
                  )
                }
                required
              />
            </div>
          </div>

          <button
            className="transfer-submit"
            disabled={loading}
          >
            {loading
              ? "Recording transfer..."
              : "Record balanced transfer"}

            <Icon
              name="arrows"
              size={18}
            />
          </button>
        </form>
      </section>

      <aside className="transfer-proof">
        <p className="micro-label">
          LEDGER GUARANTEE
        </p>

        <h2>
          One transfer.
          <br />
          Two records.
        </h2>

        <div className="proof-diagram">
          <div className="proof-node debit-node">
            <span>DEBIT</span>
            <strong>Source</strong>
          </div>

          <div className="proof-line">
            <i />
            <span>same amount</span>
          </div>

          <div className="proof-node credit-node">
            <span>CREDIT</span>
            <strong>Destination</strong>
          </div>
        </div>

        <div className="proof-note">
          <Icon name="shield" size={18} />

          <p>
            The total debit and total credit amount must
            always remain equal.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default Transfer;