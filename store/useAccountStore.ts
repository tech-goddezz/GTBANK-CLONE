// store/useAccountStore.ts
//
// Global state for the user's account — balance, transactions, card details.
// Kept separate from auth because "who you are" and "what you own" are different things.
// This also makes it easy to clear account data on logout without touching auth logic.

import { create } from 'zustand';

import { Transaction, BankAccount, DebitCard } from '../types';
import { mockAccount, mockTransactions, mockCard } from '../constants/mockData';

interface AccountStore {
  account: BankAccount | null;
  transactions: Transaction[];
  card: DebitCard | null;
  balanceHidden: boolean;
  loading: boolean;
  setAccount: (account: BankAccount) => void;
  setTransactions: (transactions: Transaction[]) => void;
  toggleBalance: () => void;
  toggleCardFreeze: () => void;
  loadMockData: () => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  // Pre-loaded with mock data so the dashboard looks real from the first render
  account: mockAccount,
  transactions: mockTransactions,
  card: mockCard,
  balanceHidden: false,
  loading: false,

  setAccount: (account) => set({ account }),

  setTransactions: (transactions) => set({ transactions }),

  // The eye icon on the balance card calls this.
  // We store this globally so if the balance appears in two places,
  // both hide/show together — they stay in sync.
  toggleBalance: () =>
    set((state) => ({ balanceHidden: !state.balanceHidden })),

  // Freeze or unfreeze the card — the toggle on the card management screen calls this.
  // We spread the existing card object and only flip the one field that changed.
  toggleCardFreeze: () =>
    set((state) => ({
      card: state.card
        ? { ...state.card, isFrozen: !state.card.isFrozen }
        : null,
    })),

  // Handy during development — resets everything back to the mock data
  loadMockData: () =>
    set({
      account: mockAccount,
      transactions: mockTransactions,
      card: mockCard,
    }),
}));