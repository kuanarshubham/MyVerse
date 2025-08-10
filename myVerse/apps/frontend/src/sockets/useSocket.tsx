import { useEffect, useRef, useState } from "react";

interface UseSocketProps {
  socketURL: string;
  token: string;
  spaceId: string;
}

type WSMessage = {
  type: string;
  payload: any;
};

export const useSocket = ({ socketURL, token, spaceId }: UseSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [users, setUsers] = useState<Map<string, any>>(new Map());
  const [isConnected, setIsConnected] = useState(false);

  // Send message helper
  const sendMessage = (msg: WSMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket is not open");
    }
  };

  // Join message
  const joinSpace = () => {
    sendMessage({
      type: "join",
      payload: {
        spaceId,
        token,
      },
    });
  };

  // Move message
  const sendMovement = (x: number, y: number) => {
    sendMessage({
      type: "move",
      payload: { x, y },
    });
  };

  useEffect(() => {
    const ws = new WebSocket(socketURL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
      joinSpace(); // Auto-join on connection
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === "user-list") {
          const userMap = new Map<string, any>();
          data.payload.forEach((user: any) => {
            userMap.set(user.id, user);
          });
          setUsers(userMap);
        }

        // Extend this for other server-sent events
      } catch (err) {
        console.error("Invalid WebSocket message", err);
      }
    };

    ws.onclose = () => {
      console.warn("⚠️ WebSocket closed");
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    return () => {
      ws.close();
    };
  }, [socketURL, spaceId, token]);

  return {
    users,
    isConnected,
    sendMovement,
    reconnect: joinSpace,
  };
};
