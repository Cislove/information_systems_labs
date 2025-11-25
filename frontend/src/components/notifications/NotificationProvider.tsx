import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import { notificationSocket, NotificationDto } from '../../api/notification';

interface Toast {
    id: string;
    dto: NotificationDto;
    ts: number;
}

interface NotificationsCtx {
    toasts: Toast[];
    push: (dto: NotificationDto) => void;
    remove: (id: string) => void;
}

const Ctx = createContext<NotificationsCtx | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const push = useCallback((dto: NotificationDto) => {
        setToasts(t => [...t, { id: crypto.randomUUID(), dto, ts: Date.now() }]);
    }, []);

    const remove = useCallback((id: string) => {
        setToasts(t => t.filter(x => x.id !== id));
    }, []);

    useEffect(() => {
        const unsub = notificationSocket.subscribe(dto => {
            push(dto);
        });
        return () => {
            unsub(); // cleanup возвращает void
        };
    }, [push]);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            setToasts(t => t.filter(x => now - x.ts < 6000));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Ctx.Provider value={{ toasts, push, remove }}>
            {children}
        </Ctx.Provider>
    );
};

export function useNotifications() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
    return ctx;
}
