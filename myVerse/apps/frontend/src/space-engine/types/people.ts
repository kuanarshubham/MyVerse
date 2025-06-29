import type { Texture } from "pixi.js";

export interface TPeople {
  texture: Texture,
  onMove: (gridX: number, gridY: number) => void  
} 