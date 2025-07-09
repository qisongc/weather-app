"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Account } from '@/types';

type AccountContextType = {
  account: Account | null;
  setAccount: (account: Account | null) => void;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('account');
    if (stored) {
      setAccount(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
    }
    else {
      localStorage.removeItem('account');
    }
  }, [account]);

  return (
    <AccountContext.Provider value={{ account, setAccount }}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) throw new Error('useAccount must be used within AccountProvider');
  return context;
};