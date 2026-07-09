// types/index.ts
//
// TypeScript definitions for the main data shapes in the app.
// Think of these as "contracts" — if a Transaction has these fields,
// every screen that touches a transaction knows exactly what to expect.
// No guessing, no "what did this field hold again?".

// A single entry in the transaction list
export interface Transaction {
  id: string;
  merchantName: string;       // "Walmart", "Netflix", "Maria Charles"
  category: string;           // "Groceries", "Entertainment", "Card transfer"
  amount: number;             // Always a positive number — we use `type` to show + or -
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'declined';
  date: string;               // ISO format: "2024-05-15T10:30:00Z"
  logoUrl?: string;           // Optional — not every merchant has a logo
  reference?: string;         // Optional transaction reference number
  bankName?: string;          // Optional — useful for transfer transactions
}

// The logged-in user's profile
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  accountNumber: string;
  avatarUrl?: string;
  tier: 1 | 2 | 3;           // GTBank account tier
}

// The user's main bank account details
export interface BankAccount {
  accountNumber: string;
  accountName: string;
  bankName: string;
  balance: number;
}

// The user's physical/virtual debit card
export interface DebitCard {
  id: string;
  maskedNumber: string;       // "2342 4564 8765 4782"
  expiryDate: string;         // "01/21"
  cvv: string;
  balance: number;
  isFrozen: boolean;
  monthlyLimit: number;
  monthlySpent: number;
}

// The data we send when initiating a transfer
export interface TransferPayload {
  recipientAccountNumber: string;
  recipientName: string;
  recipientBank: string;
  amount: number;
  narration?: string;
}

// Query params passed to the transfer confirm screen via navigation
export interface TransferConfirmParams {
  recipientName: string;
  recipientAccount: string;
  recipientBank: string;
  amount: string;
  fee: string;
  reference: string;
}