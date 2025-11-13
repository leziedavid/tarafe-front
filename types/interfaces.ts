// interfaces.ts

// ===========================
// ENUMS
// ===========================
export enum Role {
    ADMIN = "ADMIN",
    PROVIDER = "PROVIDER",
    CLIENT = "CLIENT",
    GUEST = "GUEST",
}

export enum AccountType {
    COMPANY = "COMPANY",
    INDIVIDUAL = "INDIVIDUAL",
    ENTERPRISE = "ENTERPRISE",
}

export enum ServiceType {
    APPOINTMENT = "APPOINTMENT",
    ORDER = "ORDER",
    PRODUCT = "PRODUCT",
    MIXED = "MIXED",
}

export enum TransactionStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
}

export enum AppointmentStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}



export enum OrderStatus {
    NEW = "NEW",
    PROCESSING = "PROCESSING",
    READY = "READY",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
}

// ===========================
// MODELS (Simplifiés pour le front-end)
// ===========================
export interface Country {
    id: string;
    name: string;
    code?: string;
}

export interface City {
    id: string;
    name: string;
    countryId: string;
}

export interface Commune {
    id: string;
    name: string;
    cityId: string;
}

export interface Quarter {
    id: string;
    name: string;
    communeId: string;
}

export interface ServiceCategory {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceSubcategory {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
    serviceType: ServiceType[];
    createdAt: string;
    updatedAt: string;
}

export interface UserCategory {
    id: string;
    userId: string;
    categoryId: string;
    category: ServiceCategory;
    createdAt: string;
}

export interface UserSubcategory {
    id: string;
    userId: string;
    subcategoryId: string;
    subcategory: ServiceSubcategory;
    createdAt: string;
}

export interface FileManager {
    id: number;
    fileCode: string;
    fileName: string;
    fileMimeType: string;
    fileSize: number;
    fileUrl: string;
    fileType: string;
    targetId: string;
    filePath?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Icone {
    id: string;
    name: string;
    description?: string;
    iconUrl: string;
    createdAt: string;
    updatedAt: string;
}
export interface Wallet {
    id: string;
    userId: string;
    balanceCents: number;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    phone?: string;
    typeCompte: AccountType;
    roles: Role[];
    companyName?: string;
    createdAt: string;
    updatedAt: string;
    countryId?: string;
    cityId?: string;
    communeId?: string;
    quarterId?: string;
    userGPS?: { lat: number; lng: number };
    wallet?: Wallet;
    // Relations
    providedServices?: Service[];
    clientOrders?: Order[];
    providerOrders?: Order[];
    clientAppointments?: Appointment[];
    providerAppointments?: Appointment[];
    transactions?: Transaction[];
    selectedCategories?: UserCategory[];
    selectedSubcategories?: UserSubcategory[];
    iconId?: string;
    icone?: Icone;
    images?: string;
}

export interface Service {
    id: string;
    title: string;
    description?: string;
    providerId?: string;
    serviceType: ServiceType;
    basePriceCents?: number;
    subcategoryId?: string;
    createdAt: string;
    updatedAt: string;
    countryId?: string;
    cityId?: string;
    communeId?: string;
    quarterId?: string;
    serviceGPS?: { lat: number; lng: number };
    iconId?: string;
    icone?: Icone;
    images?: string;
    //relations
    categoryId?: string;
    category?: ServiceCategory;
    subcategory?: ServiceSubcategory;
    appointments?: Appointment[];
    orderItems?: OrderItem[];
    userLinks?: UserSubcategory[];

}

export interface Appointment {
    id: string;
    serviceId: string;
    providerId: string;
    clientId?: string;
    client: User;
    transactionId?: string;
    scheduledAt?: string;
    durationMins?: number;
    priceCents?: number;
    status: AppointmentStatus;
    providerNotes?: string;
    service: Service;
    createdAt: string;
    updatedAt: string;
    
}

export interface Order {
    id: string;
    clientId?: string;
    providerId?: string;
    transactionId?: string;
    status: OrderStatus;
    totalCents: number;
    instructions?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    orderId: string;
    serviceId: string;
    quantity: number;
    unitPriceCents: number;
    title: string;
    createdAt: string;
    updatedAt: string;
}

export interface Transaction {
    id: string;
    userId?: string;
    amountCents: number;
    currency: string;
    status: TransactionStatus;
    description?: any;
    createdAt: string;
    updatedAt: string;
}
