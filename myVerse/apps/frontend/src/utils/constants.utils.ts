export const BASE_HTTP_URL = "http://localhost:3000/api/v1";

export const TILE_SIZE = 32;
export const COL = 11;
export const ROW = 11;
export const GAME_WIDTH = TILE_SIZE * ROW - TILE_SIZE*2;
export const GAME_HEIGHT = TILE_SIZE * COL - TILE_SIZE*2;
export const HERO_WIDTH = GAME_WIDTH - (2 * TILE_SIZE);
export const HERO_HEIGHT = GAME_HEIGHT - (2 * TILE_SIZE);

export const DEFAULT_X = TILE_SIZE*10;
export const DEFAULT_Y = TILE_SIZE*1;
