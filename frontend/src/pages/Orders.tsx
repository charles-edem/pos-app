import { useProducts } from "../context/ProductContext.tsx";
import { useMemo, useState } from "react";
import {
    LayoutGrid,
    Smartphone,
    Shirt,
    Footprints,
    ShoppingBasket,
    Coffee,
    Cookie,
    Home,
    Heart,
    Sparkles,
    Pill,
    Baby,
    NotebookPen,
    Gamepad2,
    Dumbbell,
    Wrench,
    Car,
    Package,
    X,
    Plus,
    Minus,
    Trash2,
    Search,
    Clock,
    CheckCircle2,
    XCircle,
    ShoppingCart,
    PackageOpen,
    DotIcon,
} from "lucide-react";
import type { Product } from "../types/Product";
import Dropdown from "../components/DropDown";
import { useTransactions } from "../hooks/useTransaction";

const CATEGORY_ICONS: Record<string, React.ElementType> = {
    "": LayoutGrid,
    electronics: Smartphone,
    clothing: Shirt,
    shoes: Footprints,
    food: ShoppingBasket,
    beverages: Coffee,
    snacks: Cookie,
    household: Home,
    personal_care: Heart,
    beauty: Sparkles,
    health: Pill,
    baby: Baby,
    stationery: NotebookPen,
    toys: Gamepad2,
    sports: Dumbbell,
    tools: Wrench,
    automotive: Car,
    other: Package,
};

type OrderItem = Product & {
    quantity: number;
};

const CATEGORY_OPTIONS = [
    { value: "all", label: "All categories" },
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "shoes", label: "Shoes" },
    { value: "food", label: "Food" },
    { value: "beverages", label: "Beverages" },
    { value: "snacks", label: "Snacks" },
    { value: "household", label: "Household" },
    { value: "personal_care", label: "Personal Care" },
    { value: "beauty", label: "Beauty" },
    { value: "health", label: "Health" },
    { value: "baby", label: "Baby" },
    { value: "stationery", label: "Stationery" },
    { value: "toys", label: "Toys" },
    { value: "sports", label: "Sports" },
    { value: "tools", label: "Tools" },
    { value: "automotive", label: "Automotive" },
    { value: "other", label: "Other" },
];

export default function Orders() {
    const { products, setProducts } = useProducts();

    const [currentSale, setCurrentSale] = useState<OrderItem[]>([]);
    const [searchItem, setSearchItem] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const { transactions, addTransaction } = useTransactions();

    const deliveryFee = 5;

    const currencyFormatter = new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
    });

    const subTotal = currentSale.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const fullTotal = subTotal + deliveryFee;

    const filteredProducts = useMemo(() => {
        const search = searchItem.trim().toLowerCase();

        return products.filter((product) => {
            const matchesSearch =
                search === "" ||
                product.productName.toLowerCase().includes(search) ||
                product.sku?.toLowerCase().includes(search);

            const matchesCategory =
                selectedCategory === "all" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [products, searchItem, selectedCategory]);

    function addToSale(product: Product) {
        if (product.stock <= 0) return;

        setCurrentSale((prev) => {
            const existingProduct = prev.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                if (existingProduct.quantity >= product.stock) {
                    return prev;
                }

                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prev, { ...product, quantity: 1 }];
        });
    }

    function increaseQuantity(productId: number) {
        setCurrentSale((prev) =>
            prev.map((item) =>
                item.id === productId && item.quantity < item.stock
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    }

    function decreaseQuantity(productId: number) {
        setCurrentSale((prev) =>
            prev
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    function removeFromSale(productId: number) {
        setCurrentSale((prev) =>
            prev.filter((item) => item.id !== productId)
        );
    }

    function setQuantity(productId: number, quantity: number) {
        if (!Number.isFinite(quantity) || quantity < 1) return;

        setCurrentSale((prev) =>
            prev.map((item) =>
                item.id === productId
                    ? {
                        ...item,
                        quantity: Math.min(quantity, item.stock),
                    }
                    : item
            )
        );
    }

    function clearSearch() {
        setSearchItem("");
        setSelectedCategory("all");
    }
    function confirmPayment() {
        if (currentSale.length === 0) return;

        const transaction = {
            id: `TXN-${crypto.randomUUID().split("-")[0].toUpperCase()}`,
            items: currentSale,
            itemCount: currentSale.reduce(
                (total, item) => total + item.quantity,
                0
            ),
            subtotal: subTotal,
            deliveryFee,
            total: fullTotal,
            status: "completed" as const,
            time: new Date().toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "medium"
            })
        };

        addTransaction(transaction);

        setProducts((prevProducts) =>
            prevProducts.map((product) => {
                const saleItem = currentSale.find(
                    (item) => item.id === product.id
                );

                if (!saleItem) return product;

                return {
                    ...product,
                    stock: product.stock - saleItem.quantity,
                };
            })
        );

        setCurrentSale([]);
    }
    function declineSale() {
        if (currentSale.length === 0) return;

        const transaction = {
            id: `TXN-${crypto.randomUUID().split("-")[0].toUpperCase()}`,
            items: currentSale,
            itemCount: currentSale.reduce(
                (total, item) => total + item.quantity,
                0
            ),
            subtotal: subTotal,
            deliveryFee,
            total: fullTotal,
            status: "declined" as const,
            time: new Date().toISOString(),
        };

        addTransaction(transaction);

        setCurrentSale([]);
    }
    return (
        <div className="min-h-screen bg-gray-50/40">
            <div className="mx-auto w-full max-w-[1500px] p-4 sm:p-6 lg:p-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                            Orders
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Create and manage sales
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
                        <span className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-xs font-medium text-gray-600">
                            Register open
                        </span>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.55fr)_minmax(350px,0.9fr)]">
                    <div className="flex min-w-0 flex-col gap-5">
                        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="border-b border-gray-100 p-5 sm:p-6">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-lg font-bold text-gray-900">
                                            Product Selection
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Search and select a product to add
                                            it to the sale.
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                                        <Package size={15} className="text-gray-400" />
                                        <span className="text-xs font-medium text-gray-600">
                                            {filteredProducts.length}{" "}
                                            {filteredProducts.length === 1
                                                ? "product"
                                                : "products"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5 mb-2 flex gap-3 sm:flex-row">
                                    <div className="relative min-w-0 flex-1">
                                        <Search
                                            size={18}
                                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                                        />

                                        <input
                                            type="text"
                                            value={searchItem}
                                            onChange={(e) =>
                                                setSearchItem(e.target.value)
                                            }
                                            placeholder="Search products or SKU..."
                                            className="h-12.5 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-10 text-sm text-gray-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
                                        />

                                        {searchItem && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchItem("")}
                                                className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
                                            >
                                                <X size={15} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="relative sm:w-52">
                                        <Dropdown
                                            options={CATEGORY_OPTIONS}
                                            value={selectedCategory}
                                            onChange={setSelectedCategory}
                                            size="default"
                                            placement="bottom"
                                        />
                                    </div>
                                    {(searchItem || selectedCategory !== "all") && (
                                        <div className="mt-3 flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="cursor-pointer text-xs font-semibold text-blue-600 transition hover:text-blue-700"
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="dropdown-scroll">
                                    {filteredProducts.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {filteredProducts.map((product) => {
                                                const Icon =
                                                    CATEGORY_ICONS[
                                                    product.category ?? ""
                                                    ] || Package;

                                                const saleItem = currentSale.find(
                                                    (item) => item.id === product.id
                                                );

                                                const isOutOfStock =
                                                    product.stock <= 0;

                                                const reachedStockLimit =
                                                    saleItem &&
                                                    saleItem.quantity >=
                                                    product.stock;

                                                return (
                                                    <button
                                                        key={product.id}
                                                        type="button"
                                                        disabled={isOutOfStock}
                                                        onClick={() =>
                                                            addToSale(product)
                                                        }
                                                        className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition sm:px-6 ${isOutOfStock
                                                            ? "cursor-not-allowed opacity-50"
                                                            : "cursor-pointer hover:bg-blue-50/50"
                                                            }`}
                                                    >
                                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-50 transition group-hover:bg-blue-100">
                                                            <Icon
                                                                size={21}
                                                                className="text-blue-600"
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <p className="truncate text-sm font-semibold text-gray-800">
                                                                    {
                                                                        product.productName
                                                                    }
                                                                </p>

                                                                {saleItem && (
                                                                    <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                                                                        In cart
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="mt-1 flex items-center gap-2">
                                                                <span className="text-xs text-gray-400">
                                                                    {product.category ||
                                                                        "Other"}
                                                                </span>

                                                                {product.sku && (
                                                                    <>
                                                                        <span className="text-gray-300">
                                                                            <DotIcon />
                                                                        </span>
                                                                        <span className="text-xs text-gray-400">
                                                                            {
                                                                                product.sku
                                                                            }
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex shrink-0 items-center gap-4">
                                                            <div className="text-right">
                                                                <p className="text-sm font-bold text-gray-900">
                                                                    {currencyFormatter.format(
                                                                        product.price
                                                                    )}
                                                                </p>
                                                                <p
                                                                    className={`mt-0.5 text-xs ${isOutOfStock
                                                                        ? "font-medium text-red-500"
                                                                        : reachedStockLimit
                                                                            ? "font-medium text-orange-500"
                                                                            : "text-gray-400"
                                                                        }`}
                                                                >
                                                                    {isOutOfStock
                                                                        ? "Out of stock"
                                                                        : reachedStockLimit
                                                                            ? "Stock limit reached"
                                                                            : `${product.stock} in stock`}
                                                                </p>
                                                            </div>

                                                            <div
                                                                className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${isOutOfStock
                                                                    ? "border-gray-200 text-gray-300"
                                                                    : "border-blue-100 text-blue-600 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white"
                                                                    }`}
                                                            >
                                                                <Plus size={17} />
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50">
                                                <PackageOpen
                                                    size={25}
                                                    className="text-gray-300"
                                                />
                                            </div>

                                            <h3 className="mt-4 text-sm font-bold text-gray-800">
                                                No products found
                                            </h3>

                                            <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
                                                Try a different product name, SKU,
                                                or category.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={clearSearch}
                                                className="mt-4 cursor-pointer text-xs font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                Clear filters
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Recent Transactions
                                    </h2>
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        Latest activity at this register
                                    </p>
                                </div>

                                <Clock size={17} className="text-gray-400" />
                            </div>

                            <div className="divide-y divide-gray-100">
                                {transactions.length > 0 ? (
                                    transactions.slice(0, 5).map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-center gap-3 px-5 py-3.5 sm:px-6"
                                        >
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${transaction.status === "completed"
                                                    ? "bg-green-50"
                                                    : "bg-red-50"
                                                    }`}
                                            >
                                                {transaction.status === "completed" ? (
                                                    <CheckCircle2
                                                        size={17}
                                                        className="text-green-600"
                                                    />
                                                ) : (
                                                    <XCircle
                                                        size={17}
                                                        className="text-red-500"
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {transaction.id}
                                                    </p>

                                                    <span className="text-xs text-gray-400">
                                                        {transaction.itemCount}{" "}
                                                        {transaction.itemCount === 1
                                                            ? "item"
                                                            : "items"}
                                                    </span>
                                                </div>

                                                <p className="mt-0.5 text-xs text-gray-400">
                                                    {transaction.time}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-sm font-bold text-gray-800">
                                                    {currencyFormatter.format(transaction.total)}
                                                </p>

                                                <p
                                                    className={`mt-0.5 text-[10px] font-semibold ${transaction.status === "completed"
                                                        ? "text-green-600"
                                                        : "text-red-500"
                                                        }`}
                                                >
                                                    {transaction.status === "completed"
                                                        ? "Completed"
                                                        : "Declined"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-6 py-10 text-center">
                                        <p className="text-sm font-medium text-gray-500">
                                            No transactions yet
                                        </p>

                                        <p className="mt-1 text-xs text-gray-400">
                                            Completed sales will appear here.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                    <section className="flex min-h-[600px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm lg:sticky lg:top-6 lg:h-[calc(100vh-180px)]">
                        <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                                    <ShoppingCart
                                        size={19}
                                        className="text-blue-600"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-base font-bold text-gray-900">
                                        Current Sale
                                    </h2>
                                    <p className="mt-0.5 text-xs text-gray-400">
                                        {currentSale.length}{" "}
                                        {currentSale.length === 1
                                            ? "product"
                                            : "products"}
                                    </p>
                                </div>
                            </div>

                            {currentSale.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentSale([])}
                                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-400 hover:text-red-500"
                                    title="Clear sale"
                                >
                                    <Trash2 size={17} />
                                </button>
                            )}
                        </div>

                        {currentSale.length > 0 ? (
                            <>
                                <div className="min-h-0 flex-1 dropdown-scroll px-5 py-4 sm:px-6">
                                    <div className="space-y-3">
                                        {currentSale.map((product) => {
                                            const Icon =
                                                CATEGORY_ICONS[
                                                product.category ?? ""
                                                ] || Package;

                                            const reachedStockLimit =
                                                product.quantity >=
                                                product.stock;

                                            return (
                                                <div
                                                    key={product.id}
                                                    className="rounded-xl border border-gray-100 bg-gray-50/60 p-3.5"
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                                                            <Icon
                                                                size={19}
                                                                className="text-blue-600"
                                                            />
                                                        </div>

                                                        <div className="min-w-0 flex-1">
                                                            <div className="flex items-start gap-2">
                                                                <div className="min-w-0 flex-1">
                                                                    <p className="truncate text-sm font-semibold text-gray-800">
                                                                        {
                                                                            product.productName
                                                                        }
                                                                    </p>

                                                                    <p className="mt-0.5 truncate text-xs text-gray-400">
                                                                        {product.category ||
                                                                            "Other"}
                                                                    </p>
                                                                </div>

                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        removeFromSale(
                                                                            product.id
                                                                        )
                                                                    }
                                                                    className="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition hover:text-red-500"
                                                                >
                                                                    <X
                                                                        size={
                                                                            14
                                                                        }
                                                                    />
                                                                </button>
                                                            </div>

                                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                                <span className="text-sm font-bold text-gray-900">
                                                                    {currencyFormatter.format(
                                                                        product.price *
                                                                        product.quantity
                                                                    )}
                                                                </span>

                                                                <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white p-1">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            decreaseQuantity(
                                                                                product.id
                                                                            )
                                                                        }
                                                                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md bg-gray-50 text-gray-600 transition hover:bg-gray-100"
                                                                    >
                                                                        <Minus
                                                                            size={
                                                                                11
                                                                            }
                                                                        />
                                                                    </button>

                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        max={
                                                                            product.stock
                                                                        }
                                                                        value={
                                                                            product.quantity
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setQuantity(
                                                                                product.id,
                                                                                Number(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            )
                                                                        }
                                                                        className="w-8 text-center text-xs font-bold text-gray-800 outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                                    />

                                                                    <button
                                                                        type="button"
                                                                        disabled={
                                                                            reachedStockLimit
                                                                        }
                                                                        onClick={() =>
                                                                            increaseQuantity(
                                                                                product.id
                                                                            )
                                                                        }
                                                                        className={`flex h-6 w-6 items-center justify-center rounded-md transition ${reachedStockLimit
                                                                            ? "cursor-not-allowed bg-gray-50 text-gray-300"
                                                                            : "cursor-pointer bg-gray-50 text-gray-600 hover:bg-gray-100"
                                                                            }`}
                                                                    >
                                                                        <Plus
                                                                            size={
                                                                                11
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </div>

                                                            {reachedStockLimit && (
                                                                <p className="mt-2 text-[10px] font-medium text-orange-500">
                                                                    Maximum
                                                                    available
                                                                    stock
                                                                    reached
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="shrink-0 border-t border-gray-100 bg-white px-5 py-5 sm:px-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Subtotal
                                            </span>
                                            <span className="text-sm font-semibold text-gray-800">
                                                {currencyFormatter.format(
                                                    subTotal
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Delivery Fee
                                            </span>
                                            <span className="text-sm font-semibold text-gray-800">
                                                {currencyFormatter.format(
                                                    deliveryFee
                                                )}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                            <span className="font-bold text-gray-900">
                                                Total
                                            </span>

                                            <span className="text-xl font-bold text-blue-600">
                                                {currencyFormatter.format(
                                                    fullTotal
                                                )}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-5 grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={confirmPayment}
                                            className="cursor-pointer rounded-xl bg-blue-600 px-1 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 active:scale-[0.98]"
                                        >
                                            Confirm Payment
                                        </button>

                                        <button
                                            type="button"
                                            onClick={declineSale}
                                            className="cursor-pointer rounded-xl border border-gray-200 bg-white px-1 py-3 text-sm font-semibold text-gray-600 transition hover:text-white hover:bg-red-500 active:scale-[0.98]"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
                                    <ShoppingCart
                                        size={28}
                                        className="text-gray-300"
                                    />
                                </div>

                                <h3 className="mt-5 text-sm font-bold text-gray-800">
                                    Your sale is empty
                                </h3>

                                <p className="mt-1 max-w-xs text-xs leading-5 text-gray-400">
                                    Select a product to start
                                    building the sale.
                                </p>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
}