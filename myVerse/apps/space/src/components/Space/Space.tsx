import { useEffect } from 'react'
import { Application, extend } from '@pixi/react'
import { Container } from 'pixi.js'
extend({
  Container
})

// redux
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { calculateSpaceSize } from '../../feature/spaceSlice'

// local
import SpaceMap from "../SpaceMap/SpaceMap"




const Space = () => {

  const dispatch = useAppDispatch();

  const sizeCanvas = {
    height: useAppSelector(s => s.space.screenHeight),
    width: useAppSelector(s => s.space.screenWidth)
  }

  dispatch(calculateSpaceSize({
    height: window.innerHeight,
    width: window.innerWidth
  }));


  return (
    <>
      <Application height={sizeCanvas.height} width={sizeCanvas.width}>
        {/* <pixiContainer height={sizeCanvas.height} width={sizeCanvas.width}>
          
        </pixiContainer> */}
        <SpaceMap
          size={{
            height: sizeCanvas.height,
            width: sizeCanvas.width
          }}
        >

        </SpaceMap>
      </Application>
    </>
  )
}

export default Space