import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handlePaymentCompleted = async (session: Stripe.Checkout.Session) => {
    const rentalRequestId = session.metadata?.rentalRequestId;
    const transactionId = session.payment_intent as string; 

    if (!rentalRequestId || !transactionId) {
        console.log("Webhook Error: Missing rentalRequestId or transactionId");
        return;
    }

    // 🔥 এখানে টাইমআউট অপশনগুলো যোগ করে দিলাম
    await prisma.$transaction(async (tx) => {
        // ১. পেমেন্ট স্ট্যাটাস COMPLETED করা
        await tx.payment.update({
            where: { rentalRequestId },
            data: {
                status: "COMPLETED",
                transactionId: transactionId,
                paidAt: new Date()
            }
        });

        // ২. রেন্টাল রিকোয়েস্ট স্ট্যাটাস ACTIVE করা
        await tx.rentalRequest.update({
            where: { id: rentalRequestId },
            data: {
                status: "ACTIVE" 
            }
        });
    }, {
        maxWait: 10000, // ডাটাবেসের জন্য ১০ সেকেন্ড অপেক্ষা করবে
        timeout: 20000  // ট্রানজেকশনের জন্য ২০ সেকেন্ড সময় পাবে
    });

    console.log(`Payment successfully completed for Rental Request: ${rentalRequestId}`);
};