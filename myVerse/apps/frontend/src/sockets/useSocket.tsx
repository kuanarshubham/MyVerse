import { useRef } from "react";

const useSocket = ({socketURL}) => {

    const wsRef = useRef<WebSocket | null>(null);
    const [users, setUsers] = useState<Map>(new Map());
    
    wsRef.current = new WebSocket(socketURL);


}