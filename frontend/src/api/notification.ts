export interface NotificationDto {
    type: 'ADD' | 'UPDATE' | 'DELETE' | 'ERROR';
    entityType: string;
    allIds: boolean;
    entityId: string | null;
}

type Listener = (n: NotificationDto) => void;

class NotificationSocket {
    private ws?: WebSocket;
    private listeners: Set<Listener> = new Set();

    connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
        this.ws = new WebSocket(`ws://localhost:8080/ws/notifications`);
        this.ws.onmessage = (e) => {
            try {
                const data: NotificationDto = JSON.parse(e.data);
                this.listeners.forEach(l => l(data));
            } catch {}
        };
        this.ws.onclose = () => {
            setTimeout(() => this.connect(), 3000);
        };
    }

    subscribe(listener: Listener): () => void {
        this.listeners.add(listener);
        this.connect();
        return () => {
            // гарантируем что cleanup возвращает void
            this.listeners.delete(listener);
        };
    }
}

export const notificationSocket = new NotificationSocket();
