// import { useEffect, useRef, useState } from "react";

// interface UseSocketProps {
//   socketURL: string;
//   token: string;
//   spaceId: string;
// }

// type WSMessage = {
//   type: string;
//   payload: any;
// };

// export const useSocket = ({ socketURL, token, spaceId }: UseSocketProps) => {
//   const wsRef = useRef<WebSocket | null>(null);
//   const [users, setUsers] = useState<Map<string, any>>(new Map());
//   const [isConnected, setIsConnected] = useState(false);

//   // Send message helper
//   const sendMessage = (msg: WSMessage) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify(msg));
//     } else {
//       console.warn("WebSocket is not open");
//     }
//   };

//   // Join message
//   const joinSpace = () => {
//     sendMessage({
//       type: "join",
//       payload: {
//         spaceId,
//         token,
//       },
//     });
//   };

//   // Move message
//   const sendMovement = (x: number, y: number) => {
//     sendMessage({
//       type: "move",
//       payload: { x, y },
//     });
//   };

//   useEffect(() => {
//     const ws = new WebSocket(socketURL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("✅ WebSocket connected");
//       setIsConnected(true);
//       joinSpace(); // Auto-join on connection
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         if (data.type === "user-list") {
//           const userMap = new Map<string, any>();
//           data.payload.forEach((user: any) => {
//             userMap.set(user.id, user);
//           });
//           setUsers(userMap);
//         }

//         // Extend this for other server-sent events
//       } catch (err) {
//         console.error("Invalid WebSocket message", err);
//       }
//     };

//     ws.onclose = () => {
//       console.warn("⚠️ WebSocket closed");
//       setIsConnected(false);
//     };

//     ws.onerror = (err) => {
//       console.error("❌ WebSocket error", err);
//     };

//     return () => {
//       ws.close();
//     };
//   }, [socketURL, spaceId, token]);

//   return {
//     users,
//     isConnected,
//     sendMovement,
//     reconnect: joinSpace,
//   };
// };


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

// Represents a user in the game space
interface UserData {
  userId: string;
  x: number;
  y: number;
}

export const useSocket = ({ socketURL, token, spaceId }: UseSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [users, setUsers] = useState<Map<string, UserData>>(new Map());
  const [myPosition, setMyPosition] = useState<{ x: number; y: number } | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Helper to send messages
  const sendMessage = (msg: WSMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("WebSocket is not open");
    }
  };

  // Joins the space
  const joinSpace = () => {
    sendMessage({
      type: "join",
      payload: {
        spaceId,
        token,
      },
    });
  };

  // Sends a movement command
  const sendMovement = (x: number, y: number) => {
    // You can add optimistic updates here before sending
    sendMessage({
      type: "move",
      payload: { x, y },
    });
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const ws = new WebSocket(socketURL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      setIsConnected(true);
      joinSpace();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "space-joined":
            // Handle initial join message
            const initialUsers = new Map<string, UserData>();
            data.payload.users.forEach((user: UserData) => {
              initialUsers.set(user.userId, user);
            });
            setUsers(initialUsers);
            setMyPosition(data.payload.spawn);
            break;

          case "user-join":
            // Add a new user to the map
            setUsers((prevUsers) => {
              const newUsers = new Map(prevUsers);
              newUsers.set(data.payload.userId, {
                userId: data.payload.userId,
                x: data.payload.x,
                y: data.payload.y,
              });
              return newUsers;
            });
            break;

          case "movement":
            // Update the position of a moving user
            setUsers((prevUsers) => {
              const newUsers = new Map(prevUsers);
              const movingUser = newUsers.get(data.payload.userId);
              if (movingUser) {
                movingUser.x = data.payload.x;
                movingUser.y = data.payload.y;
              }
              return newUsers;
            });
            break;
            
          case "movement-rejected":
            // Revert my position if the move was invalid
            console.log("❌ Movement rejected by server");
            setMyPosition(data.payload);
            break;

          case "user-left":
            // Remove a user from the map
            setUsers((prevUsers) => {
              const newUsers = new Map(prevUsers);
              newUsers.delete(data.payload.userId);
              return newUsers;
            });
            break;

          default:
            console.warn("Unhandled message type:", data.type);
            break;
        }
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
    myPosition,
    isConnected,
    sendMovement,
    reconnect: joinSpace,
  };
};