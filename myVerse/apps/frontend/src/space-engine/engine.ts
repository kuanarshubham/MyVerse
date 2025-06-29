import { useCallback, useEffect, useState } from "react"
import { DIRECTION_KEYS } from "./utils/constants"
import type {Direction} from "./utils/constants"

const useEngine = () => {
    const [heldDirection, setHeldDirection] = useState<Direction[]>([]);

    const handleKey = useCallback((e: KeyboardEvent, isKeyDown: boolean) => {
        const direction = DIRECTION_KEYS[e.code];

        if(!direction) return;

        setHeldDirection(prev => {
            if(isKeyDown){
                return prev?.includes(direction) ? prev : [direction, ...prev!]
            }

            return prev?.filter(d => d !== direction);
        });
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => handleKey(e, true);
        const handleKeyUp = (e: KeyboardEvent) => handleKey(e, false);

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, [handleKey]);

    const getControllerDirection = useCallback(() => {
        return heldDirection[0] || null
    }, [heldDirection]);

    return {getControllerDirection};
}

export default useEngine;