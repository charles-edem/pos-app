import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { ProductContext } from "./ProductContext";

export function ProductProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [products, setProducts] = useState<Product[]>(() => {
        const saved = localStorage.getItem("products");

        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("products", JSON.stringify(products));
    }, [products]);

    return (
        <ProductContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductContext.Provider>
    );
}
