'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { getBaseUrlImg } from '@/servives/baseUrl';


type OrderDetail = {
    id_orders: number;
    transaction_id: string;
    total: number;
    date_orders: string;
    heurs_orders: string;
    Mode_paiement: string;
    email_orders: string;
    nomUsers_orders: string;
    status_orders: number;
    personnalise: number;
    codeAchat: string;
    NomPrenomAchats: string;
    EntrepriseAchats: string;
    emailAchats: string;
    couleursAchats: string | null;
    texteAchats: string | null;
    PositionsFiles: string;
    policeAchats: string;
    imgLogosAchats: string | null;
    libelle_realisations: string;
    descript_real: string;
    images_realisations: string;
};

type OrderProps = {
    isOpen: boolean;
    onClose: () => void;
    Data: OrderDetail[];
};

const formatStatus = (status: number) => {
    switch (status) {
        case 0:
            return <Badge className="bg-yellow-100 text-yellow-700">En attente</Badge>;
        case 1:
            return <Badge className="bg-green-100 text-green-700">Confirmée</Badge>;
        case 2:
            return <Badge className="bg-blue-100 text-blue-700">Expédiée</Badge>;
        case 3:
            return <Badge className="bg-red-100 text-red-700">Annulée</Badge>;
        default:
            return <Badge>Inconnue</Badge>;
    }
};

export default function OrderModal({ isOpen, onClose, Data }: OrderProps) {
    if (!Data || Data.length === 0) return null;

    const order = Data[0];

    return (
        <div className={`fixed inset-0 bg-black/50 z-50 ${!isOpen && 'hidden'}`}>
            <div className={`fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform transform ${isOpen ? 'translate-x-0 w-full md:w-[50vw]' : 'translate-x-full'} bg-white dark:bg-gray-800 shadow-xl duration-300 ease-in-out`}
                aria-labelledby="drawer-right-label">
                <h5 className="inline-flex items-center mb-4 text-lg font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Détail de la commande
                </h5>

                <Button type="button" className="text-gray-400 bg-red-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 end-2.5 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={onClose} >
                        X
                    {/* <X className="w-6 h-6 text-white" aria-hidden="true" /> */}
                    <span className="sr-only">Fermer</span>
                </Button>

                <div className="mt-4 space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Commande #{order.id_orders} - {formatStatus(order.status_orders)}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>

                                <p><strong>Date :</strong> {order.date_orders} à {order.heurs_orders}</p>
                                <p><strong>Transaction :</strong> {order.transaction_id}</p>
                                <p><strong>Total :</strong> {order.total} FCFA</p>
                                <p><strong>Mode paiement :</strong> {order.Mode_paiement}</p>
                                <p><strong>Personnalisé :</strong> {order.personnalise === 2 ? "Oui" : "Non"}</p>
                            </div>
                            <div>
                                <p><strong>Client :</strong> {order.nomUsers_orders}</p>
                                <p><strong>Email :</strong> {order.email_orders}</p>
                                <p><strong>Acheteur :</strong> {order.NomPrenomAchats}</p>
                                <p><strong>Email achat :</strong> {order.emailAchats}</p>
                                <p><strong>Entreprise :</strong> {order.EntrepriseAchats}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Personnalisation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {order.imgLogosAchats && (
                                <div>
                                    <p className="font-medium">Logo :</p>
                                    <Image src={`${getBaseUrlImg()}/${order.imgLogosAchats}`}
                                        alt="Logo"
                                        width={200}
                                        height={200}
                                        className="rounded border shadow"
                                    />
                                </div>
                            )}
                            <p><strong>Texte :</strong> {order.texteAchats || '—'}</p>
                            <p><strong>Couleur :</strong> {order.couleursAchats || '—'}</p>
                            <p><strong>Police :</strong> {order.policeAchats}</p>
                            <p><strong>Position :</strong> {order.PositionsFiles}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Produit</CardTitle>
                        </CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p><strong>Libellé :</strong> {order.libelle_realisations}</p>
                                <div dangerouslySetInnerHTML={{ __html: `<strong>Description :</strong> ${order.descript_real}` }} />
                            </div>
                            <div>
                                <Image src={`${getBaseUrlImg()}/${order.images_realisations}`} alt="Produit"
                                    width={300}
                                    height={200}
                                    className="rounded border object-cover shadow"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
