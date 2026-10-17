import { env } from "../config/env";

export interface PaymentInitResult {
  authorizationUrl: string;
  reference: string;
}

export interface PaymentVerifyResult {
  paid: boolean;
  reference: string;
  amountKobo: number;
  email: string | null;
  rawStatus: string;
}

export interface PaymentProvider {
  initialize(input: { email: string; amountKobo: number; reference: string }): Promise<PaymentInitResult>;
  verify(reference: string): Promise<PaymentVerifyResult>;
}

const PAYSTACK_BASE = "https://api.paystack.co";

class PaystackProvider implements PaymentProvider {
  private secret(): string | undefined {
    return env.PAYSTACK_SECRET_KEY;
  }

  async initialize(input: { email: string; amountKobo: number; reference: string }): Promise<PaymentInitResult> {
    const secret = this.secret();
    if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured");
    const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: input.email, amount: input.amountKobo, reference: input.reference }),
    });
    const data = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: { authorization_url?: string; reference?: string };
    };
    if (!res.ok || !data.status || !data.data?.authorization_url || !data.data?.reference) {
      throw new Error(data.message ?? "Paystack initialize failed");
    }
    return { authorizationUrl: data.data.authorization_url, reference: data.data.reference };
  }

  async verify(reference: string): Promise<PaymentVerifyResult> {
    const secret = this.secret();
    if (!secret) throw new Error("PAYSTACK_SECRET_KEY is not configured");
    const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = (await res.json()) as {
      status?: boolean;
      message?: string;
      data?: { status?: string; reference?: string; amount?: number; customer?: { email?: string } };
    };
    if (!res.ok || !data.status || !data.data) {
      throw new Error(data.message ?? "Paystack verify failed");
    }
    return {
      paid: data.data.status === "success",
      reference: data.data.reference ?? reference,
      amountKobo: data.data.amount ?? 0,
      email: data.data.customer?.email ?? null,
      rawStatus: data.data.status ?? "unknown",
    };
  }
}

// Stub used in tests/dev when no Paystack key is configured
class StubProvider implements PaymentProvider {
  async initialize(input: { email: string; amountKobo: number; reference: string }): Promise<PaymentInitResult> {
    return { authorizationUrl: `${env.FRONTEND_URL}/checkout?reference=${input.reference}`, reference: input.reference };
  }
  async verify(reference: string): Promise<PaymentVerifyResult> {
    return { paid: false, reference, amountKobo: 0, email: null, rawStatus: "stub" };
  }
}

export const paymentProvider: PaymentProvider = env.PAYSTACK_SECRET_KEY ? new PaystackProvider() : new StubProvider();

export const toKobo = (naira: number): number => Math.round(naira * 100);
export const toNaira = (kobo: number): number => kobo / 100;
