import ExportExcel from "../components/ExportExcel";
import { useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    Package,
} from "lucide-react";
import type { StockMovement } from "../types/StockMovements";
import { useTransactions } from "../hooks/useTransaction";

export default function Reports() {
    const [movements] = useState<StockMovement[]>(() => {
        const saved = localStorage.getItem("stockMovements");

        return saved ? JSON.parse(saved) : [];
    });

    const exportData = movements.map((movement) => ({
        "Product Name": movement.product,
        Movement:
            movement.type === "increase"
                ? `+${movement.quantity}`
                : `-${movement.quantity}`,
        Quantity: movement.quantity,
        Type:
            movement.type === "increase"
                ? "Stock Added"
                : "Stock Removed",
        Reason: movement.reason,
        Date: new Date(movement.date).toLocaleString("en-GH"),
    }));
    const { transactions } = useTransactions();

    const transactionExportData = transactions.map((transaction) => ({
        "Transaction ID": transaction.id,
        Status: transaction.status,
        "Item Count": transaction.itemCount,
        Subtotal: transaction.subtotal,
        "Delivery Fee": transaction.deliveryFee,
        Total: transaction.total,
        Date: new Date(transaction.time).toLocaleString("en-GH"),
        Items: transaction.items
            .map(
                (item) =>
                    `${item.productName} x${item.quantity} @ GHS ${item.price}`
            )
            .join(", "),
    }));

    const [expandedTransaction, setExpandedTransaction] = useState<string | null>(
        null
    );

    return (
        <div className="min-w-0 w-full p-5">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Reports
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    View and analyze your inventory activity.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Stock Movement
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Review changes made to your product stocks.
                        </p>
                    </div>

                    <ExportExcel
                        data={exportData}
                        fileName="stock-movement-report"
                        sheetName="Stock Movements"
                    />
                </div>
                {movements.length === 0 ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <Package className="h-5 w-5 text-gray-400" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-gray-700">
                            No stock movements yet
                        </p>

                        <p className="mt-1 max-w-sm text-xs text-gray-400">
                            Stock adjustments will appear here when inventory
                            quantities are changed.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">
                                        Movement
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">
                                        Reason
                                    </th>

                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500">
                                        Date
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-gray-100">
                                {[...movements]
                                    .reverse()
                                    .map((movement) => (
                                        <tr
                                            key={movement.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {movement.product}
                                                </p>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${movement.type ===
                                                        "increase"
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-600"
                                                        }`}
                                                >
                                                    {movement.type ===
                                                        "increase" ? (
                                                        <ArrowUp className="h-3 w-3" />
                                                    ) : (
                                                        <ArrowDown className="h-3 w-3" />
                                                    )}

                                                    {movement.type ===
                                                        "increase"
                                                        ? `+${movement.quantity}`
                                                        : `-${movement.quantity}`}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {movement.reason}
                                            </td>

                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(
                                                    movement.date
                                                ).toLocaleString("en-GH", {
                                                    dateStyle: "medium",
                                                    timeStyle: "short",
                                                })}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div>
                        <h2 className="text-base font-bold text-gray-900">
                            Transaction History
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            View complete details of every sale transaction.
                        </p>
                    </div>

                    <ExportExcel
                        data={transactionExportData}
                        fileName="transaction-history-report"
                        sheetName="Transactions"
                    />
                </div>
                {transactions.length === 0 ? (
                    <div className="flex min-h-[220px] flex-col items-center justify-center px-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <Package className="h-5 w-5 text-gray-400" />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-gray-700">
                            No transactions yet
                        </p>

                        <p className="mt-1 max-w-sm text-xs text-gray-400">
                            Completed and declined sales will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {transactions.map((transaction) => {
                            const isExpanded =
                                expandedTransaction === transaction.id;

                            return (
                                <div key={transaction.id}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setExpandedTransaction(
                                                isExpanded ? null : transaction.id
                                            )
                                        }
                                        className="w-full px-6 py-5 text-left transition-colors hover:bg-gray-50"
                                    >
                                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {transaction.id}
                                                    </p>

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${transaction.status ===
                                                            "completed"
                                                            ? "bg-green-50 text-green-600"
                                                            : "bg-red-50 text-red-600"
                                                            }`}
                                                    >
                                                        {transaction.status ===
                                                            "completed"
                                                            ? "Completed"
                                                            : "Declined"}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-gray-500">
                                                    {new Date(
                                                        transaction.time
                                                    ).toLocaleString("en-GH", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-8">
                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Items
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                                        {transaction.itemCount}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-400">
                                                        Total
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                                        {new Intl.NumberFormat(
                                                            "en-GH",
                                                            {
                                                                style: "currency",
                                                                currency: "GHS",
                                                            }
                                                        ).format(transaction.total)}
                                                    </p>
                                                </div>

                                                <div className="text-gray-500 cursor-pointer">
                                                    {isExpanded ? "-" : "+"}
                                                </div>
                                            </div>
                                        </div>
                                    </button>

                                    {isExpanded && (
                                        <div className="border-t border-gray-100 bg-gray-50 px-6 py-5 transition">
                                            <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        Items
                                                    </h3>

                                                    <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-white">
                                                        <div className="overflow-x-auto">
                                                            <table className="w-full text-left">
                                                                <thead className="bg-gray-50">
                                                                    <tr>
                                                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                                                                            Product
                                                                        </th>

                                                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                                                                            SKU
                                                                        </th>

                                                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                                                                            Qty
                                                                        </th>

                                                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                                                                            Unit Price
                                                                        </th>

                                                                        <th className="px-4 py-3 text-xs font-semibold text-gray-500">
                                                                            Amount
                                                                        </th>
                                                                    </tr>
                                                                </thead>

                                                                <tbody className="divide-y divide-gray-100">
                                                                    {transaction.items.map(
                                                                        (item) => (
                                                                            <tr
                                                                                key={
                                                                                    item.id
                                                                                }
                                                                            >
                                                                                <td className="px-4 py-3">
                                                                                    <p className="text-sm font-medium text-gray-900">
                                                                                        {
                                                                                            item.productName
                                                                                        }
                                                                                    </p>
                                                                                </td>

                                                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                                                    {item.sku ||
                                                                                        "—"}
                                                                                </td>

                                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                                    {
                                                                                        item.quantity
                                                                                    }
                                                                                </td>

                                                                                <td className="px-4 py-3 text-sm text-gray-700">
                                                                                    {new Intl.NumberFormat(
                                                                                        "en-GH",
                                                                                        {
                                                                                            style: "currency",
                                                                                            currency:
                                                                                                "GHS",
                                                                                        }
                                                                                    ).format(
                                                                                        item.price
                                                                                    )}
                                                                                </td>

                                                                                <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                                                                                    {new Intl.NumberFormat(
                                                                                        "en-GH",
                                                                                        {
                                                                                            style: "currency",
                                                                                            currency:
                                                                                                "GHS",
                                                                                        }
                                                                                    ).format(
                                                                                        item.price *
                                                                                        item.quantity
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <h3 className="text-sm font-semibold text-gray-900">
                                                        Transaction Summary
                                                    </h3>

                                                    <div className="mt-3 rounded-xl border border-gray-200 bg-white p-5">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">
                                                                Subtotal
                                                            </span>

                                                            <span className="text-sm font-medium text-gray-900">
                                                                {new Intl.NumberFormat(
                                                                    "en-GH",
                                                                    {
                                                                        style: "currency",
                                                                        currency: "GHS",
                                                                    }
                                                                ).format(
                                                                    transaction.subtotal
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-between">
                                                            <span className="text-sm text-gray-500">
                                                                Delivery
                                                            </span>

                                                            <span className="text-sm font-medium text-gray-900">
                                                                {new Intl.NumberFormat(
                                                                    "en-GH",
                                                                    {
                                                                        style: "currency",
                                                                        currency: "GHS",
                                                                    }
                                                                ).format(
                                                                    transaction.deliveryFee
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="my-4 border-t border-gray-100" />

                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-semibold text-gray-900">
                                                                Total
                                                            </span>

                                                            <span className="text-base font-bold text-gray-900">
                                                                {new Intl.NumberFormat(
                                                                    "en-GH",
                                                                    {
                                                                        style: "currency",
                                                                        currency: "GHS",
                                                                    }
                                                                ).format(
                                                                    transaction.total
                                                                )}
                                                            </span>
                                                        </div>

                                                        <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2">
                                                            <p className="text-xs text-gray-500">
                                                                Transaction ID
                                                            </p>

                                                            <p className="mt-1 text-sm font-medium text-gray-900">
                                                                {transaction.id}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div >
    );
}
