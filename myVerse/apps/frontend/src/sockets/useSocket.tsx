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

// // Represents a user in the game space
// interface UserData {
//   userId: string;
//   x: number;
//   y: number;
// }

// export const useSocket = ({ socketURL, token, spaceId }: UseSocketProps) => {
//   const wsRef = useRef<WebSocket | null>(null);
//   const [users, setUsers] = useState<Map<string, UserData>>(new Map());
//   const [myPosition, setMyPosition] = useState<{ x: number; y: number } | null>(null);
//   const [isConnected, setIsConnected] = useState(false);

//   // Helper to send messages
//   const sendMessage = (msg: WSMessage) => {
//     if (wsRef.current?.readyState === WebSocket.OPEN) {
//       wsRef.current.send(JSON.stringify(msg));
//     } else {
//       console.warn("WebSocket is not open");
//     }
//   };

//   // Joins the space
//   const joinSpace = () => {
//     sendMessage({
//       type: "join",
//       payload: {
//         spaceId,
//         token,
//       },
//     });
//   };

//   // Sends a movement command
//   const sendMovement = (x: number, y: number) => {
//     sendMessage({
//       type: "move",
//       payload: { x, y },
//     });
//   };

//   useEffect(() => {
//     if (!token) {
//       return;
//     }

//     // This connection logic is correct for your backend, which expects
//     // the token in a 'join' message, not the URL.
//     const ws = new WebSocket(socketURL);
//     wsRef.current = ws;

//     ws.onopen = () => {
//       console.log("✅ WebSocket connected");
//       setIsConnected(true);
//       joinSpace();
//     };

//     ws.onmessage = (event) => {
//       try {
//         const data = JSON.parse(event.data);

//         switch (data.type) {
//           // --- THIS IS THE CORRECTED PART ---
//           case "space-joined":
//             console.log("Received space-joined with payload:", data.payload);
//             const initialUsers = new Map<string, UserData>();

//             // Your backend sends an array of user ID strings. This code now handles that correctly.
//             const otherUserIds: string[] = data.payload.users;

//             otherUserIds.forEach((userId: string) => {
//               // We create a placeholder user. Their real position will appear
//               // when they move and the client receives a "movement" message.
//               initialUsers.set(userId, {
//                 userId: userId,
//                 x: 0, // Default position
//                 y: 0, // Default position
//               });
//             });

//             setUsers(initialUsers);
//             setMyPosition(data.payload.spawn);
//             break;
//           // ------------------------------------

//           case "user-join":
//             // Add a new user to the map
//             setUsers((prevUsers) => {
//               const newUsers = new Map(prevUsers);
//               newUsers.set(data.payload.userId, {
//                 userId: data.payload.userId,
//                 x: data.payload.x,
//                 y: data.payload.y,
//               });
//               return newUsers;
//             });
//             break;

//           case "movement":
//             // Update the position of a moving user
//             setUsers((prevUsers) => {
//               const newUsers = new Map(prevUsers);
//               const movingUser = newUsers.get(data.payload.userId);
//               if (movingUser) {
//                 movingUser.x = data.payload.x;
//                 movingUser.y = data.payload.y;
//               }
//               return newUsers;
//             });
//             break;
            
//           case "movement-rejected":
//             // Revert my position if the move was invalid
//             console.log("❌ Movement rejected by server");
//             setMyPosition(data.payload);
//             break;

//           case "user-left":
//             // Remove a user from the map
//             setUsers((prevUsers) => {
//               const newUsers = new Map(prevUsers);
//               newUsers.delete(data.payload.userId);
//               return newUsers;
//             });
//             break;

//           default:
//             console.warn("Unhandled message type:", data.type);
//             break;
//         }
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
//     myPosition,
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
  
  // Add a ref to hold the heartbeat timer ID
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

      // Start the heartbeat on connection
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      heartbeatIntervalRef.current = setInterval(() => {
        sendMessage({ type: 'ping', payload: 'heartbeat' });
      }, 3000); // Send a ping every 3 seconds
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Optional: Handle a 'pong' from the server to confirm heartbeat
        if (data.type === 'pong') {
          console.log("Pong received from server");
          return;
        }

        switch (data.type) {
          case "space-joined":
            console.log("Received space-joined with payload:", data.payload);
            const initialUsers = new Map<string, UserData>();
            const otherUserIds: string[] = data.payload.users;
            otherUserIds.forEach((userId: string) => {
              initialUsers.set(userId, {
                userId: userId,
                x: 0, 
                y: 0, 
              });
            });
            setUsers(initialUsers);
            setMyPosition(data.payload.spawn);
            break;

          case "user-join":
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
            console.log("❌ Movement rejected by server");
            setMyPosition(data.payload);
            break;

          case "user-left":
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
      // Stop the heartbeat when the connection closes
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error", err);
    };

    // Cleanup function runs when the component unmounts
    return () => {
      // Stop the heartbeat and close the connection
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
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