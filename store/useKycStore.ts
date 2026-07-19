// store/useKycStore.ts
//
// Tracks progress through the "Open a GTBank Account" (KYC) flow.
// This needs to be a store, not local component state, because the
// requirements screen needs to still know what's done after the user
// has navigated away to date-of-birth/bvn-nin/address/identity and
// come back — plain useState would reset every time you left the screen.

import { create } from 'zustand';

interface KycStore {
  dateOfBirthDone: boolean;
  bvnNinDone: boolean;
  addressDone: boolean;
  identityDone: boolean;
  dob: string | null;

  markDateOfBirthDone: (dob: string) => void;
  markBvnNinDone: () => void;
  markAddressDone: () => void;
  markIdentityDone: () => void;
  reset: () => void;
}

export const useKycStore = create<KycStore>((set) => ({
  dateOfBirthDone: false,
  bvnNinDone: false,
  addressDone: false,
  identityDone: false,
  dob: null,

  markDateOfBirthDone: (dob) => set({ dateOfBirthDone: true, dob }),
  markBvnNinDone: () => set({ bvnNinDone: true }),
  markAddressDone: () => set({ addressDone: true }),
  markIdentityDone: () => set({ identityDone: true }),

  // Handy if the user logs out or restarts the account-opening flow.
  reset: () =>
    set({
      dateOfBirthDone: false,
      bvnNinDone: false,
      addressDone: false,
      identityDone: false,
      dob: null,
    }),
}));