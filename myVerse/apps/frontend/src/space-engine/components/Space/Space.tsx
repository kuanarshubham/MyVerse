import { useCallback, useEffect, useState } from 'react'
import { Application, extend, useTick } from '@pixi/react'
import { Container, Assets, Texture } from 'pixi.js'
extend({
  Container
})

// redux
import { useAppDispatch, useAppSelector } from '../../../store/hooks'
import { calculateSpaceSize } from "../../../feature/spaceSlice"

// local
import SpaceMap from "../SpaceMap/SpaceMap"
import People from '../People/People'
import AvatarPng from "/assets/avatar/png/Avatar.png"
import { TILE_SIZE } from '@/utils/constants.utils'





const Space = () => {

  const dispatch = useAppDispatch();

  const position = {
    x: useAppSelector(s => s.people.x),
    y: useAppSelector(s => s.people.y)
  };

  const sizeCanvas = {
    height: useAppSelector(s => s.space.screenHeight),
    width: useAppSelector(s => s.space.screenWidth)
  }

  dispatch(calculateSpaceSize({
    height: window.innerHeight - 90,
    width: window.innerWidth - 90
  }));

  const [texture, setTexture] = useState(Texture.EMPTY);
  const [heroTexture, setHeroTexture] = useState(Texture.EMPTY);
  const [heroPosition, setHeroPosition] = useState({ x: 0, y: 0 });

  const updateHeroPosition = useCallback((x: number, y: number) => {
    setHeroPosition({
      x: Math.floor(x / TILE_SIZE),
      y: Math.floor(y / TILE_SIZE)
    });
  }, [setHeroPosition])


  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets
        .load(AvatarPng)
        .then((result) => {
          setTexture(result)
        });

      Assets
        .load(AvatarPng)
        .then(r => setHeroTexture(r));
    }
  }, [texture, heroTexture]);


  return (
    <div className={`w-[${sizeCanvas.width}] h-[${sizeCanvas.height}] flex justify-center items-center`}>
      <Application height={sizeCanvas.height} width={sizeCanvas.width} backgroundColor={"yellow"} >
        {/* <pixiContainer height={sizeCanvas.height} width={sizeCanvas.width}>
          
        </pixiContainer> */}
        <SpaceMap
          size={{
            height: sizeCanvas.height,
            width: sizeCanvas.width
          }}
        >
        </SpaceMap>
        <People texture={texture} onMove={updateHeroPosition} />
      </Application>
    </div>
  )
}

export default Space