import Stripe from "stripe";
import { prisma } from "../../lib/prisma";

export const handlePaymentCompleted = async (session: Stripe.Checkout.Session) => {
    const rentalRequestId = session.metadata?.rentalRequestId;
    const transactionId = session.payment_intent as string; // স্ট্রাইপের ট্রানজেকশন আইডি

    if (!rentalRequestId || !transactionId) {
        console.log("Webhook Error: Missing rentalRequestId or transactionId");
        return;
    }

    // ট্রানজেকশন ব্যবহার করে পেমেন্ট সফল করা এবং রেন্টাল রিকোয়েস্ট ACTIVE করা
    await prisma.$transaction(async (tx) => {
        
        // ১. পেমেন্ট টেবিল আপডেট
        await tx.payment.update({
            where: { rentalRequestId },
            data: {
                status: "COMPLETED",
                transactionId: transactionId,
                paidAt: new Date()
            }
        });

        // ২. রেন্টাল রিকোয়েস্ট স্ট্যাটাস পরিবর্তন (APPROVED -> ACTIVE)
        await tx.rentalRequest.update({
            where: { id: rentalRequestId },
            data: {
                status: "ACTIVE" // ইউজার এখন মুভ-ইন করতে পারবে
            }
        });
    });

    console.log(`Payment successfully completed for Rental Request: ${rentalRequestId}`);
};