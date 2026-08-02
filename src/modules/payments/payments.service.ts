import { Role } from "../../../generated/prisma/enums";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handlePaymentCompleted } from "./payments.utils";

const createCheckoutSession = async (rentalRequestId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
      where: { id: rentalRequestId },
      include: {
        property: true,
        client: true,
      },
    });

    if (rentalRequest.status !== "APPROVED") {
      throw new Error("Rental request must be APPROVED to make a payment");
    }

    if (
      rentalRequest.property.price === null ||
      rentalRequest.property.price === undefined
    ) {
      throw new Error(
        "Property price is not defined. Cannot proceed with payment.",
      );
    }

    const baseUrl =
      process.env.APP_URL || config.app_url || "https://rentnest-navy.vercel.app";

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Rental Payment for ${rentalRequest.property.title}`,
              description: `Location: ${rentalRequest.property.location}`,
            },
            unit_amount: rentalRequest.property.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: rentalRequest.client.email,


      success_url: `https://rentnest-navy.vercel.app/tenant/payments?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://rentnest-navy.vercel.app/payments?status=cancelled`,
      metadata: {
        rentalRequestId: rentalRequest.id,
      },
    });

    await tx.payment.upsert({
      where: { rentalRequestId: rentalRequest.id },
      create: {
        amount: rentalRequest.property.price,
        provider: "STRIPE",
        status: "PENDING",
        rentalRequestId: rentalRequest.id,
      },
      update: {
        amount: rentalRequest.property.price,
        status: "PENDING",
      },
    });

    return session.url;
  });

  return {
    paymentUrl: transactionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret as string;

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret,
    );

    if (event.type === "checkout.session.completed") {
      await handlePaymentCompleted(event.data.object as any);
    } else {
      console.log(`Unhandled event type ${event.type}.`);
    }
  } catch (err: any) {
    console.error(`Webhook error:`, err.message);
    throw err;
  }
};

const getMyPaymentHistoryFromDB = async (userId: string, role: Role) => {
  let whereConditions: any = {};

  if (role === Role.TENANT) {
    whereConditions = {
      rentalRequest: {
        clientId: userId,
      },
    };
  } else if (role === Role.LANDLORD) {
    whereConditions = {
      rentalRequest: {
        property: {
          landlordId: userId,
        },
      },
    };
  }

  // এখানে findFirst এর পরিবর্তে findMany ব্যবহার করা হয়েছে
  const result = await prisma.payment.findMany({ 
    where: whereConditions,
    include: {
      rentalRequest: {
        include: {
          property: true,
          client: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", // এটি লেটেস্ট পেমেন্টগুলোকে সবার উপরে রাখবে
    },
  });

  return result;
};

// payment.service.ts ফাইলের ভেতরে:
const getPaymentByIdFromDB = async (id: string, user: any) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id },
    include: {
      rentalRequest: {
        include: { 
           property: true, 
           client: true,
           review: true // 👈 এটি যুক্ত করতে হবে (বা reviews: true)
        },
      },
    },
  });

  return payment;
};

export const paymentServices = {
  createCheckoutSession,
  handleWebhook,
  getMyPaymentHistoryFromDB,
  getPaymentByIdFromDB,
};
