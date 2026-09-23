import { useWatch, useForm, Controller } from "react-hook-form";
import { Minus, Plus, X } from "lucide-react";
import type { Product } from "../types/Product";
import Dropdown from "./DropDown";

interface StockAdjustmentModalProps {
    product: Product;
    onClose: () => void;
    onAdjust: (
        quantity: number,
        type: "increase" | "decrease",
        reason: string
    ) => void;
}

interface StockAdjustmentForm {
    quantity: string;
    type: "increase" | "decrease";
    reason: string;
}

export default function StockAdjustmentModal({
    product,
    onClose,
    onAdjust,
}: StockAdjustmentModalProps) {
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors },
    } = useForm<StockAdjustmentForm>({
        defaultValues: {
            quantity: "1",
            type: "increase",
            reason: "",
        },
    });

    const quantity = useWatch({
        control,
        name: "quantity",
    });

    const type = useWatch({
        control,
        name: "type",
    });

    const parsedQuantity = Number(quantity) || 0;

    const newStock =
        type === "increase"
            ? product.stock + parsedQuantity
            : product.stock - parsedQuantity;

    const stockIncreaseOptions = [
        { value: "", label: "Select reason" },
        { value: "Restock", label: "Restock" },
        { value: "Return", label: "Customer return" },
        { value: "Correction", label: "Stock correction" },
        { value: "Other", label: "Other" },
    ];

    const stockDecreaseOptions = [
        { value: "", label: "Select reason" },
        { value: "Damaged", label: "Damaged" },
        { value: "Lost", label: "Lost" },
        { value: "Correction", label: "Stock correction" },
        { value: "Other", label: "Other" },
    ];

    const stockAdjustmentOptions =
        type === "increase"
            ? stockIncreaseOptions
            : stockDecreaseOptions;

    function handleIncrease() {
        setValue("type", "increase");
        setValue("reason", "");

        setValue("quantity", String(parsedQuantity + 1));
    }

    function handleDecrease() {
        setValue("type", "decrease");
        setValue("reason", "");

        setValue(
            "quantity",
            String(Math.max(1, parsedQuantity - 1))
        );
    }

    function handleQuantityChange(value: string) {
        if (value === "") {
            setValue("quantity", "");
            return;
        }

        if (!/^\d+$/.test(value)) {
            return;
        }

        setValue("quantity", value);
    }

    function onSubmit(data: StockAdjustmentForm) {
        const parsed = Number(data.quantity);

        if (data.type === "decrease" && parsed > product.stock) {
            return;
        }

        onAdjust(parsed, data.type, data.reason);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">
                            Adjust Stock
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {product.productName}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="mb-6 rounded-xl bg-gray-50 p-4">
                    <p className="text-xs font-medium text-gray-500">
                        Current stock
                    </p>

                    <p className="mt-1 text-2xl font-bold text-gray-900">
                        {product.stock}
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Stock adjustment
                        </label>

                        <div className="flex items-center justify-center gap-5">
                            {/* MINUS */}
                            <button
                                type="button"
                                onClick={handleDecrease}
                                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                                    type === "decrease"
                                        ? "border-red-300 bg-red-50 text-red-600"
                                        : "border-gray-200 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                }`}
                                aria-label="Decrease stock"
                            >
                                <Minus className="h-4 w-4" />
                            </button>

                            {/* QUANTITY */}
                            <div className="flex items-center">
                                <span
                                    className={`text-2xl font-bold ${
                                        type === "increase"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {type === "increase" ? "+" : "-"}
                                </span>

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    {...register("quantity", {
                                        required: "Quantity is required.",
                                        validate: (value) => {
                                            const number = Number(value);

                                            if (!number || number <= 0) {
                                                return "Enter a valid quantity.";
                                            }

                                            if (
                                                type === "decrease" &&
                                                number > product.stock
                                            ) {
                                                return `You can only remove up to ${product.stock} units.`;
                                            }

                                            return true;
                                        },
                                    })}
                                    onChange={(e) =>
                                        handleQuantityChange(
                                            e.target.value
                                        )
                                    }
                                    className={`w-20 border-none bg-transparent text-center text-2xl font-bold outline-none ${
                                        type === "increase"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                    aria-label="Adjustment quantity"
                                />
                            </div>

                            {/* PLUS */}
                            <button
                                type="button"
                                onClick={handleIncrease}
                                className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border transition-colors ${
                                    type === "increase"
                                        ? "border-green-300 bg-green-50 text-green-600"
                                        : "border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                                }`}
                                aria-label="Increase stock"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        {errors.quantity ? (
                            <p className="mt-2 text-center text-xs text-red-500">
                                {errors.quantity.message}
                            </p>
                        ) : (
                            <p className="mt-2 text-center text-xs text-gray-400">
                                Use + to add stock or - to remove stock
                            </p>
                        )}
                    </div>

                    {/* NEW STOCK */}
                    <div className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">
                                New stock
                            </span>

                            <span
                                className={`text-lg font-bold ${
                                    newStock < 0
                                        ? "text-red-600"
                                        : "text-gray-900"
                                }`}
                            >
                                {newStock}
                            </span>
                        </div>
                    </div>

                    {/* REASON */}
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Reason
                        </label>

                        <Controller
                            name="reason"
                            control={control}
                            rules={{
                                required: "Please select a reason.",
                            }}
                            render={({ field }) => (
                                <Dropdown
                                    options={stockAdjustmentOptions}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select reason"
                                    placement="top"
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />
                            )}
                        />

                        {errors.reason && (
                            <p className="mt-1 text-xs text-red-500">
                                {errors.reason.message}
                            </p>
                        )}
                    </div>

                    {/* BUTTONS */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                        >
                            Adjust Stock
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}