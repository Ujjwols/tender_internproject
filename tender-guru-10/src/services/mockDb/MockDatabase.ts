
import { Tender } from "@/types/tender";
import { Vendor } from "@/types/vendor";
import { BidSecurity, DocumentFee, PreBidMeeting, Clarification } from "@/types/procurement";
import { Committee } from "@/types/committee";
import { Employee } from "@/types/employee";
import { mockTenders } from "@/mock/tenderData";
import { mockBidSecurities, mockDocumentFees, mockPreBidMeetings, mockClarifications } from "@/mock/procurementData";
import { mockVendors } from "@/utils/vendorUtils";
import { mockCommittees } from "@/mock/committeeData";
import { mockEmployees } from "@/mock/employeeData";

type Collections = {
  tenders: Tender[];
  vendors: Vendor[];
  bidSecurities: BidSecurity[];
  documentFees: DocumentFee[];
  preBidMeetings: PreBidMeeting[];
  clarifications: Clarification[];
  committees: Committee[];
  employees: Employee[];
};

class MockDatabase {
  private static instance: MockDatabase;
  private data: Collections;

  private constructor() {
    console.log('MockDatabase constructor called');
    const savedData = localStorage.getItem('mockDb');
    if (savedData) {
      try {
        console.log('Found existing data in localStorage');
        this.data = JSON.parse(savedData);
        console.log('Successfully loaded data:', this.data);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        this.initializeWithMockData();
      }
    } else {
      console.log('No existing data found, initializing with mock data');
      this.initializeWithMockData();
    }
  }

  private initializeWithMockData() {
    console.log('Initializing database with mock data');
    this.data = {
      tenders: mockTenders,
      vendors: mockVendors,
      bidSecurities: mockBidSecurities,
      documentFees: mockDocumentFees,
      preBidMeetings: mockPreBidMeetings,
      clarifications: mockClarifications,
      committees: mockCommittees,
      employees: mockEmployees,
    };
    this.saveToStorage();
    console.log('Mock data initialized:', this.data);
  }

  public static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      console.log('Creating new MockDatabase instance');
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  private saveToStorage(): void {
    try {
      console.log('Saving data to localStorage:', this.data);
      localStorage.setItem('mockDb', JSON.stringify(this.data));
      window.dispatchEvent(new Event('mockDbUpdate'));
      console.log('Data successfully saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  public getAll<K extends keyof Collections>(collection: K): Collections[K] {
    console.log(`Getting all items from ${collection}:`, this.data[collection]);
    const result = this.data[collection];
    return Array.isArray(result) ? [...result] as Collections[K] : result;
  }

  public getById<K extends keyof Collections>(
    collection: K,
    id: number
  ): Collections[K][number] | undefined {
    console.log(`Getting item ${id} from ${collection}`);
    const item = this.data[collection].find((item) => item.id === id);
    console.log('Found item:', item);
    return item;
  }

  public create<K extends keyof Collections>(
    collection: K,
    item: Omit<Collections[K][number], 'id'>
  ): Collections[K][number] {
    console.log(`Creating new item in ${collection}:`, item);
    
    const newId = Math.max(...this.data[collection].map((i) => i.id), 0) + 1;
    const newItem = { ...item, id: newId } as Collections[K][number];
    
    this.data = {
      ...this.data,
      [collection]: [...this.data[collection], newItem] as Collections[K]
    };
    
    this.saveToStorage();
    return newItem;
  }

  public update<K extends keyof Collections>(
    collection: K,
    id: number,
    updates: Partial<Collections[K][number]>
  ): Collections[K][number] | undefined {
    const index = this.data[collection].findIndex((item) => item.id === id);
    
    if (index === -1) return undefined;

    const updatedItem = {
      ...this.data[collection][index],
      ...updates,
    } as Collections[K][number];

    const newCollection = [
      ...this.data[collection].slice(0, index),
      updatedItem,
      ...this.data[collection].slice(index + 1)
    ] as Collections[K];

    this.data = {
      ...this.data,
      [collection]: newCollection
    };
    
    this.saveToStorage();
    return updatedItem;
  }

  public delete<K extends keyof Collections>(
    collection: K,
    id: number
  ): boolean {
    const initialLength = this.data[collection].length;
    const newCollection = this.data[collection].filter((item) => item.id !== id) as Collections[K];
    
    this.data = {
      ...this.data,
      [collection]: newCollection
    };
    
    const deleted = initialLength > this.data[collection].length;
    if (deleted) this.saveToStorage();
    
    return deleted;
  }

  public query<K extends keyof Collections>(
    collection: K,
    predicate: (item: Collections[K][number]) => boolean
  ): Collections[K] {
    const results = this.data[collection].filter(predicate);
    return results as Collections[K];
  }

  public clear(): void {
    localStorage.removeItem('mockDb');
    this.initializeWithMockData();
  }

  public reset(): void {
    this.initializeWithMockData();
  }
}

export default MockDatabase;

