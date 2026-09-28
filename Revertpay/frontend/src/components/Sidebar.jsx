import Logo from "./Logo";
import Icon from "./Icon";

function Sidebar({ page, setPage, logout }) {
    const items = [
      { key: "overview", label: "Overview", icon: "grid" },
      { key: "accounts", label: "Account lookup", icon: "wallet" },
      { key: "create", label: "Create account", icon: "plus" },
      { key: "transfer", label: "Ledger transfer", icon: "arrows" },
      { key: "escrow", label: "Initiate payment", icon: "shield" },
      { key: "seller-escrows", label: "Seller Escrows", icon: "package" },
      {
        key: "buyer-escrows",
        label: "My Escrows",
        icon: "shield",
      },
      { key: "my-account", label: "My Account", icon: "..." },
    ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo size={38} />

        <div>
          <strong>RevertPay</strong>
          <span>CORE LEDGER</span>
        </div>
      </div>

      <div className="sidebar-section-label">
        WORKSPACE
      </div>

      <nav className="side-nav">
        {items.map((item) => (
          <button
            key={item.key}
            className={page === item.key ? "current" : ""}
            onClick={() => setPage(item.key)}
          >
            <Icon name={item.icon} />

            <span>{item.label}</span>

            {page === item.key && <i />}
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="integrity-box">
          <div className="integrity-dot" />

          <div>
            <span>System status</span>
            <strong>Ledger online</strong>
          </div>
        </div>

        <button className="sign-out" onClick={logout}>
          <Icon name="logout" />
          Sign out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;