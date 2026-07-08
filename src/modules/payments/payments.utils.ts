import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handlePaymentCompleted = async (session: Stripe.Checkout.Session) => {
    const rentalRequestId = session.metadata?.rentalRequestId;
    const transactionId = session.payment_intent as string; 

    if (!rentalRequestId || !transactionId) {
        console.log("Webhook Error: Missing rentalRequestId or transactionId");
        return;
    }

    await prisma.$transaction(async (tx) => {
        // ১. পেমেন্ট রেকর্ড আপডেট
        await tx.payment.update({
            where: { rentalRequestId },
            data: {
                status: "COMPLETED",
                transactionId: transactionId,
                paidAt: new Date()
            }
        });

        // ২. রেন্টাল রিকোয়েস্ট স্ট্যাটাস ACTIVE করা (অ্যাসাইনমেন্ট লাইফসাইকেল অনুযায়ী)
        await tx.rentalRequest.update({
            where: { id: rentalRequestId },
            data: {
                status: "ACTIVE" 
            }
        });
    }, {
        maxWait: 10000, 
        timeout: 20000  
    });

    console.log(`Payment successfully completed for Rental Request: ${rentalRequestId}`);
};