import { useState } from "react";
import { Pencil, Trash2, AlertTriangle, SlidersHorizontal } from "lucide-react";
import type { Product } from "../types/Product";
import DeleteProductModal from "./DeleteProductModal";

interface ProductCardProps {
    product: Product;
    onDelete: (id: number) => void;
    onEdit: (id: number) => void;
    onSelect: (id: number) => void;
    onAdjustStock: (id: number) => void
    checked: boolean;
}

const currencyFormatter = new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
});

function getStockStatus(stock: number) {
    if (stock === 0) {
        return {
            label: "Out of stock",
            className: "bg-red-50 text-red-600",
        };
    }

    if (stock <= 10) {
        return {
            label: "Low stock",
            className: "bg-amber-50 text-amber-600",
        };
    }

    return {
        label: "In stock",
        className: "bg-green-50 text-green-600",
    };
}

export default function ProductCard({
    product,
    onEdit,
    onDelete,
    onSelect,
    onAdjustStock,
    checked,
}: ProductCardProps) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const stockStatus = getStockStatus(product.stock);

    function handleConfirmDelete() {
        onDelete(product.id);
        setIsDeleteOpen(false);
    }

    return (
        <>
            <tr className="transition-colors duration-150 hover:bg-gray-50">
                <td className="px-4 py-2">
                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            className="h-3.5 w-3.5 cursor-pointer"
                            checked={checked}
                            onChange={() => onSelect(product.id)}
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">
                                {product.productName}
                            </p>

                            <p className="mt-0.5 text-[11px] text-gray-400">
                                SKU: {product.sku}
                            </p>
                        </div>
                    </div>
                </td>
                <td className="px-5 py-2">
                    <span className="inline-flex w-28 justify-center rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-medium capitalize text-gray-600">
                        {product.category}
                    </span>
                </td>
                <td className="px-5 py-2">
                    <span className="text-sm font-semibold text-gray-900">
                        {currencyFormatter.format(product.price)}
                    </span>
                </td>

                <td className="px-5 py-2">
                    <div
                        className={`inline-flex w-28 items-center justify-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${stockStatus.className}`}
                    >
                        {product.stock <= 10 && (
                            <AlertTriangle className="h-3 w-3" />
                        )}

                        <span>
                            {product.stock === 0
                                ? stockStatus.label
                                : `${product.stock} ${product.stock === 1 ? "item" : "items"
                                }`}
                        </span>
                    </div>
                </td>
                <td className="px-5 py-2">
                    <div className="flex items-center justify-end gap-1.5">
                        <button
                            type="button"
                            onClick={() => onEdit(product.id)}
                            aria-label={`Edit ${product.productName}`}
                            className="flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1.5 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-500 hover:text-white"
                        >
                            <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => onAdjustStock(product.id)}
                            aria-label={`Adjust ${product.productName} stock`}
                            className="flex cursor-pointer items-center gap-1 rounded-lg px-1.5 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-500 hover:text-white"
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(true)}
                            aria-label={`Delete ${product.productName}`}
                            className="flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-red-500 transition-all duration-200 hover:bg-red-500 hover:text-white"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </td>
            </tr>

            {isDeleteOpen && (
                <DeleteProductModal
                    message={product.productName}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
}