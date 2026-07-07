import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import httpStatus from "http-status";
import { handlePaymentCompleted } from "./payments.utils";

const createCheckoutSession = async (rentalRequestId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        
        // ১. রেন্টাল রিকোয়েস্টটি ডাটাবেসে আছে কি না এবং এটি APPROVED কি না চেক করো
        const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
            where: { id: rentalRequestId },
            include: { 
                property: true,
                client: true // 🔥 তোমার স্কিমা অনুযায়ী 'tenant' পরিবর্তন করে 'client' করা হলো
            }
        });

        if (rentalRequest.status !== "APPROVED") {
            throw new Error("Rental request must be APPROVED to make a payment");
        }

        // টাইপস্ক্রিপ্টের null/undefined এরর দূর করার জন্য টাইপ গার্ড চেক
        if (rentalRequest.property.price === null || rentalRequest.property.price === undefined) {
            throw new Error("Property price is not defined. Cannot proceed with payment.");
        }

        // ২. স্ট্রাইপ চেকআউট সেশন তৈরি (One-time Payment Mode)
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
                }
            ],
            mode: "payment",
            customer_email: rentalRequest.client.email, // 🔥 অসম্পূর্ণ কোডটি ফিক্স করে 'client.email' বসানো হলো
            success_url: `${config.app_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${config.app_url}/payment/cancel`,
            metadata: { 
                rentalRequestId: rentalRequest.id 
            }
        });

        // ৩. পেমেন্ট রেকর্ড ডাটাবেসে PENDING হিসেবে তৈরি/আপডেট করে রাখা
        await tx.payment.upsert({
            where: { rentalRequestId: rentalRequest.id },
            create: {
                amount: rentalRequest.property.price,
                provider: "STRIPE",
                status: "PENDING",
                rentalRequestId: rentalRequest.id
            },
            update: {
                amount: rentalRequest.property.price,
                status: "PENDING"
            }
        });

        return session.url;
    });

    return {
        paymentUrl: transactionResult
    };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
    // 🔥 সিগনেচার চেক করার জন্য 'stripe_secret_key' এর বদলে 'stripe_webhook_secret' ব্যবহার করা হলো
    const endpointSecret = config.stripe_secret_key!;
    const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

    // রেন্টাল পেমেন্টের জন্য শুধু এই একটি ইভেন্ট হ্যান্ডেল করলেই হবে
    if (event.type === 'checkout.session.completed') {
        await handlePaymentCompleted(event.data.object);
    } else {
        console.log(`Unhandled event type ${event.type}.`);
    }
};

export const paymentServices = {
    createCheckoutSession,
    handleWebhook
};