import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import Icon from "./Icon";
import {
  formatMoney,
  formatDate,
  readResponse,
} from "../utils/formatters";

function BuyerEscrows({ token, setToast }) {
  const [escrows, setEscrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmingId, setConfirmingId] = useState(null);

  // Dispute state
  const [disputeId, setDisputeId] = useState(null);
  const [disputeReason, setDisputeReason] =
    useState("ITEM_NOT_RECEIVED");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputingId, setDisputingId] = useState(null);

  const loadEscrows = async () => {
    setLoading(true);

    try {
      const response = await fetch(API.buyerEscrows, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Could not load buyer escrows."
        );
      }

      setEscrows(Array.isArray(data) ? data : []);
    } catch (error) {
      setToast({
        type: "error",
        title: "Could not load escrows",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadEscrows();
    }
  }, [token]);

  const confirmDelivery = async (id) => {
    setConfirmingId(id);

    try {
      const response = await fetch(
        `/api/escrow/${id}/confirm-delivery`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Could not confirm delivery."
        );
      }

      setToast({
        type: "success",
        title: "Delivery confirmed",
        message: "Payment has been released to the seller.",
      });

      await loadEscrows();
    } catch (error) {
      setToast({
        type: "error",
        title: "Confirmation failed",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setConfirmingId(null);
    }
  };

  const raiseDispute = async (id) => {
    if (!disputeDescription.trim()) {
      setToast({
        type: "error",
        title: "Description required",
        message: "Please describe the issue before submitting the dispute.",
      });
      return;
    }

    setDisputingId(id);

    try {
      const response = await fetch(API.raiseDispute(id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: disputeReason,
          description: disputeDescription.trim(),
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          typeof data === "string"
            ? data
            : data.message || "Could not raise the dispute."
        );
      }

      setToast({
        type: "success",
        title: "Dispute raised",
        message: "The escrow has been moved to review.",
      });

      setDisputeId(null);
      setDisputeReason("ITEM_NOT_RECEIVED");
      setDisputeDescription("");

      await loadEscrows();
    } catch (error) {
      setToast({
        type: "error",
        title: "Dispute failed",
        message: error.message || "Something went wrong.",
      });
    } finally {
      setDisputingId(null);
    }
  };

  const summary = useMemo(
    () => ({
      total: escrows.length,

      shipped: escrows.filter(
        (item) => item.status === "SHIPPED"
      ).length,

      released: escrows.filter(
        (item) => item.status === "RELEASED"
      ).length,

      active: escrows.filter((item) =>
        [
          "CREATED",
          "FUNDED",
          "SHIPPED",
          "UNDER_REVIEW",
        ].includes(item.status)
      ).length,
    }),
    [escrows]
  );

  if (loading) {
    return (
      <section className="seller-page">
        <div className="seller-loading">
          <div className="seller-loading-mark">
            <Icon name="shield" size={24} />
          </div>

          <p className="micro-label">BUYER WORKSPACE</p>

          <h2>Loading your escrow orders...</h2>

          <span>
            Fetching purchases linked to your account.
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="seller-page">

      {/* PAGE HEADER */}
      <div className="seller-dashboard-head">
        <div>
          <p className="micro-label">BUYER WORKSPACE</p>

          <h2>My escrow orders</h2>

          <p>
            Track your purchases, delivery status, and protected
            payments.
          </p>
        </div>

        <button
          className="seller-refresh"
          onClick={loadEscrows}
        >
          <Icon name="activity" size={17} />
          Refresh
        </button>
      </div>

      {/* SUMMARY */}
      <div className="seller-stats">

        <div className="seller-stat-card">
          <span>Total orders</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="seller-stat-card">
          <span>Awaiting delivery</span>
          <strong>{summary.shipped}</strong>
        </div>

        <div className="seller-stat-card">
          <span>Released</span>
          <strong>{summary.released}</strong>
        </div>

        <div className="seller-stat-card">
          <span>Active</span>
          <strong>{summary.active}</strong>
        </div>

      </div>

      {/* EMPTY STATE */}
      {escrows.length === 0 ? (
        <div className="seller-empty">
          <div className="seller-empty-icon">
            <Icon name="shield" size={24} />
          </div>

          <h3>No escrow orders yet</h3>

          <p>
            Your purchases will appear here once you initiate
            an escrow payment.
          </p>
        </div>
      ) : (

        /* ORDER LIST */
        <div className="seller-order-list">

          {escrows.map((escrow) => {

            const escrowId =
              escrow.id ?? escrow.escrowid;

            const sellerName =
              escrow.seller?.name ||
              escrow.sellerName ||
              escrow.seller?.email ||
              "Unknown seller";

            const sellerEmail =
              escrow.seller?.email || "";

            const status =
              escrow.status || "UNKNOWN";

            const statusClass = status
              .toLowerCase()
              .replaceAll("_", "-");

            return (
              <article
                className="seller-order-card"
                key={escrowId}
              >

                {/* MAIN ORDER INFORMATION */}
                <div className="seller-order-main">

                  <div className="seller-order-icon">
                    <Icon name="shield" size={20} />
                  </div>

                  <div className="seller-order-info">

                    <div className="seller-order-topline">

                      <span className="seller-order-id">
                        ESCROW #{escrowId}
                      </span>

                      <span
                        className={`seller-status ${statusClass}`}
                      >
                        {status.replaceAll("_", " ")}
                      </span>

                    </div>

                    <h3>
                      {escrow.itemName || "Escrow item"}
                    </h3>

                    <p>
                      Seller: {sellerName}

                      {sellerEmail &&
                        ` • ${sellerEmail}`}
                    </p>

                  </div>

                  <div className="seller-order-amount">
                    <span>Amount</span>

                    <strong>
                      {formatMoney(escrow.amount)}
                    </strong>
                  </div>

                </div>

                {/* ORDER TIMELINE */}
                <div className="seller-order-meta">

                  <div>
                    <span>Created</span>

                    <strong>
                      {formatDate(escrow.createdAt)}
                    </strong>
                  </div>

                  {escrow.shippedAt && (
                    <div>
                      <span>Shipped</span>

                      <strong>
                        {formatDate(escrow.shippedAt)}
                      </strong>
                    </div>
                  )}

                  {status === "SHIPPED" &&
                    escrow.autoReleaseAt && (
                      <div>
                        <span>Auto release</span>

                        <strong>
                          {formatDate(
                            escrow.autoReleaseAt
                          )}
                        </strong>
                      </div>
                    )}

                  {status === "RELEASED" &&
                    escrow.resolvedAt && (
                      <div>
                        <span>Released</span>

                        <strong>
                          {formatDate(
                            escrow.resolvedAt
                          )}
                        </strong>
                      </div>
                    )}

                </div>

                {/* SHIPPED → RELEASE OR DISPUTE */}
                {status === "SHIPPED" && (
                  <div className="seller-order-action">

                    <div>
                      <strong>
                        Order delivered?
                      </strong>

                      <span>
                        Confirm delivery to release
                        the payment to the seller.
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="seller-ship-button"
                        onClick={() =>
                          setDisputeId(
                            disputeId === escrowId
                              ? null
                              : escrowId
                          )
                        }
                        disabled={
                          confirmingId === escrowId ||
                          disputingId === escrowId
                        }
                      >
                        <Icon
                          name="shield"
                          size={17}
                        />

                        Raise Dispute
                      </button>

                      <button
                        className="seller-ship-button"
                        onClick={() =>
                          confirmDelivery(escrowId)
                        }
                        disabled={
                          confirmingId === escrowId ||
                          disputingId === escrowId
                        }
                      >
                        <Icon
                          name="check"
                          size={17}
                        />

                        {confirmingId === escrowId
                          ? "Confirming..."
                          : "Confirm Delivery"}
                      </button>
                    </div>

                  </div>
                )}

                {/* DISPUTE FORM */}
                {status === "SHIPPED" &&
                  disputeId === escrowId && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "20px",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.025)",
                      }}
                    >
                      <div style={{ marginBottom: "14px" }}>
                        <strong>
                          Raise a dispute
                        </strong>

                        <p
                          style={{
                            marginTop: "5px",
                            opacity: 0.7,
                          }}
                        >
                          Tell us what went wrong with this
                          order.
                        </p>
                      </div>

                      <div style={{ marginBottom: "12px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                          }}
                        >
                          Reason
                        </label>

                        <select
                          value={disputeReason}
                          onChange={(event) =>
                            setDisputeReason(
                              event.target.value
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                          }}
                        >
                          <option value="ITEM_NOT_RECEIVED">
                            Item not received
                          </option>

                          <option value="ITEM_NOT_AS_DESCRIBED">
                            Item not as described
                          </option>

                          <option value="DAMAGED_ITEM">
                            Damaged item
                          </option>

                          <option value="WRONG_ITEM">
                            Wrong item
                          </option>

                          <option value="COUNTERFEIT_ITEM">
                            Counterfeit item
                          </option>

                          <option value="SELLER_ISSUE">
                            Seller issue
                          </option>

                          <option value="OTHER">
                            Other
                          </option>
                        </select>
                      </div>

                      <div style={{ marginBottom: "14px" }}>
                        <label
                          style={{
                            display: "block",
                            marginBottom: "6px",
                          }}
                        >
                          Description
                        </label>

                        <textarea
                          value={disputeDescription}
                          onChange={(event) =>
                            setDisputeDescription(
                              event.target.value
                            )
                          }
                          placeholder="Describe the issue..."
                          rows={4}
                          style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "8px",
                            resize: "vertical",
                            boxSizing: "border-box",
                          }}
                        />
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <button
                          className="seller-ship-button"
                          onClick={() =>
                            setDisputeId(null)
                          }
                          disabled={
                            disputingId === escrowId
                          }
                        >
                          Cancel
                        </button>

                        <button
                          className="seller-ship-button"
                          onClick={() =>
                            raiseDispute(escrowId)
                          }
                          disabled={
                            disputingId === escrowId
                          }
                        >
                          {disputingId === escrowId
                            ? "Submitting..."
                            : "Submit Dispute"}
                        </button>
                      </div>
                    </div>
                  )}

                {/* RELEASED STATE */}
                {status === "RELEASED" && (
                  <div className="seller-shipment-panel">

                    <Icon
                      name="check"
                      size={18}
                    />

                    <div>
                      <strong>
                        Payment released
                      </strong>

                      <span>
                        Delivery was confirmed and
                        the seller has received the
                        escrow funds.
                      </span>
                    </div>

                  </div>
                )}

                {/* FUNDED STATE */}
                {status === "FUNDED" && (
                  <div className="seller-shipment-panel">

                    <Icon
                      name="shield"
                      size={18}
                    />

                    <div>
                      <strong>
                        Payment secured
                      </strong>

                      <span>
                        Your payment is held safely
                        until the seller ships the
                        item.
                      </span>
                    </div>

                  </div>
                )}

                {/* UNDER REVIEW */}
                {status === "UNDER_REVIEW" && (
                  <div className="seller-shipment-panel">

                    <Icon
                      name="shield"
                      size={18}
                    />

                    <div>
                      <strong>
                        Dispute under review
                      </strong>

                      <span>
                        This escrow is currently being
                        reviewed.
                      </span>
                    </div>

                  </div>
                )}

              </article>
            );
          })}

        </div>
      )}

    </section>
  );
}

export default BuyerEscrows;