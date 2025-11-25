import { useEffect, useRef } from "react";

interface WebSocketMessage {
  entity?: string;
  action?: string;
  id?: number;
  [key: string]: any;
}

interface UseWebSocketOptions {
  url: string;
  onMessage?: (message: WebSocketMessage) => void;
  reconnectInterval?: number;
}


export function useWebSocket({ url, onMessage, reconnectInterval = 5000 }: UseWebSocketOptions) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    let reconnectTimer: NodeJS.Timeout;

    const connect = () => {
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("✅ WebSocket connected:", url);
      };

      socket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          onMessage?.(message);
        } catch (err) {
          console.warn("⚠️ Invalid message format:", event.data);
        }
      };

      socket.onclose = () => {
        console.warn("⚠️ WebSocket disconnected, retrying...");
        reconnectTimer = setTimeout(connect, reconnectInterval);
      };

      socket.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        socket.close();
      };
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      socketRef.current?.close();
    };
  }, [url, onMessage, reconnectInterval]);
}
