import { SquareClient, SquareEnvironment } from "square";
import { randomUUID } from "crypto";

const squareClient = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || "",
  environment:
    process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
});

interface PaymentRequestBody {
  sourceId: string;
  amount: number; // Total amount in dollars (we'll charge 50% deposit)
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PaymentRequestBody;

    // Validate required fields
    if (!body.sourceId) {
      return Response.json(
        { error: "Payment token is missing. Please try again." },
        { status: 400 }
      );
    }
    if (!body.amount || body.amount <= 0) {
      return Response.json(
        { error: "Invalid payment amount." },
        { status: 400 }
      );
    }

    // Calculate 50% deposit in cents (Square uses smallest currency unit)
    const depositDollars = Math.ceil(body.amount / 2);
    const depositCents = BigInt(Math.round(depositDollars * 100));

    const locationId = process.env.SQUARE_LOCATION_ID || process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || "";

    if (!locationId) {
      console.error("SQUARE_LOCATION_ID is not configured");
      return Response.json(
        { error: "Payment system is not configured. Please contact the property owner." },
        { status: 500 }
      );
    }

    // Create payment via Square
    const response = await squareClient.payments.create({
      sourceId: body.sourceId,
      idempotencyKey: randomUUID(),
      locationId,
      amountMoney: {
        amount: depositCents,
        currency: "USD",
      },
      note: `Purgatory Townhouse deposit — ${body.guestName}, ${body.checkIn} to ${body.checkOut}`,
      buyerEmailAddress: body.guestEmail,
    });

    const payment = response.payment;

    if (!payment || !payment.id) {
      console.error("Square payment response missing payment object:", response);
      return Response.json(
        { error: "Payment processing failed. Please try again." },
        { status: 500 }
      );
    }

    // Check payment status
    if (payment.status === "COMPLETED" || payment.status === "APPROVED") {
      return Response.json(
        {
          success: true,
          paymentId: payment.id,
          status: payment.status,
          depositAmount: depositDollars,
        },
        { status: 200 }
      );
    }

    // Payment was not successful
    console.error("Square payment not completed:", payment.status);
    return Response.json(
      {
        error: `Payment ${payment.status === "FAILED" ? "was declined" : "could not be completed"}. Please check your card details and try again.`,
      },
      { status: 400 }
    );
  } catch (err: unknown) {
    console.error("Square payment error:", err);

    // Extract Square API error details if available
    if (err && typeof err === "object" && "errors" in err) {
      const squareError = err as { errors: Array<{ detail?: string; code?: string }> };
      const firstError = squareError.errors?.[0];
      const message =
        firstError?.detail || "Payment failed. Please check your card details and try again.";
      return Response.json({ error: message }, { status: 400 });
    }

    return Response.json(
      { error: "An unexpected error occurred processing your payment. Please try again." },
      { status: 500 }
    );
  }
}
