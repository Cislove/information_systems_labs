export interface DataField<T> {
    key: keyof T;
    label: string;
    type: "text" | "number" | "date";
    validate?: (value: any) => string | null;
}