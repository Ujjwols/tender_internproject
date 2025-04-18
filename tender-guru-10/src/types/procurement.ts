
export interface BidSecurity {
  id: number;
  tenderId: number;
  amount: number;
  type: 'bank_guarantee' | 'cash_deposit' | 'insurance_bond';
  validUntil: string;
  status: 'active' | 'released' | 'forfeited';
  documentRef?: string;
}

export interface DocumentFee {
  id: number;
  tenderId: number;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentDate?: string;
  paymentRef?: string;
  receiptNumber?: string;
}

export interface PreBidMeeting {
  id: number;
  tenderId: number;
  scheduledDate: string;
  venue: string;
  attendees: Array<{
    id: number;
    name: string;
    organization: string;
    email: string;
  }>;
  minutes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface Clarification {
  id: number;
  tenderId: number;
  question: string;
  answer?: string;
  requestedBy: {
    id: number;
    name: string;
    organization: string;
  };
  requestDate: string;
  responseDate?: string;
  status: 'pending' | 'answered' | 'rejected';
}
