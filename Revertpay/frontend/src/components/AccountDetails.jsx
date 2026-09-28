// import { useState } from "react";
//
// function AccountDetails({ token }) {
//
//   const [accountNumber, setAccountNumber] = useState("");
//   const [account, setAccount] = useState(null);
//   const [balance, setBalance] = useState(null);
//   const [ledger, setLedger] = useState([]);
//
//   const [message, setMessage] = useState("");
//
//   const findAccount = async () => {
//
//     if (!accountNumber.trim()) {
//       setMessage("Enter an account number");
//       return;
//     }
//
//     setMessage("");
//
//     try {
//
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
//         setAccount(null);
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
//       const balanceData = await balanceResponse.json();
//
//       const ledgerResponse = await fetch(
//         `/api/accounts/${accountNumber}/ledger`,
//         { headers }
//       );
//
//       const ledgerData = ledgerResponse.ok
//         ? await ledgerResponse.json()
//         : [];
//
//       setAccount(accountData);
//       setBalance(balanceData);
//       setLedger(ledgerData);
//
//     } catch {
//
//       setMessage("Could not connect to server");
//
//     }
//   };
//
//
//   const totalCredit = ledger
//     .filter((entry) => entry.type === "CREDIT")
//     .reduce((sum, entry) => sum + entry.amount, 0);
//
//   const totalDebit = ledger
//     .filter((entry) => entry.type === "DEBIT")
//     .reduce((sum, entry) => sum + entry.amount, 0);
//
//
//   return (
//
//     <div className="page">
//
//       <div className="page-header">
//
//         <p className="eyebrow">ACCOUNT OVERVIEW</p>
//
//         <h1>Account Details</h1>
//
//         <p>
//           Search an account to view its balance and ledger activity.
//         </p>
//
//       </div>
//
//
//       <div className="account-search">
//
//         <input
//           placeholder="Enter account number"
//           value={accountNumber}
//           onChange={(e) => setAccountNumber(e.target.value)}
//         />
//
//         <button
//           className="primary-btn"
//           onClick={findAccount}
//         >
//           Search Account
//         </button>
//
//       </div>
//
//
//       {message && (
//         <div className="message">
//           {message}
//         </div>
//       )}
//
//
//       {account && (
//
//         <>
//
//           <div className="account-summary">
//
//             <div className="summary-main">
//
//               <span>ACCOUNT NUMBER</span>
//
//               <h2>{account.accountNumber}</h2>
//
//               <p>
//                 Owner ID: {account.ownerId}
//               </p>
//
//               <p>
//                 Owner Type: {account.ownerType}
//               </p>
//
//             </div>
//
//
//             <div className="balance-box">
//
//               <span>CURRENT BALANCE</span>
//
//               <h2>
//                 ₹ {balance}
//               </h2>
//
//             </div>
//
//           </div>
//
//
//           <div className="stats-grid">
//
//             <div className="stat-card">
//
//               <span>Total Credit</span>
//
//               <h2 className="credit">
//                 ₹ {totalCredit}
//               </h2>
//
//             </div>
//
//
//             <div className="stat-card">
//
//               <span>Total Debit</span>
//
//               <h2 className="debit">
//                 ₹ {totalDebit}
//               </h2>
//
//             </div>
//
//
//             <div className="stat-card">
//
//               <span>Transactions</span>
//
//               <h2>
//                 {ledger.length}
//               </h2>
//
//             </div>
//
//           </div>
//
//
//           <div className="ledger-section">
//
//             <div className="section-title">
//
//               <div>
//
//                 <p className="eyebrow">
//                   TRANSACTION HISTORY
//                 </p>
//
//                 <h2>
//                   Ledger Entries
//                 </h2>
//
//               </div>
//
//             </div>
//
//
//             {ledger.length === 0 ? (
//
//               <div className="empty-state">
//
//                 No transactions found for this account.
//
//               </div>
//
//             ) : (
//
//               <div className="ledger-table">
//
//                 <div className="ledger-head">
//
//                   <span>Type</span>
//
//                   <span>Amount</span>
//
//                   <span>Reference ID</span>
//
//                   <span>Date</span>
//
//                 </div>
//
//
//                 {ledger.map((entry) => (
//
//                   <div
//                     className="ledger-row"
//                     key={entry.id}
//                   >
//
//                     <span
//                       className={
//                         entry.type === "CREDIT"
//                           ? "credit badge"
//                           : "debit badge"
//                       }
//                     >
//                       {entry.type}
//                     </span>
//
//                     <span>
//                       ₹ {entry.amount}
//                     </span>
//
//                     <span>
//                       {entry.referenceId}
//                     </span>
//
//                     <span>
//                       {entry.createdAt
//                         ? new Date(
//                             entry.createdAt
//                           ).toLocaleString()
//                         : "-"}
//                     </span>
//
//                   </div>
//
//                 ))}
//
//               </div>
//
//             )}
//
//           </div>
//
//         </>
//
//       )}
//
//     </div>
//   );
// }
//
// export default AccountDetails;