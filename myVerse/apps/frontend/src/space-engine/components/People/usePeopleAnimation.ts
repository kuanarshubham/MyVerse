import type { Direction } from "@/space-engine/utils/constants";
import { TILE_SIZE } from "@/utils/constants.utils";
import { Rectangle , Sprite, Texture } from "pixi.js"
import { useRef, useState } from "react"

interface TUsePeopleAnimation {
    texture: Texture,
    frameWidth: number,
    frameHeight: number,
    totalFrame: number,
    animationSpeed: number
}

const usePeopleAnimation = ({ texture, frameHeight, frameWidth, totalFrame, animationSpeed }: TUsePeopleAnimation) => {
    const [sprite, setSprite] = useState<Sprite | null>(null);
    const frameRef = useRef(0);
    const elapsedTimeRef = useRef(0);

    const getRowByDirection = (direction: Direction): number | undefined => {
        switch (direction) {
            case "UP":
                return 8;
            case "LEFT":
                return 9;
            case "DOWN":
                return 10;
            case "RIGHT":
                return 11;
        }
    }


    const createSprite = (row: number, col: number) => {
        const frame = new Texture({
            source: texture.source,
            frame: new Rectangle(col*frameWidth, row*frameHeight, frameWidth, frameHeight)
        });

        const newSprite = new Sprite(frame);
        newSprite.width = TILE_SIZE;
        newSprite.height = TILE_SIZE;

        return newSprite;
    }

    const updateSprite = (direction: Direction, isMoving: boolean) => {
        const row = getRowByDirection(direction);

        let col = 0;

        if (isMoving) {
            elapsedTimeRef.current += animationSpeed;

            if (elapsedTimeRef.current >= 1) {
                elapsedTimeRef.current = 0;
                frameRef.current = (frameRef.current + 1) % totalFrame;
            }

            col = frameRef.current
        }

        const newSprite = createSprite(row, col);
        setSprite(newSprite);
    }

    return { sprite, updateSprite };
}

export default usePeopleAnimation;