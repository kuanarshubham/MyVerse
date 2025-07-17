import { useRef, useCallback, useEffect } from 'react'
import { Sprite, Container, useTick } from '@pixi/react'
import type { PropsWithChildren } from 'react'
import {
  ANIMATION_SPEED,
  DEFAULT_X_POS,
  DEFAULT_Y_POS,
  MOVE_SPEED,
} from '../../constants/game-world'
import { useHeroControls } from './useHeroControls'
import { Texture } from 'pixi.js'
import {
  calculateNewTarget,
  checkCanMove,
  handleMovement,
} from '../helpers/heroUsage'
import { useHeroAnimation } from './useHeroAnimation'
import { Direction } from '../../types/game-world'
import { DEFAULT_X, DEFAULT_Y } from '@/utils/constants.utils'

interface IHeroProps {
  texture: Texture
  onMove: (gridX: number, gridY: number) => void
}

const People = ({ texture, onMove }: PropsWithChildren<IHeroProps>) => {
  const position = useRef({ x: DEFAULT_X, y: DEFAULT_Y });

  useEffect(() => {
    onMove(position.current.x, position.current.y);
  }, [onMove]);


  return (
    <pixiContainer>
      
      <pixiSprite 
        texture={texture}
        x={position.current.x}
        y={position.current.y}
        scale={2}
        
      />

    </pixiContainer>
  )
}

export default People