import { create } from 'zustand';
import { Transaction, BankAccount, DebitCard } from '../types';
import { mockAccount, mockTransactions, mockCard } from '../constants/mockData';

interface AccountStore {
  account: BankAccount | null;
  transactions: Transaction[];
  card: DebitCard | null;
  balanceHidden: boolean;
  loading: boolean;
  addTransaction: (transaction: Transaction) => void;
  deductBalance: (amount: number) => void;
  setAccount: (account: BankAccount) => void;
  setTransactions: (transactions: Transaction[]) => void;
  toggleBalance: () => void;
  toggleCardFreeze: () => void;
  loadMockData: () => void;
}

export const useAccountStore = create<AccountStore>((set) => ({
  account: mockAccount,
  transactions: mockTransactions,
  card: mockCard,
  balanceHidden: false,
  loading: false,

  // Adds a new transaction to the TOP of the list so it appears
  // immediately in Recent Transactions without a page refresh.
  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  // Subtracts the transfer amount from the displayed balance so the
  // home screen balance updates the moment a transfer completes.
  deductBalance: (amount) =>
    set((state) => ({
      account: state.account
        ? { ...state.account, balance: state.account.balance - amount }
        : null,
    })),

  setAccount: (account) => set({ account }),

  setTransactions: (transactions) => set({ transactions }),

  toggleBalance: () =>
    set((state) => ({ balanceHidden: !state.balanceHidden })),

  toggleCardFreeze: () =>
    set((state) => ({
      card: state.card
        ? { ...state.card, isFrozen: !state.card.isFrozen }
        : null,
    })),

  loadMockData: () =>
    set({
      account: mockAccount,
      transactions: mockTransactions,
      card: mockCard,
    }),
}));