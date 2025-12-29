
import { z } from "zod";
import { DeliveryMethod, PaymentMethod } from "../interfaces";

export const deliveryDetailsSchema = z.object({
    name: z.string().min(2, "Nom trop court"),
    email: z.string().email("Email invalide"),
    phone: z.string().min(6),
    company: z.string().optional(),
});

export const orderItemSchema = z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
});

// Utilisation de z.nativeEnum directement sur l'enum TS
export const paymentMethodEnum = z.nativeEnum(PaymentMethod);
export const deliveryMethodEnum = z.nativeEnum(DeliveryMethod);

export const orderCheckoutSchema = z.object({
    deliveryDetails: deliveryDetailsSchema,
    paymentMethod: paymentMethodEnum,
    deliveryMethod: deliveryMethodEnum,
    promoCode: z.string().optional().nullable(),
    items: z.array(orderItemSchema).min(1, "Le panier ne peut pas être vide"),
    amount: z.number().min(0),
    // paiementNumber: z.string().optional().nullable(),
});
