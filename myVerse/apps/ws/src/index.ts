import { WebSocketServer } from 'ws';
import { User } from './class/User.js';

const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', function connection(ws) {
  console.log("New Connection");

  let user: User | undefined = new User(ws);
  
  ws.on('error', console.error);

  ws.on("close", () => {
    user?.destroy();
  })
});