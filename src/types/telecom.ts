export type NetworkType = 'mtn' | 'airtel' | 'glo';

export interface PhoneNumber {
  id: string;
  number: string;
  network: NetworkType;
  isActive: boolean;
}

export interface SubscriptionData {
  airtimeBalance: number;
  dataBalanceMB: number;
  activePlan: string;
  expiryDate: Date;
  lastUpdated: Date;
}

export interface NetworkData {
  numbers: PhoneNumber[];
  subscriptions: Record<string, SubscriptionData>;
}

export type NotificationType = 'low-airtime' | 'low-data' | 'expiry';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  dismissed: boolean;
  timestamp: Date;
}
