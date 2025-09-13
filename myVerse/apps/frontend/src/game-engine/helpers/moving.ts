import { TILE_SIZE } from "../../utils/constants.utils";
import type { Direction, IPosition } from "../types/common";

export const calculateCanvasSize = () => {
  const width = window.innerWidth
  const height = window.innerHeight
  return { width, height }
}

export const calculateNewTarget = (
  x: number,
  y: number,
  direction: Direction
): IPosition => {
  return {
    x:
      Math.floor(x / TILE_SIZE) * TILE_SIZE +
      (direction === 'LEFT'
        ? -TILE_SIZE
        : direction === 'RIGHT'
          ? TILE_SIZE
          : 0),
    y:
      Math.floor(y / TILE_SIZE) * TILE_SIZE +
      (direction === 'UP' ? -TILE_SIZE : direction === 'DOWN' ? TILE_SIZE : 0),
  }
}

export const checkCanMove = (
  target: IPosition,
  collisionMap: number[],
  mapWidth: number
): boolean => {
  const row = Math.floor(target.y / TILE_SIZE);
  const col = Math.floor(target.x / TILE_SIZE);
  // Use the dynamic mapWidth instead of a hardcoded COL constant
  const index = mapWidth * row + col;

  if (index < 0 || index >= collisionMap.length) {
    return false; // Target is outside the map boundaries
  }

  return collisionMap[index] !== 1; // Check against the dynamic map
}

export const moveTowards = (
  current: number,
  target: number,
  maxStep: number
) => {
  return (
    current +
    Math.sign(target - current) * Math.min(Math.abs(target - current), maxStep)
  )
}

export const continueMovement = (
  currentPosition: IPosition,
  targetPosition: IPosition,
  step: number
): IPosition => {
  return {
    x: moveTowards(currentPosition.x, targetPosition.x, step),
    y: moveTowards(currentPosition.y, targetPosition.y, step),
  }
}

export const handleMovement = (
  currentPosition: IPosition,
  targetPosition: IPosition,
  moveSpeed: number,
  delta: number
) => {
  const step = moveSpeed * TILE_SIZE * delta
  const distance = Math.hypot(
    targetPosition.x - currentPosition.x,
    targetPosition.y - currentPosition.y
  )

  if (distance <= step) {
    return {
      position: targetPosition,
      completed: true,
    }
  }

  return {
    position: continueMovement(currentPosition, targetPosition, step),
    completed: false,
  }
}