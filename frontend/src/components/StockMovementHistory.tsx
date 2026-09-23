import { ArrowDown, ArrowUp, Package } from "lucide-react";
import type { StockMovement } from "../types/StockMovements";

interface StockMovementHistoryProps {
    movements: StockMovement[];
}

export default function StockMovementHistory({
    movements,
}: StockMovementHistoryProps) {
    return (
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-100 bg-white">
            <div className="border-b border-gray-100 px-6 py-5">
                <h2 className="text-base font-bold text-gray-900">
                    Stock Movement History
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Recent changes made to your product stocks.
                </p>
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
                            {movements.map((movement) => (
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
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                                                movement.type === "increase"
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {movement.type === "increase" ? (
                                                <ArrowUp className="h-3 w-3" />
                                            ) : (
                                                <ArrowDown className="h-3 w-3" />
                                            )}

                                            {movement.type === "increase"
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
    );
}