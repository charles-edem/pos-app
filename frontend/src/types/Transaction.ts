import type { Product } from "./Product";

export interface TransactionItem extends Product {
    quantity: number;
}

export interface Transaction {
    id: string;
    items: TransactionItem[];
    itemCount: number;
    subtotal: number;
    deliveryFee: number;
    total: number;
    status: "completed" | "declined";
    time: string;
}