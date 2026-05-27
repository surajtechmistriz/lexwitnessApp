
/* ---------------- TYPES ---------------- */

import api from "../../services/axios";

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

/* ---------------- HISTORY API ---------------- */

export const getUserInvoices = async () => {
  const res = await api.get<InvoiceResponse>(
    "/subscription/plan-history"
  );
console.log("Invoice responses",res)
  return res.data;
};

/* ---------------- DOWNLOAD API ---------------- */

export const downloadInvoiceApi = async (id: number) => {
  return api.get(
    `/subscription/plan-invoice/${id}`,
    {
      responseType: "arraybuffer", // NOT blob
    }
  );
};