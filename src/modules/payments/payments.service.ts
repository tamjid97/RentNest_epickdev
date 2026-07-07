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
                client: true 
            }
        });

        if (rentalRequest.status !== "APPROVED") {
            throw new Error("Rental request must be APPROVED to make a payment");
        }

        if (rentalRequest.property.price === null || rentalRequest.property.price === undefined) {
            throw new Error("Property price is not defined. Cannot proceed with payment.");
        }

        const baseUrl = config.app_url || "http://localhost:3000";

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
            success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/payment/cancel`,
            metadata: { 
                rentalRequestId: rentalRequest.id 
            }
        });

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
    
    try {
        const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);

        if (event.type === 'checkout.session.completed') {
            // পেমেন্ট সেশন কমপ্লিট হলে এটি রান করবে
            await handlePaymentCompleted(event.data.object as any);
        } else {
            console.log(`Unhandled event type ${event.type}.`);
        }
    } catch (err: any) {
        console.error(`⚠️ Webhook error:`, err.message);
        throw err; // এখানে এররটি থ্রো করলে এক্সপ্রেসের গ্লোবাল এরর হ্যান্ডলার সেটি ধরবে
    }
};

const getAllPaymentsFromDB = async (user: any) => {
    const { userId, role } = user;

    // ১. ADMIN হলে সব পেমেন্ট দেখবে
    if (role === 'ADMIN') {
        return await prisma.payment.findMany({
            include: { rentalRequest: { include: { property: true, client: true } } },
            orderBy: { createdAt: "desc" }
        });
    }

    // ২. LANDLORD হলে শুধু তার নিজের প্রোপার্টিগুলোর পেমেন্ট দেখবে 
    if (role === 'LANDLORD') {
        return await prisma.payment.findMany({
            where: {
                rentalRequest: {
                    property: {
                        landlordId: userId
                    }
                }
            },
            include: {
                rentalRequest: {
                    include: { property: true, client: true }
                }
            },
            orderBy: { createdAt: "desc" }
        });
    }

    // ৩. TENANT হলে শুধু নিজের করা পেমেন্ট দেখবে
    return await prisma.payment.findMany({
        where: {
            rentalRequest: {
                clientId: userId 
            }
        },
        include: {
            rentalRequest: {
                include: { property: true }
            }
        },
        orderBy: { createdAt: "desc" }
    });
};

const getPaymentByIdFromDB = async (id: string, user: any) => {
    const { userId, role } = user;

    const payment = await prisma.payment.findUniqueOrThrow({
        where: { id },
        include: {
            rentalRequest: {
                include: { property: true, client: true }
            }
        }
    });

    // সিকিউরিটি চেক: ADMIN, সংশ্লিষ্ট TENANT বা সংশ্লিষ্ট LANDLORD বাদে অন্য কেউ দেখতে পারবে না
    const isTenant = payment.rentalRequest.clientId === userId;
    const isLandlord = payment.rentalRequest.property.landlordId === userId;

    if (role !== 'ADMIN' && !isTenant && !isLandlord) {
        throw new Error("You are not authorized to view this payment details");
    }

    return payment;
};

export const paymentServices = {
    createCheckoutSession,
    handleWebhook,
    getAllPaymentsFromDB,
    getPaymentByIdFromDB
};