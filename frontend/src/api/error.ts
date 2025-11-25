import axios from "axios";

export function errorText(e: unknown): string {
    if (axios.isAxiosError(e)) {
        const status = e.response?.status;
        const data = e.response?.data as any;
        const msg =
            (data && (data.errorMessage)) ||
            "Неправильные данные";
        if (status) return `Ошибка ${status}: ${msg}`;
        return `Ошибка сети: ${msg}`;
    }
    if (e instanceof Error) return e.message;
    try {
        return JSON.stringify(e);
    } catch {
        return "Неизвестная ошибка";
    }
}