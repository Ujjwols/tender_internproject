
export interface Activity {
  id: number;
  type: 'tender' | 'committee' | 'vendor' | 'system';
  action: string;
  user: string;
  timestamp: string;
  details?: string;
}

export const mockActivities: Activity[] = [
  {
    id: 1,
    type: 'tender',
    action: 'created',
    user: 'John Admin',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    details: 'New tender for IT equipment'
  },
  {
    id: 2,
    type: 'committee',
    action: 'updated',
    user: 'Sarah Committee',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    details: 'Updated specification review schedule'
  },
  {
    id: 3,
    type: 'vendor',
    action: 'registered',
    user: 'System',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    details: 'New vendor registration: Tech Solutions Ltd'
  }
];
