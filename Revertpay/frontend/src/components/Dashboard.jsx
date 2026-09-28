// import { useState } from "react";
//
// function Dashboard({ token, setPage }) {
//   const [accountNumber, setAccountNumber] = useState("");
//   const [account, setAccount] = useState(null);
//   const [balance, setBalance] = useState(null);
//   const [ledger, setLedger] = useState([]);
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//
//   const findAccount = async () => {
//     if (!accountNumber.trim()) {
//       setMessage("Enter an account number");
//       return;
//     }
//
//     setLoading(true);
//     setMessage("");
//     setAccount(null);
//     setBalance(null);
//     setLedger([]);
//
//     try {
//       const headers = {
//         Authorization: `Bearer ${token}`,
//       };
//
//       const accountResponse = await fetch(
//         `/api/accounts/${accountNumber}`,
//         { headers }
//       );
//
//       if (!accountResponse.ok) {
//         setMessage("Account not found");
//         setLoading(false);
//         return;
//       }
//
//       const accountData = await accountResponse.json();
//
//       const balanceResponse = await fetch(
//         `/api/accounts/${accountNumber}/balance`,
//         { headers }
//       );
//
//       let balanceData = 0;
//
//       if (balanceResponse.ok) {
//         balanceData = await balanceResponse.json();
//       }
//
//       const ledgerResponse = await fetch(
//         `/api/accounts/${accountNumber}/ledger`,
//         { headers }
//       );
//
//       let ledgerData = [];
//
//       if (ledgerResponse.ok) {
//         ledgerData = await ledgerResponse.json();
//       }
//
//       setAccount(accountData);
//       setBalance(balanceData);
//       setLedger(ledgerData);
//
//     } catch {
//       setMessage("Could not connect to server");
//     }
//
//     setLoading(false);
//   };
//
//   const totalCredit = ledger
//     .filter((entry) => entry.type === "CREDIT")
//     .reduce((sum, entry) => sum + entry.amount, 0);
//
//   const totalDebit = ledger
//     .filter((entry) => entry.type === "DEBIT")
//     .reduce((sum, entry) => sum + entry.amount, 0);
//
//   return (
//     <div className="dashboard-page">
//
//       <section className="dashboard-top">
//
//         <div className="dashboard-title">
//           <p className="dashboard-label">REVERTPAY</p>
//
//           <h1>Account Overview</h1>
//
//           <p>
//             View your account, balance and ledger activity.
//           </p>
//         </div>
//
//         <div className="dashboard-search">
//
//           <input
//             placeholder="Enter account number"
//             value={accountNumber}
//             onChange={(e) => setAccountNumber(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 findAccount();
//               }
//             }}
//           />
//
//           <button
//             className="primary-btn"
//             onClick={findAccount}
//             disabled={loading}
//           >
//             {loading ? "Loading..." : "View Account"}
//           </button>
//
//         </div>
//
//       </section>
//
//
//       {message && (
//         <div className="dashboard-message">
//           {message}
//         </div>
//       )}
//
//
//       {!account && !loading && (
//         <section className="dashboard-empty">
//
//           <div className="empty-icon">
//             ₹
//           </div>
//
//           <h2>No account selected</h2>
//
//           <p>
//             Enter an account number above to view its details
//             and ledger history.
//           </p>
//
//           <div className="empty-actions">
//
//             <button
//               className="primary-btn"
//               onClick={() => setPage("create")}
//             >
//               Create Account
//             </button>
//
//             <button
//               className="secondary-btn"
//               onClick={() => setPage("transfer")}
//             >
//               Transfer Money
//             </button>
//
//           </div>
//
//         </section>
//       )}
//
//
//       {account && (
//         <>
//
//           <section className="account-hero">
//
//             <div>
//
//               <p className="dashboard-label">
//                 ACCOUNT NUMBER
//               </p>
//
//               <h2 className="actual-account-number">
//                 {account.accountNumber}
//               </h2>
//
//               <div className="account-meta">
//
//                 <span>
//                   Owner ID: <strong>{account.ownerId}</strong>
//                 </span>
//
//                 <span>
//                   Type: <strong>{account.ownerType}</strong>
//                 </span>
//
//               </div>
//
//             </div>
//
//
//             <div className="main-balance">
//
//               <span>Current Balance</span>
//
//               <h2>₹ {balance}</h2>
//
//               <p>
//                 Credits − Debits
//               </p>
//
//             </div>
//
//           </section>
//
//
//           <section className="stats-grid">
//
//             <div className="dashboard-stat">
//
//               <span className="stat-label">
//                 Total Credit
//               </span>
//
//               <h2 className="credit-text">
//                 ₹ {totalCredit}
//               </h2>
//
//               <p>
//                 Money received
//               </p>
//
//             </div>
//
//
//             <div className="dashboard-stat">
//
//               <span className="stat-label">
//                 Total Debit
//               </span>
//
//               <h2 className="debit-text">
//                 ₹ {totalDebit}
//               </h2>
//
//               <p>
//                 Money sent
//               </p>
//
//             </div>
//
//
//             <div className="dashboard-stat">
//
//               <span className="stat-label">
//                 Transactions
//               </span>
//
//               <h2>
//                 {ledger.length}
//               </h2>
//
//               <p>
//                 Ledger entries
//               </p>
//
//             </div>
//
//           </section>
//
//
//           <section className="dashboard-ledger">
//
//             <div className="ledger-title">
//
//               <div>
//
//                 <p className="dashboard-label">
//                   TRANSACTION HISTORY
//                 </p>
//
//                 <h2>Recent Ledger Activity</h2>
//
//               </div>
//
//               <button
//                 className="secondary-btn"
//                 onClick={() => setPage("account")}
//               >
//                 Full History
//               </button>
//
//             </div>
//
//
//             {ledger.length === 0 ? (
//
//               <div className="no-ledger">
//                 No transactions yet.
//               </div>
//
//             ) : (
//
//               <div className="dashboard-transactions">
//
//                 {ledger.slice(-5).reverse().map((entry) => (
//
//                   <div
//                     className="transaction-item"
//                     key={entry.id}
//                   >
//
//                     <div className="transaction-left">
//
//                       <div
//                         className={
//                           entry.type === "CREDIT"
//                             ? "transaction-icon credit-icon"
//                             : "transaction-icon debit-icon"
//                         }
//                       >
//                         {entry.type === "CREDIT" ? "+" : "−"}
//                       </div>
//
//                       <div>
//
//                         <strong>
//                           {entry.type}
//                         </strong>
//
//                         <p>
//                           Reference ID: {entry.referenceId}
//                         </p>
//
//                       </div>
//
//                     </div>
//
//
//                     <div
//                       className={
//                         entry.type === "CREDIT"
//                           ? "transaction-amount credit-text"
//                           : "transaction-amount debit-text"
//                       }
//                     >
//
//                       {entry.type === "CREDIT" ? "+" : "-"}
//                       ₹ {entry.amount}
//
//                     </div>
//
//                   </div>
//
//                 ))}
//
//               </div>
//
//             )}
//
//           </section>
//
//         </>
//       )}
//
//     </div>
//   );
// }
//
// export default Dashboard;