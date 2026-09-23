import { createContext } from "react";
import type { Transaction } from "../types/Transaction";

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Transaction) => void;
}

export const TransactionContext =
    createContext<TransactionContextType | null>(null);