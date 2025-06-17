import axios from "axios";

export interface CashfreeOrderData {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
  order_meta: {
    return_url: string;
  };
  order_note?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_currency: string;
  order_amount: number;
  order_status: string;
  payment_session_id: string;
  order_expiry_time: string;
  order_note: string;
  payment_link: string;
  settlements: Record<string, unknown>;
  refunds: Record<string, unknown>;
  order_meta: {
    return_url: string;
  };
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
}

const getAuthHeaders = () => {
  // Use both NEXT_PUBLIC_ and regular env vars to support both client and server components
  const appId = process.env.CASHFREE_APP_ID;
  const secretKey = process.env.CASHFREE_SECRET_KEY;

  if (!appId || !secretKey) {
    console.error(
      "Cashfree credentials missing - APP_ID:",
      !!appId,
      "SECRET_KEY:",
      !!secretKey
    );
  }

  return {
    "Content-Type": "application/json",
    "x-client-id": appId || "",
    "x-client-secret": secretKey || "",
    "x-api-version": "2022-09-01",
  };
};

export async function createCashfreeOrder(
  orderData: CashfreeOrderData
): Promise<CashfreeOrderResponse> {
  const apiUrl =
    process.env.CASHFREE_API_URL ||
    process.env.NEXT_PUBLIC_CASHFREE_API_URL ||
    "https://sandbox.cashfree.com/pg";
  console.log("Using API URL:", apiUrl);

  console.log("Creating order with Cashfree");
  console.log("API URL:", apiUrl);
  console.log("Order data:", JSON.stringify(orderData));

  try {
    const response = await axios.post(`${apiUrl}/orders`, orderData, {
      headers: getAuthHeaders(),
    });

    console.log("Order created successfully:", response.status);
    console.log("Cashfree response data:", JSON.stringify(response.data));

    // If payment_link is missing, create one manually using the payment session ID
    const responseData = response.data;
    if (!responseData.payment_link) {
      console.log("Payment link not found in response, creating one manually");
      if (responseData.payment_session_id) {
        // Use payment session ID to create the payment link
        responseData.payment_link = `https://sandbox.cashfree.com/pg/view/checkout?session_id=${responseData.payment_session_id}`;
      } else {
        console.error("No payment_session_id found in response");
      }
    }

    return responseData;
  } catch (error: unknown) {
    const err = error as Error & { response?: { data?: unknown } };
    console.error("Cashfree API error:", err.response?.data || err.message);
    throw err;
  }
}

export async function verifyPayment(orderId: string) {
  const apiUrl =
    process.env.CASHFREE_API_URL ||
    process.env.NEXT_PUBLIC_CASHFREE_API_URL ||
    "https://sandbox.cashfree.com/pg";

  try {
    const response = await axios.get(`${apiUrl}/orders/${orderId}/payments`, {
      headers: getAuthHeaders(),
    });

    return response.data;
  } catch (error: unknown) {
    const err = error as Error & { response?: { data?: unknown } };
    console.error(
      "Error verifying payment:",
      err.response?.data || err.message
    );
    throw err;
  }
}
