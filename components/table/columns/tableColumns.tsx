'use client';

import { useState } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CategoryProduct, MyOrder, OrderStatus, SubCategoryProduct } from "@/types/interfaces";
import { Demande } from "@/types/interfaces";

// ===========================
// Switch de statut générique
// ===========================
type StatusSwitchProps<T> = { type: "user" | "appointment" | "order" | "transaction"; status: T; };

export const StatusSwitch = <T,>({ type, status }: StatusSwitchProps<T>) => {
    const [checked, setChecked] = useState(() => {
        switch (type) {
            case "order": return status === OrderStatus.READY;
            default: return false;
        }
    });

    const handleToggle = (value: boolean) => {
        setChecked(value);
        let newStatus: any;

        switch (type) {
            // case "user":
            //     newStatus = value ? UserStatus.ACTIVE : UserStatus.INACTIVE;
            //     break;
            // case "appointment":
            //     newStatus = value ? AppointmentStatus.CONFIRMED : AppointmentStatus.CANCELLED;
            //     break;
            case "order":
                newStatus = value ? OrderStatus.READY : OrderStatus.CANCELLED;
                break;
            // case "transaction":
            //     newStatus = value ? TransactionStatus.COMPLETED : TransactionStatus.PENDING;
            //     break;
        }

        console.log(`Changement de statut pour ${type}:`, newStatus);
        // Ici tu peux faire ton appel API pour mettre à jour le status
    };

    return (
        <div className="flex items-center space-x-2">
            <Switch checked={checked} onCheckedChange={handleToggle} id={`${type}-switch`} />
            <Label htmlFor={`${type}-switch`} className="text-xs">
                {checked ? "Actif" : "Inactif"}
            </Label>
        </div>
    );
};


// ===========================
// MyOrders (Legacy / Boutique)
// ===========================
export const MyOrdersColumns = (): any[] => [
    { key: "id_orders", name: "ID" },
    { key: "transaction_id", name: "Transaction" },
    { key: "nomUsers_orders", name: "Client" },
    { key: "email_orders", name: "Email" },
    { key: "Mode_paiement", name: "Paiement", },
    {
        key: "total",
        name: "Total",
        render: (item: MyOrder) => `${item.total} FCFA`,
    },
    {
        key: "status_orders",
        name: "Statut",
        render: (item: MyOrder) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium  ${item.status_orders === "0" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`} >
                {item.status_orders === "0" ? "En attente" : "Validé"}
            </span>
        ),
    },

    {
        key: "date_orders",
        name: "Date",
        render: (item: MyOrder) => `${item.date_orders} à ${item.heurs_orders}`,
    },

    {
        key: "created_at",
        name: "Créé le",
        render: (item: MyOrder) => new Date(item.created_at).toLocaleDateString(),
    },
];

// ===========================
// Colonnes DEMANDES
// ===========================
export const DemandesColumns = (): any[] => [
    {
        key: "id",
        name: "ID",
    },


    {
        key: "realisation",
        name: "Réalisation",
        render: (item: Demande) => (
            <div className="flex items-center gap-3">
                {item.realisation?.images_realisations && (
                    <Image
                        src={item.realisation.images_realisations}
                        alt={item.realisation.libelle_realisations}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                    />
                )}
                <div className="flex flex-col">
                    <span className="text-sm font-medium">
                        {item.realisation?.libelle_realisations}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {item.realisation?.code_realisation}
                    </span>
                </div>
            </div>
        ),
    },


    {
        key: "nom_prenom",
        name: "Client",
        render: (item: Demande) => (
            <div className="flex flex-col">
                <span className="font-medium">{item.nom_prenom}</span>
                {item.entreprise && (
                    <span className="text-xs text-muted-foreground">
                        {item.entreprise}
                    </span>
                )}
            </div>
        ),
    },

    {
        key: "email",
        name: "Email",
    },

    {
        key: "numero",
        name: "Téléphone",
    },


    {
        key: "position",
        name: "Position",
        render: (item: Demande) => (
            <span className="text-xs px-2 py-1 rounded bg-gray-100">
                {item.position}
            </span>
        ),
    },

    {
        key: "dimension",
        name: "Dimension",
    },

    {
        key: "colors",
        name: "Couleurs",
    },


    {
        key: "files",
        name: "Fichiers",
        render: (item: Demande) => {
            try {
                const files = JSON.parse(item.files || "[]");
                return (
                    <span className="text-xs font-medium">
                        {files.length} fichier(s)
                    </span>
                );
            } catch {
                return <span className="text-xs text-muted-foreground">—</span>;
            }
        },
    },

    {
        key: "status",
        name: "Statut",
        render: (item: any) => (
            <StatusSwitch type="order" status={item.status} />
        ),
    },

    {
        key: "created_at",
        name: "Créée le",
        render: (item: any) =>
            new Date(item.created_at).toLocaleDateString("fr-FR"),
    },
];

import { Transaction } from "@/types/interfaces";

// ===========================
// Colonnes TRANSACTIONS
// ===========================

export const TransactionsColumns = (): any[] => [
    {
        key: "id",
        name: "ID",
    },

    {
        key: "date",
        name: "Date",
        render: (item: Transaction) =>
            new Date(item.date).toLocaleDateString("fr-FR"),
    },

    {
        key: "libelle",
        name: "Libellé",
        render: (item: Transaction) => (
            <span className="font-medium">{item.libelle}</span>
        ),
    },

    {
        key: "categorie_label",
        name: "Catégorie",
        render: (item: Transaction) => (
            <span className="text-md px-2 py-1 rounded bg-gray-100">
                {item.categorie_label}
            </span>
        ),
    },

    {
        key: "type_operation",
        name: "Paiement",
        render: (item: Transaction) => (
            <span className="text-xs font-medium">
                {item.type_operation}
            </span>
        ),
    },

    {
        key: "sortie_caisse",
        name: "Sortie caisse",
        render: (item: Transaction) => (
            <span className="font-medium">
                -{item.sortie_caisse} FCFA
            </span>
        ),
    },

    {
        key: "entree_caisse",
        name: "Entrée caisse",
        render: (item: Transaction) => (
            <span className="font-medium">
                +{item.entree_caisse} FCFA
            </span>
        ),
    },

    {
        key: "sortie_banque",
        name: "Sortie banque",
        render: (item: Transaction) => (
            <span className="font-medium">
                -{item.sortie_banque} FCFA
            </span>
        ),
    },

    {
        key: "entree_banque",
        name: "Entrée banque",
        render: (item: Transaction) => (
            <span className="font-medium">
                +{item.entree_banque} FCFA
            </span>
        ),
    },

    {
        key: "details",
        name: "Détails",
        render: (item: Transaction) => (
            <span className="text-md text-muted-foreground line-clamp-2">
                {item.details}
            </span>
        ),
    },

    {
        key: "created_at",
        name: "Créée le",
        render: (item: Transaction) =>
            new Date(item.created_at).toLocaleDateString("fr-FR"),
    },
];


export const CategoryProductColumns = (): any[] => [
    {
        key: "id",
        name: "ID",
    },
    {
        key: "name",
        name: "Nom",
    },
    {
        key: "slug",
        name: "Slug",
    },
    {
        key: "created_at",
        name: "Créé le",
        render: (item: CategoryProduct) => item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : "—",
    },
];

export const SubCategoryProductColumns = (): any[] => [
    {
        key: "id",
        name: "ID",
    },
    {
        key: "name",
        name: "Nom",
    },
    {
        key: "slug",
        name: "Slug",
    },
    {
        key: "category",
        name: "Catégorie",
        render: (item: SubCategoryProduct) => (<span className="text-md px-2 py-1 rounded bg-gray-100"> {item.category?.name}  </span>),
    },

    {
        key: "created_at",
        name: "Créé le",
        render: (item: SubCategoryProduct) => item.created_at ? new Date(item.created_at).toLocaleDateString("fr-FR") : "—",
    },
];