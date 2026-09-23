import { useEffect, useRef, useState } from "react";
import {
    Plus,
    X,
    Search,
    Filter,
    Trash2,
    Package,
    Boxes,
    ArrowUp,
    Banknote,
} from "lucide-react";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import type { Product, ProductFormData } from "../types/Product";
import Dropdown from "../components/DropDown";
import DeleteProductModal from "../components/DeleteProductModal";
import SummaryCard from "../components/SummaryCard";
import StockAdjustmentModal from "../components/StockAdjustmentModal";
import type { StockMovement } from "../types/StockMovements";
import ExportExcel from "../components/ExportExcel";
import { useProducts } from "../context/ProductContext";

export default function Inventory() {
    const { products, setProducts } = useProducts();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [searchItem, setSearchItem] = useState("");
    const [filterOpen, setFilterOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedStock, setSelectedStock] = useState("");
    const [sortBy, setSortBy] = useState("name-asc");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const selectAllRef = useRef<HTMLInputElement>(null);
    const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
    const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);

    const [stockMovements, setStockMovements] = useState<StockMovement[]>(() => {
        const saved = localStorage.getItem("stockMovements");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(
            "stockMovements",
            JSON.stringify(stockMovements)
        );
    }, [stockMovements]);

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


    const STOCK = [
        { value: "", label: "All stock" },
        { value: "in-stock", label: "In stock" },
        { value: "low-stock", label: "Low stock" },
        { value: "out-of-stock", label: "Out of stock" },
    ];

    const SORT_OPTIONS = [
        { value: "name-asc", label: "Name: A - Z" },
        { value: "name-desc", label: "Name: Z - A" },
        { value: "price-asc", label: "Price: Low - High" },
        { value: "price-desc", label: "Price: High - Low" },
        { value: "stock-asc", label: "Stock: Low - High" },
        { value: "stock-desc", label: "Stock: High - Low" },
        { value: "date-desc", label: "Recently Added" },
    ];

    const LOW_STOCK_THRESHOLD = 10;

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.productName
            .toLowerCase()
            .includes(searchItem.toLowerCase());

        const matchesCategory =
            selectedCategory === "" ||
            product.category === selectedCategory;

        const matchesStock =
            selectedStock === "" ||
            (selectedStock === "in-stock" &&
                product.stock > LOW_STOCK_THRESHOLD) ||
            (selectedStock === "low-stock" &&
                product.stock >= 1 &&
                product.stock <= LOW_STOCK_THRESHOLD) ||
            (selectedStock === "out-of-stock" && product.stock === 0);

        return matchesSearch && matchesCategory && matchesStock;
    });

    const sortedProducts = [...filteredProducts];

    sortedProducts.sort((a, b) => {
        switch (sortBy) {
            case "name-asc":
                return a.productName.localeCompare(b.productName);
            case "name-desc":
                return b.productName.localeCompare(a.productName);
            case "price-asc":
                return Number(a.price) - Number(b.price);
            case "price-desc":
                return Number(b.price) - Number(a.price);
            case "stock-asc":
                return a.stock - b.stock;
            case "stock-desc":
                return b.stock - a.stock;
            case "date-desc":
                return (
                    new Date(b.addedAt).getTime() -
                    new Date(a.addedAt).getTime()
                );
            default:
                return 0;
        }
    });

    const currentDate = new Date();

    const productsAddedThisMonth = products.filter((product) => {
        const addedDate = new Date(product.addedAt);

        return (
            addedDate.getMonth() === currentDate.getMonth() &&
            addedDate.getFullYear() === currentDate.getFullYear()
        );
    }).length;

    const stockAddedThisMonth = products
        .filter((product) => {
            const addedDate = new Date(product.addedAt);

            return (
                addedDate.getMonth() === currentDate.getMonth() &&
                addedDate.getFullYear() === currentDate.getFullYear()
            );
        })
        .reduce((total, product) => total + product.stock, 0);

    const totalPrice = products.reduce(
        (total, product) => total + Number(product.price),
        0
    );

    const allSelected =
        filteredProducts.length > 0 &&
        filteredProducts.every((product) => selectedIds.includes(product.id));

    const someSelected = selectedIds.length > 0 && !allSelected;

    useEffect(() => {
        if (selectAllRef.current) {
            selectAllRef.current.indeterminate = someSelected;
        }
    }, [someSelected]);

    function addProduct(data: ProductFormData) {
        const newProduct: Product = {
            id: Date.now(),
            ...data,
            addedAt: new Date().toISOString(),
        };

        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setIsFormOpen(false);
    }

    function editProduct(id: number, data: ProductFormData) {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id ? { ...product, ...data } : product
            )
        );

        setIsFormOpen(false);
        setEditingProduct(null);
    }

    function selectProduct(id: number) {
        setSelectedIds((prevIds) =>
            prevIds.includes(id)
                ? prevIds.filter((item) => item !== id)
                : [...prevIds, id]
        );
    }

    function deleteSelectedProducts() {
        setProducts((prevProducts) =>
            prevProducts.filter((product) => !selectedIds.includes(product.id))
        );
        setSelectedIds([]);
        setIsBulkDeleteOpen(false);
    }

    function selectAllProducts() {
        if (allSelected) {
            setSelectedIds(
                selectedIds.filter(
                    (id) =>
                        !filteredProducts.some(
                            (product) => product.id === id
                        )
                )
            );
        } else {
            const filteredIds = filteredProducts.map((product) => product.id);
            setSelectedIds([...new Set([...selectedIds, ...filteredIds])]);
        }
    }

    function deleteProduct(id: number) {
        setProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== id)
        );
    }

    function handleEditProduct(id: number) {
        const product = products.find((product) => product.id === id);
        if (!product) return;
        setEditingProduct(product);
        setIsFormOpen(true);
    }

    function handleAddProduct() {
        setEditingProduct(null);
        setIsFormOpen(true);
    }

    function handleCloseForm() {
        setIsFormOpen(false);
        setEditingProduct(null);
    }

    const exportData = products.map((product) => {
        return {
            "Product Name": product.productName,
            "SKU": product.sku,
            "Category": product.category,
            "Price": product.price,
            "Stock": product.stock,
        };
    });

    function handleAdjustStock(id: number) {
        const product = products.find((product) => product.id === id);
        if (!product) return;
        setAdjustingProduct(product);
    }

    function adjustStock(
        quantity: number,
        type: "increase" | "decrease",
        reason: string
    ) {
        if (!adjustingProduct) return;

        const newStock =
            type === "increase"
                ? adjustingProduct.stock + quantity
                : adjustingProduct.stock - quantity;

        if (newStock < 0) {
            alert("Stock cannot go below zero.");
            return;
        }

        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === adjustingProduct.id
                    ? { ...product, stock: newStock }
                    : product
            )
        );

        const movement: StockMovement = {
            id: Date.now(),
            product: adjustingProduct.productName,
            quantity,
            type,
            reason,
            date: new Date().toISOString(),
        };

        setStockMovements((prevMovements) => [
            ...prevMovements,
            movement,
        ]);

        setAdjustingProduct(null);
    }

    return (
        <div className="min-w-0 w-full p-5">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Hello, Charles!
                    </h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage your inventory
                    </p>
                </div>

                <div className="flex gap-2">
                    <ExportExcel
                        data={exportData}
                        fileName="product-inventory"
                        sheetName="Product Inventory"
                    />
                    <button
                        type="button"
                        onClick={handleAddProduct}
                        className="flex cursor-pointer items-center gap-2 rounded-xl bg-blue-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <SummaryCard
                    title="Total Products"
                    value={products.length}
                    description={`${productsAddedThisMonth} products added`}
                    icon={Package}
                    descriptionIcon={ArrowUp}
                />

                <SummaryCard
                    title="Total Stock"
                    value={products.reduce(
                        (total, product) => total + product.stock,
                        0
                    )}
                    description={`${stockAddedThisMonth} units added`}
                    icon={Boxes}
                    descriptionIcon={ArrowUp}
                />

                <SummaryCard
                    title="Total Product Value"
                    value={`₵${totalPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}`}
                    description="Total inventory value"
                    icon={Banknote}
                    descriptionIcon="₵"
                />
            </div>
            <div className="mb-4 flex items-center gap-2 mt-6">
                <div className="relative">
                    <button
                        type="button"
                        onClick={() => setFilterOpen((prev) => !prev)}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-sm font-medium text-white hover:bg-blue-600"
                    >
                        Filter
                        <Filter className="h-4 w-4" />
                    </button>

                    {filterOpen && (
                        <div className="absolute left-0 top-full z-50 mt-2 w-68 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                            <h3 className="mb-2 text-[15px] font-semibold text-gray-900">
                                Filter by...
                            </h3>

                            <div className="mb-1">
                                <Dropdown
                                    options={STOCK}
                                    value={selectedStock}
                                    onChange={setSelectedStock}
                                    placeholder="All stock"
                                    placement="right"
                                    size="compact"
                                />
                            </div>
                            <Dropdown
                                options={CATEGORIES}
                                value={selectedCategory}
                                onChange={setSelectedCategory}
                                placeholder="All categories"
                                placement="right"
                                size="compact"
                            />
                        </div>
                    )}
                </div>
                <div className="w-44">
                    <Dropdown
                        options={SORT_OPTIONS}
                        value={sortBy}
                        onChange={setSortBy}
                        placeholder="Sort"
                        size="compact"
                        className="bg-gray-500 font-medium text-white hover:bg-gray-600"
                    />
                </div>
                <div className="relative">
                    <Search
                        size={20}
                        className="absolute left-2 top-1/4 pl-1 text-gray-500"
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-100 rounded-full bg-gray-100 py-2 pl-10 pr-4 text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500"
                        value={searchItem}
                        onChange={(e) => setSearchItem(e.target.value)}
                    />
                </div>

                <div className="ml-auto">
                    <button
                        type="button"
                        onClick={() => setIsBulkDeleteOpen(true)}
                        className={
                            selectedIds.length === 0
                                ? "invisible"
                                : "shadow-lg shadow-red-500/60 flex cursor-pointer items-center justify-center gap-3 rounded-lg bg-red-500 px-3 py-2 text-sm text-white"
                        }
                    >
                        Delete Selected
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-gray-200 bg-gray-50">
                            <tr>
                                <th className="py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    <div className="ml-4 flex items-center gap-3">
                                        <input
                                            ref={selectAllRef}
                                            type="checkbox"
                                            className={
                                                filteredProducts.length === 0
                                                    ? "hidden"
                                                    : "h-3.5 w-3.5 cursor-pointer"
                                            }
                                            checked={allSelected}
                                            onChange={selectAllProducts}
                                        />
                                        <span>Product</span>
                                    </div>
                                </th>

                                <th className="px-10 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Category
                                </th>

                                <th className="px-12 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Price
                                </th>

                                <th className="px-12 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Stock
                                </th>

                                <th className="px-10 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="flex min-h-32 items-center justify-center p-6">
                                            <div className="text-center">
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    No products yet
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Add your first product to get started.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5}>
                                        <div className="flex min-h-32 items-center justify-center p-6">
                                            <div className="text-center">
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    No products found
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Try changing your search or filter.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                sortedProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onEdit={handleEditProduct}
                                        onDelete={deleteProduct}
                                        onSelect={selectProduct}
                                        onAdjustStock={handleAdjustStock}
                                        checked={selectedIds.includes(product.id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isFormOpen && (
                <div
                    className="fixed inset-0 z-50 flex animate-[fadeIn_0.2s_ease-out] items-center justify-center bg-black/50 p-4"
                    onClick={handleCloseForm}
                >
                    <div
                        className="relative w-full max-w-md animate-[scaleIn_0.2s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={handleCloseForm}
                            aria-label="Close product form"
                            className="absolute right-4 top-4 z-10 cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <ProductForm
                            onAddProduct={addProduct}
                            onEditProduct={editProduct}
                            product={editingProduct}
                        />
                    </div>
                </div>
            )}

            {isBulkDeleteOpen && (
                <DeleteProductModal
                    message={`${selectedIds.length} products`}
                    onClose={() => setIsBulkDeleteOpen(false)}
                    onConfirm={deleteSelectedProducts}
                />
            )}
            {adjustingProduct && (
                <StockAdjustmentModal
                    product={adjustingProduct}
                    onClose={() => setAdjustingProduct(null)}
                    onAdjust={adjustStock}
                />
            )}
        </div>
    );
}
