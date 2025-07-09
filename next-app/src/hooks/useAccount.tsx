import { useEffect, useState } from 'react';
import { Account } from '@/types';

export function useAccount() {
  const [account, setAccount] = useState<Account | null>(null);

  useEffect(() => {
    const storedAccount = localStorage.getItem('account');
    if (storedAccount) {
      setAccount(JSON.parse(storedAccount));
    }
  }, []);

  useEffect(() => {
    if (account) {
      localStorage.setItem('account', JSON.stringify(account));
    }
  }, [account]);

  return {
    account,
    setAccount,
  };
}