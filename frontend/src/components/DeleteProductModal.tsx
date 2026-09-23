import { Trash2, X } from "lucide-react";
import { createPortal } from "react-dom";

interface DeleteProductModalProps {
    message: string
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteProductModal({
    message,
    onClose,
    onConfirm,
}: DeleteProductModalProps) {
    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onClose}
        >
            <div
                className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
                        <Trash2 className="h-5 w-5 text-red-500" />
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close delete confirmation"
                        className="cursor-pointer text-gray-400 transition-colors hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <h2 className="text-lg font-semibold text-gray-900">
                    Delete product?
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-700">
                        {message}
                    </span>
                    ? This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        className="cursor-pointer rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-red-600 hover:shadow-sm active:scale-95"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}