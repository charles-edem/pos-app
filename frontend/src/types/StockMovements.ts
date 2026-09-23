export interface StockMovement {
    id: number;
    product: string;
    quantity: number;
    type: "increase" | "decrease";
    reason: string;
    date: string;
}