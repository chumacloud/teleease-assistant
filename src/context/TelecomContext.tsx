import React, { createContext, useContext, useState, useCallback } from 'react';
import type { NetworkType, PhoneNumber, SubscriptionData, AppNotification } from '@/types/telecom';

interface TelecomState {
  activeNetwork: NetworkType | null;
  numbers: PhoneNumber[];
  subscriptions: Record<string, SubscriptionData>;
  notifications: AppNotification[];
  isLoading: boolean;
  error: string | null;
}

interface TelecomContextType extends TelecomState {
  setActiveNetwork: (n: NetworkType | null) => void;
  getActiveNumber: () => PhoneNumber | undefined;
  switchNumber: (id: string) => void;
  addNumber: (number: string, network: NetworkType) => void;
  refresh: () => Promise<void>;
  buyAirtime: (amount: number) => Promise<void>;
  buyData: (amountMB: number, plan: string) => Promise<void>;
  shareAirtime: (recipientNumber: string, amount: number) => Promise<void>;
  shareData: (recipientNumber: string, amountMB: number) => Promise<void>;
  dismissNotification: (id: string) => void;
  getSubscription: () => SubscriptionData | undefined;
}

const defaultNumbers: PhoneNumber[] = [
  { id: '1', number: '0803 456 7890', network: 'mtn', isActive: true },
  { id: '2', number: '0701 234 5678', network: 'airtel', isActive: false },
  { id: '3', number: '0805 678 1234', network: 'glo', isActive: false },
];

function makeSub(overrides?: Partial<SubscriptionData>): SubscriptionData {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + Math.floor(Math.random() * 5) + 1);
  return {
    airtimeBalance: 1250.5,
    dataBalanceMB: 2560,
    activePlan: '2GB Weekly Plan',
    expiryDate: expiry,
    lastUpdated: new Date(),
    ...overrides,
  };
}

const defaultSubs: Record<string, SubscriptionData> = {
  '1': makeSub(),
  '2': makeSub({ airtimeBalance: 150, dataBalanceMB: 380, activePlan: '1GB Daily Plan' }),
  '3': makeSub({ airtimeBalance: 820, dataBalanceMB: 1800, activePlan: '3GB Weekly Plan' }),
};

const TelecomContext = createContext<TelecomContextType | null>(null);

export function TelecomProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TelecomState>({
    activeNetwork: null,
    numbers: defaultNumbers,
    subscriptions: defaultSubs,
    notifications: [],
    isLoading: false,
    error: null,
  });

  const setActiveNetwork = (n: NetworkType | null) =>
    setState((s) => {
      const networkNums = s.numbers.filter((num) => num.network === n);
      const hasActive = networkNums.some((num) => num.isActive);
      const numbers = hasActive
        ? s.numbers
        : s.numbers.map((num) =>
            num.network === n && num.id === networkNums[0]?.id
              ? { ...num, isActive: true }
              : num,
          );
      return { ...s, activeNetwork: n, numbers, error: null };
    });

  const getActiveNumber = useCallback(
    () => state.numbers.find((n) => n.isActive && n.network === state.activeNetwork),
    [state.numbers, state.activeNetwork],
  );

  const switchNumber = (id: string) =>
    setState((s) => ({
      ...s,
      numbers: s.numbers.map((n) =>
        n.network === s.activeNetwork ? { ...n, isActive: n.id === id } : n,
      ),
    }));

  const addNumber = (number: string, network: NetworkType) => {
    const id = Date.now().toString();
    const newNum: PhoneNumber = { id, number, network, isActive: false };
    setState((s) => ({
      ...s,
      numbers: [...s.numbers, newNum],
      subscriptions: { ...s.subscriptions, [id]: makeSub() },
    }));
  };

  const generateNotifications = (sub: SubscriptionData): AppNotification[] => {
    const notes: AppNotification[] = [];
    const now = new Date();
    if (sub.airtimeBalance < 200)
      notes.push({ id: `la-${now.getTime()}`, type: 'low-airtime', message: `Low airtime balance: ₦${sub.airtimeBalance.toFixed(0)}`, dismissed: false, timestamp: now });
    if (sub.dataBalanceMB < 500)
      notes.push({ id: `ld-${now.getTime()}`, type: 'low-data', message: `Low data balance: ${(sub.dataBalanceMB / 1024).toFixed(1)}GB`, dismissed: false, timestamp: now });
    const daysLeft = Math.ceil((sub.expiryDate.getTime() - now.getTime()) / 86400000);
    if (daysLeft <= 2)
      notes.push({ id: `ex-${now.getTime()}`, type: 'expiry', message: `Plan expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`, dismissed: false, timestamp: now });
    return notes;
  };

  const refresh = async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    await new Promise((r) => setTimeout(r, 1000));
    if (Math.random() < 0.1) {
      setState((s) => ({ ...s, isLoading: false, error: 'Network error. Please try again.' }));
      return;
    }
    setState((s) => {
      const active = s.numbers.find((n) => n.isActive && n.network === s.activeNetwork);
      if (!active) return { ...s, isLoading: false };
      const old = s.subscriptions[active.id];
      const jitter = () => 1 + (Math.random() - 0.5) * 0.1;
      const updated: SubscriptionData = {
        ...old,
        airtimeBalance: +(old.airtimeBalance * jitter()).toFixed(2),
        dataBalanceMB: Math.round(old.dataBalanceMB * jitter()),
        lastUpdated: new Date(),
      };
      const notifs = generateNotifications(updated);
      return {
        ...s,
        isLoading: false,
        subscriptions: { ...s.subscriptions, [active.id]: updated },
        notifications: [...notifs, ...s.notifications.filter((n) => n.dismissed)],
      };
    });
  };

  const buyAirtime = async (amount: number) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 1500));
    setState((s) => {
      const active = s.numbers.find((n) => n.isActive && n.network === s.activeNetwork);
      if (!active) return { ...s, isLoading: false };
      const old = s.subscriptions[active.id];
      return {
        ...s,
        isLoading: false,
        subscriptions: { ...s.subscriptions, [active.id]: { ...old, airtimeBalance: old.airtimeBalance + amount, lastUpdated: new Date() } },
      };
    });
  };

  const buyData = async (amountMB: number, plan: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    await new Promise((r) => setTimeout(r, 1500));
    setState((s) => {
      const active = s.numbers.find((n) => n.isActive && n.network === s.activeNetwork);
      if (!active) return { ...s, isLoading: false };
      const old = s.subscriptions[active.id];
      const expiry = new Date();
      expiry.setDate(expiry.getDate() + 7);
      return {
        ...s,
        isLoading: false,
        subscriptions: { ...s.subscriptions, [active.id]: { ...old, dataBalanceMB: old.dataBalanceMB + amountMB, activePlan: plan, expiryDate: expiry, lastUpdated: new Date() } },
      };
    });
  };

  const dismissNotification = (id: string) =>
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, dismissed: true } : n)),
    }));

  const getSubscription = useCallback(() => {
    const active = state.numbers.find((n) => n.isActive && n.network === state.activeNetwork);
    return active ? state.subscriptions[active.id] : undefined;
  }, [state.numbers, state.activeNetwork, state.subscriptions]);

  return (
    <TelecomContext.Provider
      value={{ ...state, setActiveNetwork, getActiveNumber, switchNumber, addNumber, refresh, buyAirtime, buyData, dismissNotification, getSubscription }}
    >
      {children}
    </TelecomContext.Provider>
  );
}

export function useTelecom() {
  const ctx = useContext(TelecomContext);
  if (!ctx) throw new Error('useTelecom must be used within TelecomProvider');
  return ctx;
}
