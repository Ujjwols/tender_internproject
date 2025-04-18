
import { useState, useEffect } from 'react';
import MockDatabase from '@/services/mockDb/MockDatabase';

export function useMockDb<T>(collection: string, query?: (item: T) => boolean) {
  const [data, setData] = useState<T[]>([]);
  const db = MockDatabase.getInstance();

  const loadData = () => {
    console.log(`Loading data from collection: ${collection}`);
    const result = query 
      ? db.query(collection as any, query)
      : db.getAll(collection as any);
    console.log(`Data loaded from ${collection}:`, result);
    setData(result as T[]);
  };

  useEffect(() => {
    console.log(`useMockDb hook initializing for collection: ${collection}`);
    loadData();

    const handleStorageChange = () => {
      console.log(`Storage change detected for ${collection}, reloading data`);
      loadData();
    };

    // Listen for both storage events and custom events
    window.addEventListener('mockDbUpdate', handleStorageChange);

    return () => {
      window.removeEventListener('mockDbUpdate', handleStorageChange);
    };
  }, [collection, query]);

  const create = (item: Omit<T, 'id'>) => {
    console.log(`Creating new item in ${collection}:`, item);
    const result = db.create(collection as any, item);
    console.log(`Created item result:`, result);
    
    // Update local state immediately
    setData(prev => [...prev, result as T]);
    
    // Notify other components about the change
    window.dispatchEvent(new Event('mockDbUpdate'));
    
    return result;
  };

  const update = (id: number, updates: Partial<T>) => {
    console.log(`Updating item ${id} in ${collection}:`, updates);
    const result = db.update(collection as any, id, updates);
    if (result) {
      setData(prev => prev.map(item => 
        (item as any).id === id ? result : item
      ));
      window.dispatchEvent(new Event('mockDbUpdate'));
    }
    return result;
  };

  const remove = (id: number) => {
    console.log(`Removing item ${id} from ${collection}`);
    const success = db.delete(collection as any, id);
    if (success) {
      setData(prev => prev.filter(item => (item as any).id !== id));
      window.dispatchEvent(new Event('mockDbUpdate'));
    }
    return success;
  };

  const getById = (id: number) => {
    console.log(`Getting item ${id} from ${collection}`);
    return db.getById(collection as any, id);
  };

  const reset = () => {
    console.log(`Resetting ${collection} collection`);
    db.reset();
    loadData(); // Reload data immediately
    window.dispatchEvent(new Event('mockDbUpdate'));
  };

  const clear = () => {
    console.log(`Clearing ${collection} collection`);
    db.clear();
    loadData(); // Reload data immediately
    window.dispatchEvent(new Event('mockDbUpdate'));
  };

  return {
    data,
    create,
    update,
    remove,
    getById,
    reset,
    clear,
  };
}
