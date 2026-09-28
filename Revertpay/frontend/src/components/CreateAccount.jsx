import { useState } from "react";
import Icon from "./Icon";
import API from "../services/api";
import {
  formatMoney,
  readResponse,
} from "../utils/formatters";

function EscrowInitiate({ token, setToast }) {
  const [sellerAccountNumber, setSellerAccountNumber] =
    useState("");

  const [itemName, setItemName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        API.escrowInitiate,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": `escrow-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,
          },

          body: JSON.stringify({
            sellerAccountNumber:
              sellerAccountNumber.trim(),

            itemName: itemName.trim(),

            amount: Number(amount),
          }),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        setToast({
          type: "error",
          title: "Escrow initiation failed",

          message:
            typeof data === "string"
              ? data
              : data.message ||
                "The escrow request could not be initiated.",
        });

        return;
      }

      setResult(data);

      setToast({
        type: "success",
        title: "Payment initiated",
        message:
          "Review the seller, item, and amount before confirming.",
      });

      setSellerAccountNumber("");
      setItemName("");
      setAmount("");
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
    <div className="create-layout">
      <section className="create-intro">
        <p className="micro-label">
          ESCROW PAYMENT
        </p>

        <h2>
          Review a payment before funding.
        </h2>

        <p>
          Start an escrow transaction by selecting the
          seller, item, and amount. The payment remains
          in PAYMENT_INITIATED until the buyer confirms
          or declines it.
        </p>

        <div className="creation-rules">
          <div>
            <span>01</span>

            <p>
              <strong>Authenticated buyer</strong>

              <small>
                Your buyer identity comes from the JWT
                session.
              </small>
            </p>
          </div>

          <div>
            <span>02</span>

            <p>
              <strong>Seller verification</strong>

              <small>
                The selected user must have the SELLER
                role.
              </small>
            </p>
          </div>

          <div>
            <span>03</span>

            <p>
              <strong>
                Review before confirmation
              </strong>

              <small>
                No funds move while the payment is
                initiated.
              </small>
            </p>
          </div>
        </div>
      </section>

      <section className="create-form-card">
        <div className="panel-heading">
          <div>
            <p className="micro-label">
              NEW ESCROW
            </p>

            <h2>Initiate payment</h2>
          </div>

          <div className="form-badge">
            STEP 01
          </div>
        </div>

        <form onSubmit={submit}>
          <label>Seller account number</label>

          <input
            placeholder="Example: ACC21"
            value={sellerAccountNumber}
            onChange={(e) =>
              setSellerAccountNumber(
                e.target.value.toUpperCase()
              )
            }
            required
          />

          <label>Item name</label>

          <input
            type="text"
            placeholder="Example: iPhone 15"
            value={itemName}
            onChange={(e) =>
              setItemName(e.target.value)
            }
            required
          />

          <label>Payment amount</label>

          <div className="amount-input">
            <span>₹</span>

            <input
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              required
            />
          </div>

          <button
            className="form-submit"
            disabled={loading}
          >
            {loading
              ? "Initiating payment..."
              : "Initiate escrow payment"}

            <Icon name="shield" size={18} />
          </button>
        </form>

        {result && (
          <div className="page-alert">
            <strong>Payment initiated</strong>
            <br />

            Seller:{" "}
            {result.sellerName ||
              result.sellername ||
              "—"}

            <br />

            Item: {result.itemName || "—"}

            <br />

            Amount: {formatMoney(result.amount)}

            <br />

            Status: {result.status || "—"}

            <br />

            Escrow ID:{" "}
            {result.escrowId ||
              result.escrowid ||
              "—"}
          </div>
        )}
      </section>
    </div>
  );
}

export default EscrowInitiate;