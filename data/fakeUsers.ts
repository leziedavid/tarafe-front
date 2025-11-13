// data/fakeUsers.ts
import {
    User,
    Role,
    AccountType,
    Wallet,
    Service,
    ServiceType,
    Transaction,
    ServiceCategory,
    ServiceSubcategory,
    TransactionStatus,
} from "@/types/interfaces";
import { fakeCategories, fakeSubcategories } from "./fackeSimules";

/**
 * NOTE:
 * - Les objets `Service`, `Wallet`, `Transaction` sont volontairement simplifiés pour le front.
 * - Ajuste les imports/chemins si nécessaire selon ta structure de projet.
 */

const now = new Date().toISOString();

const sampleCategory: ServiceCategory = {
    id: "cat1",
    name: "Services généraux",
    description: "Catégorie exemple",
    createdAt: now,
    updatedAt: now,
};

const sampleSubcat: ServiceSubcategory = {
    id: "sub1",
    name: "Nettoyage",
    description: "Nettoyage à domicile et véhicule",
    categoryId: sampleCategory.id,
    serviceType: [ServiceType.MIXED],
    createdAt: now,
    updatedAt: now,
};

const sampleService: Service = {
    id: "svc-1",
    title: "Nettoyage complet maison",
    description: "Nettoyage intérieur + extérieur, 2 personnes, 3h",
    providerId: "user-provider-1",
    serviceType: ServiceType.APPOINTMENT,
    basePriceCents: 25000,
    subcategoryId: sampleSubcat.id,
    createdAt: now,
    updatedAt: now,
    countryId: "ci",
    cityId: "abj",
};

const walletClient: Wallet = {
    id: "w-client-1",
    userId: "user-client-1",
    balanceCents: 15000, // 150.00 (assuming cents)
    currency: "XOF",
    createdAt: now,
    updatedAt: now,
};

const walletProvider: Wallet = {
    id: "w-provider-1",
    userId: "user-provider-1",
    balanceCents: 500000, // 5000.00
    currency: "XOF",
    createdAt: now,
    updatedAt: now,
};

const tx1: Transaction = {
    id: "tx-1",
    userId: "user-client-1",
    amountCents: 100000, // 1000 F
    currency: "XOF",
    status: TransactionStatus.PENDING,
    description: "Paiement recharge wallet",
    createdAt: now,
    updatedAt: now,
};

const tx2: Transaction = {
    id: "tx-2",
    userId: "user-provider-1",
    amountCents: 250000, // 2500 F reçu
    currency: "XOF",
    status:  TransactionStatus.COMPLETED,
    description: "Paiement service - nettoyage",
    createdAt: now,
    updatedAt: now,
};

export const fakeUsers: User[] = [
    // --------------------
    // PRESTATAIRE / COMPANY
    // --------------------
    {
        id: "user-provider-1",
        email: "service.pro@example.ci",
        name: "Service Pro SARL",
        phone: "0700000002",
        typeCompte: AccountType.COMPANY,
        roles: [Role.PROVIDER],
        companyName: "Service Pro SARL",
        createdAt: now,
        updatedAt: now,
        countryId: "CI",
        cityId: "1",
        communeId: "1",
        quarterId: "1",
        userGPS: { lat: 5.325, lng: -3.98 },
        wallet: walletProvider,
        providedServices: [sampleService],
        transactions: [tx2],
        selectedCategories: [
            {
                id: "cat-1",
                userId: "user-provider-1",
                categoryId: fakeCategories[0].id,
                category: fakeCategories[0],
                createdAt: now,
            },
            {
                id: "cat-2",
                userId: "user-provider-1",
                categoryId: fakeCategories[1].id,
                category: fakeCategories[1],
                createdAt: now,
            },
        ],
        selectedSubcategories: [
            {
                id: "sub-1",
                userId: "user-provider-1",
                subcategoryId: fakeSubcategories[0].id,
                subcategory: fakeSubcategories[0],
                createdAt: now,
            },
            {
                id: "sub-2",
                userId: "user-provider-1",
                subcategoryId: fakeSubcategories[2].id,
                subcategory: fakeSubcategories[2],
                createdAt: now,
            },
        ],
        images: "",
    },

];

export default fakeUsers;
