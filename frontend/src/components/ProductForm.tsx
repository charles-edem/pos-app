import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { Product, ProductFormData } from "../types/Product";
import Dropdown from "./DropDown";

interface ProductFormProps {
    product?: Product | null;
    onAddProduct: (data: ProductFormData) => Promise<void> | void;
    onEditProduct?: (id: number, data: ProductFormData) => Promise<void> | void;
}

const CATEGORIES = [
    { value: "", label: "All categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing & Apparel" },
    { value: "shoes", label: "Shoes & Footwear" },
    { value: "food", label: "Food & Groceries" },
    { value: "beverages", label: "Beverages" },
    { value: "snacks", label: "Snacks & Confectionery" },
    { value: "household", label: "Household Items" },
    { value: "personal_care", label: "Personal Care" },
    { value: "beauty", label: "Beauty & Cosmetics" },
    { value: "health", label: "Health & Wellness" },
    { value: "baby", label: "Baby & Kids" },
    { value: "stationery", label: "Stationery & Office" },
    { value: "toys", label: "Toys & Games" },
    { value: "sports", label: "Sports & Fitness" },
    { value: "tools", label: "Tools & Hardware" },
    { value: "automotive", label: "Automotive" },
    { value: "other", label: "Other" },
];

export default function ProductForm({
    product,
    onAddProduct,
    onEditProduct,
}: ProductFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditMode = !!product;

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ProductFormData>();;

    useEffect(() => {
        if (product) {
            reset({
                productName: product.productName,
                price: product.price,
                stock: product.stock,
                category: product.category,
                sku: product.sku,
            });
        } else {
            reset({
                productName: "",
                price: undefined,
                stock: undefined,
                category: "",
                sku: "",
            });
        }
    }, [product, reset]);

    async function onSubmit(data: ProductFormData) {
        setIsSubmitting(true);
        try {
            if (isEditMode && onEditProduct) {
                await onEditProduct(product.id, data);
            } else {
                await onAddProduct(data);
                reset();
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto overflow-visible flex w-full max-w-md flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 font-poppins shadow-sm sm:p-6"
        >
            <div>
                <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
                    {isEditMode ? "Edit Product" : "Add Product"}
                </h1>
                <p className="mt-1 text-sm text-gray-400">
                    Fields marked <span className="text-red-500">*</span> are required
                </p>
            </div>

            <div className="form-field">
                <label htmlFor="productName" className="form-label">
                    Product Name <span className="text-red-500">*</span>
                </label>
                <input
                    id="productName"
                    type="text"
                    placeholder="Eg. Laptop"
                    aria-invalid={!!errors.productName}
                    className="input-modern"
                    {...register("productName", {
                        required: "Product name is required",
                    })}
                />
                {errors.productName && (
                    <p className="form-error">{errors.productName.message}</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="form-field">
                    <label htmlFor="price" className="form-label">
                        Price <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="999.99"
                        onWheel={(e) => e.currentTarget.blur()}
                        aria-invalid={!!errors.price}
                        className="input-modern"
                        {...register("price", {
                            required: "Required",
                            valueAsNumber: true,
                            min: { value: 0.01, message: "Must be > 0" },
                        })}
                    />
                    {errors.price && (
                        <p className="form-error">{errors.price.message}</p>
                    )}
                </div>

                <div className="form-field">
                    <label htmlFor="stock" className="form-label">
                        In Stock <span className="text-red-500">*</span>
                    </label>
                    <input
                        id="stock"
                        type="number"
                        min="0"
                        placeholder="10"
                        onWheel={(e) => e.currentTarget.blur()}
                        aria-invalid={!!errors.stock}
                        className="input-modern"
                        {...register("stock", {
                            required: "Required",
                            valueAsNumber: true,
                            min: { value: 0, message: "Can't be negative" },
                        })}
                    />
                    {errors.stock && (
                        <p className="form-error">{errors.stock.message}</p>
                    )}
                </div>
            </div>

            <div className="form-field">
                <label htmlFor="category" className="form-label">
                    Category <span className="text-red-500">*</span>
                </label>

                <Controller
                    name="category"
                    control={control}
                    rules={{
                        required: "Please select a category",
                    }}
                    render={({ field }) => (
                        <Dropdown
                            options={CATEGORIES}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select a category"
                            placement="top"
                        />
                    )}
                />

                {errors.category && (
                    <p className="form-error">
                        {errors.category.message}
                    </p>
                )}
            </div>

            <div className="form-field">
                <label htmlFor="sku" className="form-label">
                    SKU <span className="text-red-500">*</span>
                </label>
                <input
                    id="sku"
                    type="text"
                    placeholder="Eg. LAP-0001"
                    aria-invalid={!!errors.sku}
                    className="input-modern"
                    {...register("sku", { required: "SKU is required" })}
                />
                {errors.sku && <p className="form-error">{errors.sku.message}</p>}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
                {isSubmitting
                    ? isEditMode
                        ? "Saving..."
                        : "Adding..."
                    : isEditMode
                        ? "Save Changes"
                        : "Add Product"}
            </button>
        </form>
    );
}