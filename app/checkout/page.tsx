"use client";

import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartProvider";
import { z } from "zod";
import { toast } from "sonner";
import { getUserAllData } from '@/service/security';
import { orderCheckoutSchema } from '@/types/schemas/checkoutFormSchema';
import { ApiResponse, DeliveryMethod, PaymentMethod } from '@/types/interfaces';
import Navbar from '@/components/page/Navbar';
import { getAllRealisations } from '@/service/realisationServices';
import Footer from '@/components/page/Footer';

type OrderCheckoutInput = z.infer<typeof orderCheckoutSchema>;

interface PaymentMethodChoice {
    id: PaymentMethod;
    label: string;
    description?: string;
    fee?: string;
    enabled: boolean;
}

interface DeliveryMethodChoice {
    id: DeliveryMethod;
    label: string;
    subLabel: string;
    price: number;
}

type Network = 'WAVE' | 'ORANGE MONEY' | 'MTN' | 'MOOV';

interface NetworkItem {
    id: Network;
    label: string;
    logo: string;
    status: number; // 1 pour disponible, 0 pour indisponible
}

const paymentMethods: PaymentMethodChoice[] = [
    {
        id: PaymentMethod.ON_ARRIVAL,
        label: "Paiement à la livraison",
        fee: "+200 FCFA de frais de traitement",
        enabled: true,
    },
    {
        id: PaymentMethod.MOBILE_MONEY,
        label: "Mobile Money",
        description: "Payez avec Mobile Money (des frais de traitement sont appliqués par l'opérateur)",
        enabled: true,
    },
    {
        id: PaymentMethod.CARD,
        label: "Carte de crédit",
        description: "Payez avec votre carte de crédit",
        enabled: false,
    },
];

const deliveryMethods: DeliveryMethodChoice[] = [
    {
        id: DeliveryMethod.HOME_DELIVERY,
        label: "Livraison à domicile (à vos frais)",
        subLabel: "Recevez-le dès demain à votre adresse",
        price: 15,
    },
    {
        id: DeliveryMethod.STORE_PICKUP,
        label: "Retrait en magasin – Gratuit",
        subLabel: "Disponible sous 1 semaine en boutique",
        price: 0,
    },
];

// Tableau d'objets de moyens de paiement
const mobilePaymentNetworks: NetworkItem[] = [
    {
        id: 'WAVE',
        label: 'WAVE',
        logo: '/wave-logo.png', // Remplacez par le chemin correct de votre logo
        status: 1
    },
    {
        id: 'ORANGE MONEY',
        label: 'ORANGE MONEY',
        logo: '/orange-money-logo.png', // Remplacez par le chemin correct de votre logo
        status: 1
    },
    {
        id: 'MTN',
        label: 'MTN',
        logo: '/mtn-logo.png', // Remplacez par le chemin correct de votre logo
        status: 1
    },
    {
        id: 'MOOV',
        label: 'MOOV',
        logo: '/moov-logo.png', // Remplacez par le chemin correct de votre logo
        status: 0 // Exemple: MOOV est indisponible
    }
];

export default function Page() {
    const router = useRouter();
    const { items: cartItems, clearCart, countTotalPrice } = useCart();
    const [selectedNetwork, setSelectedNetwork] = useState<Network | null>(null);
    const [paimentNember, setPaimentNember] = useState('');
    const [showNetwork, setShowNetwork] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [networks, setNetworks] = useState<NetworkItem[]>([]);

    const form = useForm<OrderCheckoutInput>({
        resolver: zodResolver(orderCheckoutSchema),
        defaultValues: {
            deliveryDetails: { name: "", email: "", phone: "", company: "" },
            paymentMethod: PaymentMethod.ON_ARRIVAL,
            deliveryMethod: DeliveryMethod.HOME_DELIVERY,
            promoCode: "",
            items: [],
            amount: 0,
        },
    });

    const [response, setResponse] = useState<ApiResponse | null>(null);

    const getAllRealisation = async () => {
        const response = await getAllRealisations();
        if (response.statusCode === 200 && response.data) {
            setResponse(response.data);
        }
    };

    useEffect(() => {
        getAllRealisation();
    }, []);

    // Initialisation des réseaux de paiement disponibles
    useEffect(() => {
        // Filtrer pour n'afficher que les moyens de paiement avec status = 1
        const availableNetworks = mobilePaymentNetworks.filter(network => network.status === 1);
        setNetworks(availableNetworks);

        // Si vous souhaitez afficher tous les réseaux (disponibles et indisponibles)
        // setNetworks(mobilePaymentNetworks);
    }, []);

    // Charge infos utilisateur
    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await getUserAllData();
                if (res.data?.user) {
                    form.reset({
                        ...form.getValues(),
                        deliveryDetails: {
                            name: res.data.user.name ?? "",
                            email: res.data.user.email ?? "",
                            phone: res.data.user.contact ?? "",
                            company: "",
                        },
                    });
                    setPaimentNember(res.data.user.contact ?? "");
                }
            } catch (e) {
                console.error(e);
            }
        }
        fetchUser();
    }, [form]);

    // Mise à jour du panier
    useEffect(() => {
        form.setValue(
            "items",
            cartItems.map((item) => ({
                productId: String(item.product.id),
                quantity: item.count,
                price: Number(item.product.price),
            }))
        );
        form.setValue("amount", Number(countTotalPrice()));
    }, [cartItems, countTotalPrice, form]);

    function handlePaymentChange(val: string) {
        form.setValue("paymentMethod", val as PaymentMethod, { shouldValidate: true });
        setShowNetwork(val === PaymentMethod.MOBILE_MONEY);
        if (val !== PaymentMethod.MOBILE_MONEY) {
            setSelectedNetwork(null);
        }
    }

    function handleDeliveryChange(val: string) {
        form.setValue("deliveryMethod", val as DeliveryMethod, { shouldValidate: true });
    }

    function handlePromoChange(val: string) {
        form.setValue("promoCode", val, { shouldValidate: true });
    }

    function handleNetworkPayment() {
        if (!selectedNetwork) {
            setError("Veuillez sélectionner un réseau de paiement");
            return;
        }
        if (!paimentNember || paimentNember.length < 8) {
            setError("Veuillez entrer un numéro de téléphone valide");
            return;
        }
        // Logique de paiement ici
        toast.success(`Paiement via ${selectedNetwork} en cours...`);
    }

    const handleSelectNetwork = (id: Network) => {
        if (selectedNetwork === id) {
            setSelectedNetwork(null);
            setError(null);
        } else {
            setSelectedNetwork(id);
            setError(null);
        }
    };

    async function onSubmit(data: OrderCheckoutInput) {
        try {
            const payload = {
                ...data,
                paiementNumber: paimentNember ?? undefined,
                network: selectedNetwork ?? undefined,
                promoCode: data.promoCode ?? undefined,
            };

            // Simulation de soumission
            console.log('Données soumises:', payload);

            if (data.paymentMethod === PaymentMethod.MOBILE_MONEY && !selectedNetwork) {
                setError("Veuillez sélectionner un réseau de paiement Mobile Money");
                return;
            }

            // const res = await submitOrder(payload);
            // if (res.statusCode === 201) {
            //     toast.success("Commande créée avec succès");
            //     clearCart();
            //     router.push(`/success/${res.data.ordersNumber}`);
            // } else {
            //     toast.error("Une erreur est survenue lors de la commande.");
            // }

            toast.success("Commande soumise avec succès (simulation)");
        } catch (e) {
            console.error(e);
            toast.error("Une erreur est survenue");
        }
    }

    return (
        <>
            <Navbar />
            <div className="mb-8">
                <div className={`min-h-[calc(100vh_-_56px)] py-5 px-3 lg:px-6 mt-[4rem] md:mt-[4rem]`}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 space-y-6">
                            <div>
                                <h2 className="text-xl font-bold mb-4">Détails de livraison</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input {...form.register("deliveryDetails.name")} placeholder="Nom complet" disabled={true} />
                                    <Input {...form.register("deliveryDetails.email")} placeholder="Adresse e-mail" disabled={true} />
                                    <Input {...form.register("deliveryDetails.phone")} placeholder="Numéro de téléphone" disabled={true} />
                                    <Input {...form.register("deliveryDetails.company")} placeholder="Nom de l'entreprise" disabled={true} />
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-4">Paiement</h2>
                                <RadioGroup value={form.watch("paymentMethod")} onValueChange={handlePaymentChange} className="grid gap-4">
                                    {paymentMethods.map((method) => (
                                        <Card key={method.id} className={`p-4 ${!method.enabled ? "opacity-50 pointer-events-none" : ""}`}>
                                            <div className="flex items-center">
                                                <RadioGroupItem value={method.id} id={method.id} disabled={!method.enabled} />
                                                <Label htmlFor={method.id} className="ml-2 font-medium">
                                                    {method.label}
                                                </Label>
                                            </div>
                                            {method.description && <p className="text-sm text-gray-500 ml-6 mt-1">{method.description}</p>}
                                            {method.fee && <p className="text-sm text-gray-500 ml-6 mt-1">{method.fee}</p>}
                                        </Card>
                                    ))}
                                </RadioGroup>

                                {/* Affichage des réseaux Mobile Money */}
                                {showNetwork && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium mb-4">Choisissez votre opérateur Mobile Money</h3>
                                        <div className="flex gap-4 flex-wrap items-center">
                                            {networks.map(({ id, label, logo }) => (
                                                <button
                                                    key={id}
                                                    type="button"
                                                    onClick={() => handleSelectNetwork(id)}
                                                    className={`relative flex flex-col items-center rounded-full border-2 p-2 transition ${selectedNetwork === id ? 'border-green-500 shadow-md' : 'border-transparent hover:border-gray-300'}`}
                                                    style={{ width: 80, height: 80 }}
                                                >
                                                    <Image
                                                        src={logo}
                                                        alt={label}
                                                        width={48}
                                                        height={48}
                                                        className="rounded-full object-cover"
                                                        unoptimized
                                                    />
                                                    <span className="mt-2 text-xs font-medium text-gray-700">{label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Formulaire de paiement Mobile Money */}
                                {selectedNetwork && showNetwork && (
                                    <div className="mt-8 p-4 border rounded-lg bg-gray-50">
                                        <h3 className="text-lg font-medium mb-4">Paiement via {selectedNetwork}</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label htmlFor="paymentNumber" className="mb-1 block text-sm font-medium text-gray-700">
                                                    Numéro de téléphone {selectedNetwork}
                                                </label>
                                                <Input
                                                    id="paymentNumber"
                                                    type="tel"
                                                    value={paimentNember}
                                                    onChange={(e) => setPaimentNember(e.target.value)}
                                                    className="w-full"
                                                    placeholder={`Entrez votre numéro ${selectedNetwork}`}
                                                />
                                            </div>

                                            <div className="p-3 bg-white border rounded">
                                                <p className="text-sm text-gray-600">Montant à payer :</p>
                                                <p className="text-xl font-bold">{countTotalPrice()} FCFA</p>
                                            </div>

                                            {error && (
                                                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                                                    {error}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-4">
                                                <Button
                                                    type="button"
                                                    onClick={handleNetworkPayment}
                                                    className="bg-green-600 text-white hover:bg-green-700"
                                                >
                                                    Effectuer le paiement
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setSelectedNetwork(null);
                                                        setError(null);
                                                    }}
                                                >
                                                    Annuler
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h2 className="text-xl font-bold mb-4">Méthodes de livraison</h2>
                                <RadioGroup value={form.watch("deliveryMethod")} onValueChange={handleDeliveryChange} className="grid gap-4">
                                    {deliveryMethods.map((method) => (
                                        <Card key={method.id} className="p-4">
                                            <div className="flex items-center">
                                                <RadioGroupItem value={method.id} id={method.id} />
                                                <Label htmlFor={method.id} className="ml-2 font-medium">
                                                    {method.label}
                                                </Label>
                                            </div>
                                            <p className="text-sm text-gray-500 ml-6 mt-1">{method.subLabel}</p>
                                            {method.price > 0 && (
                                                <p className="text-sm text-gray-500 ml-6 mt-1">Frais de livraison : {method.price} FCFA</p>
                                            )}
                                        </Card>
                                    ))}
                                </RadioGroup>
                            </div>

                            <div className="flex gap-4 items-center">
                                <Input
                                    placeholder="Entrez un code promotionnel"
                                    value={form.watch("promoCode") ?? ""}
                                    onChange={(e) => handlePromoChange(e.target.value)}
                                />
                                <Button type="button" onClick={() => toast.info("Fonctionnalité de code promotionnel à implémenter")}>
                                    Appliquer
                                </Button>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg space-y-4 h-fit">
                            <h2 className="text-lg font-semibold">Résumé de la commande</h2>
                            <div className="space-y-3">
                                {cartItems.map((item) => (
                                    <div key={item.product.id} className="flex justify-between items-center">
                                        <div>
                                            <span className="font-medium">{item.product.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">x {item.count}</span>
                                        </div>
                                        <span>{(item.count * Number(item.product.price)).toFixed(2)} FCFA</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span>Sous-total</span>
                                    <span>{countTotalPrice()} FCFA</span>
                                </div>
                                {form.watch("deliveryMethod") === DeliveryMethod.HOME_DELIVERY && (
                                    <div className="flex justify-between">
                                        <span>Frais de livraison</span>
                                        <span>15 FCFA</span>
                                    </div>
                                )}
                                {form.watch("paymentMethod") === PaymentMethod.ON_ARRIVAL && (
                                    <div className="flex justify-between">
                                        <span>Frais de traitement</span>
                                        <span>200 FCFA</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-3">
                                <span>Total</span>
                                <span>
                                    {(() => {
                                        let total = Number(countTotalPrice());
                                        if (form.watch("deliveryMethod") === DeliveryMethod.HOME_DELIVERY) total += 15;
                                        if (form.watch("paymentMethod") === PaymentMethod.ON_ARRIVAL) total += 200;
                                        return total.toFixed(2);
                                    })()} FCFA
                                </span>
                            </div>

                            {(!showNetwork || (showNetwork && selectedNetwork)) && (
                                <Button className="w-full mt-4" type="submit" size="lg">
                                    {form.watch("paymentMethod") === PaymentMethod.ON_ARRIVAL
                                        ? "Confirmer la commande"
                                        : "Procéder au paiement"}
                                </Button>
                            )}

                            <p className="text-sm text-center text-gray-600 mt-4">
                                En confirmant votre commande, vous acceptez nos conditions générales de vente.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <Footer reglages={response?.reglages ?? []} />
        </>
    );
}