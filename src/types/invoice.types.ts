export interface Invoice {
  id: number;
  total_amount: string;
  status: string;
  created_at: string;
  plan: {
    name: string;
  };
}

export interface InvoiceResponse {
  status: boolean;
  data: Invoice[];
}
