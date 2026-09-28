// function Navbar({ page, setPage, logout }) {
//   const navItems = [
//     { key: "dashboard", label: "Dashboard", icon: "📊" },
//     { key: "create", label: "Create Account", icon: "➕" },
//     { key: "account", label: "Accounts", icon: "🏦" },
//     { key: "transfer", label: "Transfer", icon: "🔁" },
//   ];
//
//   return (
//     <nav className="navbar">
//       <div className="nav-brand">
//         <div className="nav-logo">R</div>
//         <span>RevertPay</span>
//       </div>
//
//       <div className="nav-links">
//         {navItems.map((item) => (
//           <button
//             key={item.key}
//             className={page === item.key ? "active" : ""}
//             onClick={() => setPage(item.key)}
//           >
//             <span className="nav-icon">{item.icon}</span>
//             <span className="nav-text">{item.label}</span>
//           </button>
//         ))}
//       </div>
//
//       <button className="logout-btn" onClick={logout}>
//         <span className="nav-icon">⎋</span>
//         <span className="nav-text">Logout</span>
//       </button>
//     </nav>
//   );
// }
//
// export default Navbar;