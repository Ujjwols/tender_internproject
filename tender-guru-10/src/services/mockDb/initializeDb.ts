
import MockDatabase from './MockDatabase';
import { mockCommittees } from '@/mock/committeeData';

export const initializeDb = () => {
  const db = MockDatabase.getInstance();
  
  // Initialize with mock data if empty
  if (!db.getAll('committees') || db.getAll('committees').length === 0) {
    console.log('Initializing database with mock committee data');
    mockCommittees.forEach(committee => {
      db.create('committees', committee);
    });
  }
};
