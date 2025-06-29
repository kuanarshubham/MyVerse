import { extend, useTick } from "@pixi/react"
import { Container, Sprite } from "pixi.js"
import type { Texture } from "pixi.js";
extend({
    Container, Sprite
});
import { useCallback, useEffect, useRef } from "react";

// lovcal
import { DEFAULT_X, DEFAULT_Y } from "@/utils/constants.utils";
import type { TPeople } from "@/space-engine/types/people";


// redux
import useEngine from "@/space-engine/engine";
import type { TPosition } from "@/space-engine/types/engineType";
import { ANIMATION_SPEED, MOVESPEED, type Direction } from "@/space-engine/utils/constants";
import { calculateNewTarget, checkCanMove, handleMovemnt } from "@/space-engine/motion";
import usePeopleAnimation from "./usePeopleAnimation";




const People = ({ texture, onMove }: TPeople) => {
    const position = useRef({ x: DEFAULT_X, y: DEFAULT_Y });
    console.log(position.current.x, position.current.y)

    useEffect(() => {
        onMove(position.current.x, position.current.y)
    }, [onMove]);

    const { getControllerDirection } = useEngine();

    const targetPosition = useRef<TPosition>(null)
    const currentDirection = useRef<Direction | null>(null);

    const setNextTarget = useCallback((dir: Direction) => {
        if (targetPosition.current) return;

        const { x, y } = position.current;
        currentDirection.current = dir;
        console.log(x, y);

        const newTarget = calculateNewTarget(x, y, dir);
        console.log(checkCanMove(newTarget));

        if (checkCanMove(newTarget)) {
            targetPosition.current = newTarget
        }
    }, []);

    const animation = usePeopleAnimation({
        texture,
        frameWidth: 64,
        frameHeight: 64,
        totalFrame: 9,
        animationSpeed: ANIMATION_SPEED
    });

    const isMoving = useRef(false);

    const { sprite, updateSprite } = animation;

    useTick((delta) => {
        const direction = getControllerDirection();

        if (direction) {
            setNextTarget(direction)
            console.log("changing direction");
        }

        // handle movement

        if (targetPosition.current) {
            console.log("TargetPosition.currecnt");
            const { completed, position: newPosition } = handleMovemnt(position.current, targetPosition.current, MOVESPEED, delta.deltaTime);

            isMoving.current = true;

            position.current = newPosition;

            if (completed) {
                const { x, y } = position.current;
                onMove(x, y);

                targetPosition.current = null;
                isMoving.current = false;
            }
        }

        // handle completion of movement


        updateSprite(currentDirection.current!, isMoving.current!)
    });



    return (
        <pixiContainer>
            {
                sprite &&
                <pixiSprite
                    texture={sprite.texture}
                    x={position.current.x}
                    y={position.current.y}
                    scale={1}
                />
            }
        </pixiContainer>
    )
}

export default People