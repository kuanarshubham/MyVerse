import { OutgoingMessage } from "../types.js";
import { User } from "./User.js";

export class RoomManager{
    rooms: Map<string, User[]> = new Map();
    static instance: RoomManager;
    
    private constructor(){
        console.log("Room Manager: ", this.rooms);
        this.rooms = new Map();
    }

    static getInstance(){
        if(!this.instance){
            this.instance = new RoomManager()
        }

        return this.instance;
    }

    public addUser(spaceId: string, user: User){
        console.log("Add user");
        if(!this.rooms.get(spaceId)){
            this.rooms.set(spaceId, [user]);
            return;
        }
        this.rooms.set(spaceId, [...(this.rooms.get(spaceId) ?? []), user]);
    }

    public broadcast(message: OutgoingMessage, user: User, spaceId: string){
        if(!this.rooms.has(spaceId)) return;

        const newArray = this.rooms
        .get(spaceId)?.filter(u => u.userId !== user.userId);

        console.log("Broadcast");

        newArray?.forEach(u => {
            if(u.userId !== user.userId){
                u.send(message);
            }
        });
        
    }

    public removeUser(user: User, spaceId: string){
        console.log("Remove User");
        if(!this.rooms.has(spaceId)) return;

        this.rooms.set(spaceId, (this.rooms.get(spaceId)?.filter(u => u.id === user.id)) ?? []);
    }
}