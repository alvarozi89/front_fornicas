export interface Subscription {
  id: number;
  profile_id: number;
  type: 'FREE_TRIAL' | 'PAID';
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'PENDING';
  start_date: string;
  end_date: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActiveSubscriptionResponse {
  success: boolean;
  data: Subscription | null;
}
