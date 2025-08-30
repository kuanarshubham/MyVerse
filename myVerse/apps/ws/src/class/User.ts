import { WebSocket } from "ws";
import { RoomManager } from "./RoomManger.js";
import { OutgoingMessage } from "../types.js";
import client from "@repo/db/client";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config.js";

function getRandomString(length: number) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}


export class User {
    public id: string;
    public userId?: string
    private spaceId?: string;
    private x;
    private y;

    constructor(private ws: WebSocket) {
        this.id = getRandomString(10);
        this.x =  0;
        this.y = 0;
        console.log("User formed");
        this.initHandlers();
    }

    initHandlers() {
        console.log("Inithanlder");
        this.ws.on("message", async (data) => {
            const parseData = JSON.parse(data.toString());

            switch (parseData.type) {
                case "join": {
                    console.log("Join");
                    const spaceId = parseData.payload.spaceId;
                    const token = parseData.payload.token;

                    console.log("Received token:", token);

                    const userId = (jwt.verify(token, JWT_SECRET_KEY) as JwtPayload).userId;

                    console.log("This is userId: ", userId);

                    if (!userId) {
                        this.ws.close();
                        return;
                    }

                    this.userId = userId;
                    console.log("Join event: ", this.userId);

                    const space = await client.space.findFirst({
                        where: {
                            id: spaceId
                        }
                    });

                    if (!space) {
                        this.ws.close();
                        return;
                    }

                    this.spaceId = space.id;

                    RoomManager.getInstance().addUser(spaceId, this);
                    this.x = Math.floor(Math.random() * space.width);
                    this.y = Math.floor(Math.random() * space.width);

                    this.send({
                        type: "space-joined",
                        payload: {
                            // TODO - Spawn x, y => shouldn't collide with elemnets in Map
                            spawn: {
                                x: this.x,
                                y: this.y
                            },
                            users: RoomManager.getInstance().rooms.get(spaceId)?.filter(u => u.id !== this.id).map(u => u.userId) ?? []
                        }
                    });

                    RoomManager.getInstance().broadcast({
                        "type": "user-join",
                        "payload": {
                            "userId": this.userId,
                            "x": this.x,
                            "y": this.y
                        }
                    }, this, spaceId);
                }

                    break;

                case "move": {
                    console.log("Move:  ", this.userId);
                    const moveX = parseData.payload.x;
                    const moveY = parseData.payload.y;

                    const xDis = Math.abs(moveX - this.x);
                    console.log(xDis);
                    const yDis = Math.abs(moveY - this.y);

                    if (xDis <= 1 && yDis <= 1 && !(xDis === 1 && yDis === 1)) {
                        this.x = moveX;
                        this.y = moveY;

                        RoomManager.getInstance().broadcast({
                            type: "movement",
                            payload: {
                                x: this.x,
                                y: this.y,
                                userId: this.userId
                            }
                        }, this, this.spaceId!);

                        return;
                    }
                    else{
                        this.send({
                        type: "movement-rejected",
                        payload: {
                            x: this.x,
                            y: this.y
                        }
                        });
                    }

                }
            }


        });
    }

    send(payload: OutgoingMessage) {
        console.log("Send: ", this.userId);
        this.ws.send(JSON.stringify(payload));
    }

    destroy() {
        console.log("Destroy: ", this.userId);
        RoomManager.getInstance().broadcast({
            "type": "user-left",
            "payload": {
                "userId": this.userId
            }
        }, this, this.spaceId!);
        RoomManager.getInstance().removeUser(this, this.spaceId!);
    }
}