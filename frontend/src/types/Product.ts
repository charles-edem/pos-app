export interface Product {
    id: number;
    productName: string;
    price: number;
    stock: number;
    category: string;
    sku: string;
    addedAt: string;
}

export interface ProductFormData {
    productName: string;
    price: number;
    stock: number;
    category: string;
    sku: string;
}