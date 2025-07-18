import { extend, useTick } from "@pixi/react"
import { Container, Sprite } from "pixi.js"
import type { Texture } from "pixi.js";
extend({
    Container, Sprite
});
import { useCallback, useEffect, useRef } from "react";


import type { PropsWithChildren } from 'react'
import {
  ANIMATION_SPEED,
  DEFAULT_X,
  DEFAULT_Y,
  MOVE_SPEED,
} from '../../utils/constants.utils'
import { usePeopleControl } from '../helpers/usePeopleControls'
import {
  calculateNewTarget,
  checkCanMove,
  handleMovement,
} from "../helpers/moving";
import { usePeopleAnimation,  } from './usePeopleAnimation'
import type { Direction } from "../types/common";

import { useAppDispatch } from '../../store/hooks';
import { setNewPosition } from "@/feature/people.Slice";

interface IHeroProps {
  texture: Texture
  onMove: (gridX: number, gridY: number) => void
}

const People = ({ texture, onMove }: PropsWithChildren<IHeroProps>) => {
  //redux
  const dispatch = useAppDispatch();

  //position moving in direction
  const position = useRef({ x: DEFAULT_X, y: DEFAULT_Y });

  useEffect(() => {
    onMove(position.current.x, position.current.y);
  }, [onMove]);


  // using the direction and keyborad hook
  const {getControlsDirection} = usePeopleControl();

  // setting up the target and position
  const targetPosition = useRef<{ x: number; y: number } | null>(null);
  const currentDirection = useRef<Direction | null>(null);
  const isMoving = useRef(false);

  const setNextTarget = useCallback((direction: Direction) => {
    if (targetPosition.current) return
    const { x, y } = position.current
    currentDirection.current = direction
    const newTarget = calculateNewTarget(x, y, direction)

    if (checkCanMove(newTarget)) {
      targetPosition.current = newTarget
    }
  }, []);

  const { sprite, updateSprite } = usePeopleAnimation({
        texture,
        frameWidth: 64,
        frameHeight: 64,
        totalFrames: 9,
        animationSpeed: ANIMATION_SPEED
    });

  useTick((delta) => {
    const direction = getControlsDirection()
    if (direction) {
      setNextTarget(direction)
    }
    if (targetPosition.current) {
      const { position: newPosition, completed } = handleMovement(
        position.current,
        targetPosition.current,
        MOVE_SPEED,
        delta.deltaTime
      );

      

      position.current = newPosition
      isMoving.current = true

      // redux usage
      dispatch(setNewPosition({x: newPosition.x, y: newPosition.y}));

      if (completed) {
        const { x, y } = position.current
        onMove(x, y)

        targetPosition.current = null
        isMoving.current = false
      }
    }

    updateSprite(currentDirection.current!, isMoving.current)
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
        // anchor={1.2}
        />
      }

    </pixiContainer>
  )
}

export default People