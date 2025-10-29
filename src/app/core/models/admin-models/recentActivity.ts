

export interface RecentActivity {
  action: string;
  time: string;
  type: 'order' | 'stock' | 'user' | 'system';
  timestamp: number;
}