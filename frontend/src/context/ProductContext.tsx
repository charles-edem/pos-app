import { createContext, useContext } from "react";
import type { Product } from "../types/Product";

type ProductContextType = {
    products: Product[];
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

export const ProductContext =
    createContext<ProductContextType | undefined>(undefined);

export function useProducts() {
    const context = useContext(ProductContext);

    if (!context) {
        throw new Error(
            "useProducts must be used inside ProductProvider"
        );
    }

    return context;
}