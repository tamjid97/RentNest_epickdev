import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import { handlePaymentCompleted } from "./payments.utils";

const createCheckoutSession = async (rentalRequestId: string) => {
    const transactionResult = await prisma.$transaction(async (tx) => {
        
        // ১. রেন্টাল রিকোয়েস্টটি ডাটাবেসে আছে কি না এবং এটি APPROVED কি না চেক করো
        const rentalRequest = await tx.rentalRequest.findUniqueOrThrow({
            where: { id: rentalRequestId },
            include: { 
                property: true,
                client: true 
            }
        });

        if (rentalRequest.status !== "APPROVED") {
            throw new Error("Rental request must be APPROVED to make a payment");
        }

        // টাইপস্ক্রিপ্টের null/undefined এরর দূর করার জন্য টাইপ গার্ড চেক
        if (rentalRequest.property.price === null || rentalRequest.property.price === undefined) {
            throw new Error("Property price is not defined. Cannot proceed with payment.");
        }

        // 🔥 config.app_url undefined থাকলে যেন এরর না দেয়, তাই ফলব্যাক (Fallback) দেওয়া হলো
        const baseUrl = config.app_url || "http://localhost:3000";

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
            customer_email: rentalRequest.client.email, 
            // 🔥 Fallback URL ব্যবহার করা হলো
            success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/payment/cancel`,
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
    const endpointSecret = config.stripe_webhook_secret as string;
    
    // 🔥 try-catch ব্লক যোগ করা হলো যাতে সিগনেচার ফেইল করলে সার্ভার ক্র্যাশ না করে
    try {
        const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

        // রেন্টাল পেমেন্টের জন্য শুধু এই একটি ইভেন্ট হ্যান্ডেল করলেই হবে
        if (event.type === 'checkout.session.completed') {
            await handlePaymentCompleted(event.data.object);
        } else {
            console.log(`Unhandled event type ${event.type}.`);
        }
    } catch (err: any) {
        console.error(`⚠️ Webhook signature verification failed:`, err.message);
        throw new Error(`Webhook Error: ${err.message}`);
    }
};

export const paymentServices = {
    createCheckoutSession,
    handleWebhook
};