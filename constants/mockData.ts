// constants/mockData.ts
//
// Fake but realistic data for building the UI without a real backend.
// Every screen will look alive and populated from day one.
// When the API is ready, we just replace these with real network calls.

import { Transaction, User, BankAccount, DebitCard } from '../types';

export const mockUser: User = {
  id: 'user-001',
  firstName: 'Emmanuel',
  lastName: 'Adeyemi',
  phoneNumber: '+2348051234567',
  accountNumber: '1030737923',
  avatarUrl: 'https://i.pravatar.cc/150?img=12',
  tier: 1,
};

export const mockAccount: BankAccount = {
  accountNumber: '1030737923',
  accountName: 'Emmanuel Adeyemi',
  bankName: 'GTBank',
  balance: 42950.00,
};

export const mockCard: DebitCard = {
  id: 'card-001',
  maskedNumber: '2342 4564 8765 4782',
  expiryDate: '01/21',
  cvv: '654',
  balance: 147000.00,
  isFrozen: false,
  monthlyLimit: 4500.00,
  monthlySpent: 1240.50,
};

// A healthy mix of debits, credits, different statuses, and different dates —
// so we can see every possible UI state without doing any real transactions.
export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    merchantName: 'Walmart',
    category: 'Groceries and supermarkets',
    amount: 50,
    type: 'debit',
    status: 'completed',
    date: new Date().toISOString(),
    logoUrl: 'https://logo.clearbit.com/walmart.com',
  },
  {
    id: 'txn-002',
    merchantName: 'Netflix',
    category: 'Entertainment',
    amount: 10,
    type: 'debit',
    status: 'completed',
    date: new Date().toISOString(),
    logoUrl: 'https://logo.clearbit.com/netflix.com',
  },
  {
    id: 'txn-003',
    merchantName: 'Maria Charles',
    category: 'Card transfer',
    amount: 100,
    type: 'debit',
    status: 'completed',
    date: new Date().toISOString(),
    logoUrl: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: 'txn-004',
    merchantName: 'John Adewale',
    category: 'Card transfer',
    amount: 200,
    type: 'credit',
    status: 'completed',
    // yesterday
    date: new Date(Date.now() - 86400000).toISOString(),
    logoUrl: 'https://i.pravatar.cc/150?img=8',
  },
  {
    id: 'txn-005',
    merchantName: 'Apple Store',
    category: 'Shopping',
    amount: 999,
    type: 'debit',
    status: 'pending',
    date: new Date(Date.now() - 86400000).toISOString(),
    logoUrl: 'https://logo.clearbit.com/apple.com',
  },
  {
    id: 'txn-006',
    merchantName: 'Airbnb',
    category: 'Travel',
    amount: 350,
    type: 'debit',
    status: 'declined',
    date: new Date(Date.now() - 172800000).toISOString(),
    logoUrl: 'https://logo.clearbit.com/airbnb.com',
  },
  {
    id: 'txn-007',
    merchantName: 'Blue Bottle Coffee',
    category: 'Food and drink',
    amount: 15,
    type: 'debit',
    status: 'completed',
    date: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'txn-008',
    merchantName: 'Salary — Devclarity',
    category: 'Income',
    amount: 5000,
    type: 'credit',
    status: 'completed',
    date: new Date(Date.now() - 259200000).toISOString(),
  },
];

// Formats a number as a dollar amount: 42950 → "$42,950.00"
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Turns an ISO date string into something readable.
// Today and yesterday get special labels — everything else gets a short date.
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};