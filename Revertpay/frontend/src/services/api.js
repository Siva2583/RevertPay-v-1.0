const API = {
  login: "/api/auth/login",
  me: "/api/me",
  register: "/api/auth/register",

  createAccount: "/api/accounts/new",

  getAccount: (accountNumber) =>
    `/api/accounts/${accountNumber}`,

  getBalance: (accountNumber) =>
    `/api/accounts/${accountNumber}/balance`,

  getLedger: (accountNumber) =>
    `/api/accounts/${accountNumber}/ledger`,

  transfer: "/api/auth/transfer",
  sellerEscrows: "/api/escrow/seller",
  buyerEscrows: "/api/escrow/buyer",
  escrowInitiate: "/api/escrow/initiate",
  raiseDispute: (id) => `/api/escrow/${id}/dispute`,
};

export default API;