import { useState } from "react";
import Logo from "./Logo";
import Icon from "./Icon";
import API from "../services/api";
import { readResponse } from "../utils/formatters";

function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUYER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const isLogin = mode === "login";

      const response = await fetch(
        isLogin ? API.login : API.register,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            isLogin
              ? { email, password }
              : { name, email, password, role }
          ),
        }
      );

      const data = await readResponse(response);

      if (!response.ok) {
        setError(
          typeof data === "string"
            ? data
            : data.message || "Request could not be completed."
        );
        return;
      }

      if (!isLogin) {
        setMode("login");
        setPassword("");
        setName("");
        setError("Account created successfully. Please sign in.");
        return;
      }

      const token =
        typeof data === "string"
          ? data
          : data.token || data.accessToken;

      if (!token) {
        setError(
          "Login succeeded, but the server did not return a token."
        );
        return;
      }

      onLogin(token);
    } catch {
      setError("Cannot reach the RevertPay server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-intro">
        <div className="auth-grid" />

        <div className="intro-content">
          <div className="auth-brand">
            <Logo size={36} />
            <span>RevertPay</span>
          </div>

          <div className="auth-copy">
            <p className="micro-label">
              LEDGER-FIRST ESCROW INFRASTRUCTURE
            </p>

            <h1>
              Payments should be
              <span> provable.</span>
            </h1>

            <p>
              A secure transaction workspace built on immutable
              ledger records, derived balances, and financial
              correctness.
            </p>
          </div>

          <div className="principle-stack">
            <div className="principle">
              <div className="principle-icon">
                <Icon name="book" />
              </div>

              <div>
                <strong>Immutable ledger</strong>
                <span>
                  Every movement is recorded permanently.
                </span>
              </div>
            </div>

            <div className="principle">
              <div className="principle-icon">
                <Icon name="shield" />
              </div>

              <div>
                <strong>Secure access</strong>
                <span>
                  JWT-protected account operations.
                </span>
              </div>
            </div>

            <div className="principle">
              <div className="principle-icon">
                <Icon name="activity" />
              </div>

              <div>
                <strong>Derived balances</strong>
                <span>
                  Credits minus debits — never mutable totals.
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="auth-footer-note">
          RevertPay / Financial transaction workspace
        </p>
      </section>

      <section className="auth-form-panel">
        <div className="auth-form-wrap">
          <div className="mobile-brand">
            <Logo size={34} />
            <strong>RevertPay</strong>
          </div>

          <div className="form-heading">
            <p className="micro-label">
              {mode === "login"
                ? "SECURE SIGN IN"
                : "NEW OPERATOR"}
            </p>

            <h2>
              {mode === "login"
                ? "Welcome back."
                : "Create your workspace."}
            </h2>

            <p>
              {mode === "login"
                ? "Enter your credentials to access your ledger workspace."
                : "Register a role to begin using RevertPay."}
            </p>
          </div>

          {error && (
            <div
              className={`auth-alert ${
                error.includes("successfully")
                  ? "success"
                  : ""
              }`}
            >
              {error}
            </div>
          )}

          <form onSubmit={submit} className="auth-form">
            {mode === "register" && (
              <>
                <label>Full name</label>

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </>
            )}

            <label>Email address</label>

            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              minLength="6"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {mode === "register" && (
              <>
                <label>Workspace role</label>

                <div className="role-options">
                  {["BUYER", "SELLER", "ADMIN"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={
                        role === item ? "selected" : ""
                      }
                      onClick={() => setRole(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </>
            )}

            <button
              className="auth-submit"
              disabled={loading}
            >
              {loading
                ? "Processing..."
                : mode === "login"
                  ? "Enter workspace"
                  : "Create account"}

              <Icon name="chevron" size={18} />
            </button>
          </form>

          <div className="auth-mode-switch">
            {mode === "login"
              ? "New to RevertPay?"
              : "Already have an account?"}

            <button
              type="button"
              onClick={() => {
                setMode(
                  mode === "login" ? "register" : "login"
                );
                setError("");
                setPassword("");
              }}
            >
              {mode === "login"
                ? "Create account"
                : "Sign in"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AuthScreen;