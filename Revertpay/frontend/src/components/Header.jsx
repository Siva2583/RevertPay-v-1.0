
function Header({ page }) {
  const titles = {
    overview: [
      "Overview",
      "Monitor account balances and ledger activity.",
    ],

    accounts: [
      "Account lookup",
      "Inspect a ledger account and its immutable entries.",
    ],

    create: [
      "Create account",
      "Provision a new account in the ledger workspace.",
    ],

    transfer: [
      "Ledger transfer",
      "Move funds through a balanced double-entry record.",
    ],

    escrow: [
      "Initiate payment",
      "Review seller, item, and amount before confirmation.",
    ],

    "seller-escrows": [
      "Seller Escrows",
      "Review incoming payments and ship funded orders.",
    ],
    "buyer-escrows": [
      "My Escrows",
      "Track your purchases and confirm delivered orders.",
    ],
    "my-account": [
      "My Account",
      "View your RevertPay identity, account, balance, and ledger activity.",
    ],

  };
  return (
    <header className="topbar">
      <div>
        <p className="breadcrumb">
          REVERTPAY / {page.toUpperCase()}
        </p>

        <h1>{titles[page][0]}</h1>

        <span>{titles[page][1]}</span>
      </div>

      <div className="topbar-status">
        <span className="pulse-dot" />
        Secure session
      </div>
    </header>
  );
}

export default Header;