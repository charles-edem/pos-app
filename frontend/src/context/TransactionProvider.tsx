import { useEffect, useState, type ReactNode } from "react";
import { TransactionContext } from "./TransactionContext";
import type { Transaction } from "../types/Transaction";

interface TransactionProviderProps {
    children: ReactNode;
}

export default function TransactionProvider({
    children,
}: TransactionProviderProps) {
    const [transactions, setTransactions] = useState<Transaction[]>(() => {
        const saved = localStorage.getItem("transactions");

        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem("transactions", JSON.stringify(transactions));
    }, [transactions]);

    function addTransaction(transaction: Transaction) {
        setTransactions((prev) => [transaction, ...prev]);
    }

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                addTransaction,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
}