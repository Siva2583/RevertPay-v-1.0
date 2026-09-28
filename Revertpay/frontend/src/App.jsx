import { useEffect, useState } from "react";
import "./App.css";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Overview from "./components/Overview";
import AccountLookup from "./components/AccountLookup";
import CreateAccount from "./components/CreateAccount";
import Transfer from "./components/Transfer";
import EscrowInitiate from "./components/EscrowInitiate";
import MyAccount from "./components/MyAccount";
import Toast from "./components/Toast";
import SellerEscrows from "./components/SellerEscrows";
import BuyerEscrows from "./components/BuyerEscrows";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [page, setPage] = useState("overview");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => setToast(null), 4500);

    return () => clearTimeout(timer);
  }, [toast]);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setPage("overview");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPage("overview");
  };

  if (!token) {
    return <AuthScreen onLogin={login} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        setPage={setPage}
        logout={logout}
      />

      <main className="main-workspace">
        <Header page={page} />

        <div className="workspace-content">
          {page === "overview" && (
            <Overview setPage={setPage} />
          )}

          {page === "accounts" && (
            <AccountLookup
              token={token}
              setToast={setToast}
            />
          )}

          {page === "create" && (
            <CreateAccount
              token={token}
              setToast={setToast}
            />
          )}

          {page === "transfer" && (
            <Transfer
              token={token}
              setToast={setToast}
            />
          )}

          {page === "escrow" && (
            <EscrowInitiate
              token={token}
              setToast={setToast}
            />
          )}

          {page === "seller-escrows" && (
            <SellerEscrows
              token={token}
              setToast={setToast}
            />
          )}

          {page === "buyer-escrows" && (
            <BuyerEscrows
              token={token}
              setToast={setToast}
            />
          )}

          {page === "my-account" && (
            <MyAccount token={token} />
          )}
        </div>
      </main>

      <Toast
        toast={toast}
        closeToast={() => setToast(null)}
      />
    </div>
  );
}

export default App;