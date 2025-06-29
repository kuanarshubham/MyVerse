import { useEffect } from 'react'
import { Application } from '@pixi/react'


// redux
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { calculateSpaceSize } from '../../feature/spaceSlice'

import SpaceMap from '../SpaceMap/Map'

const Space = () => {

  const dispatch = useAppDispatch();

  const size = {
    height: useAppSelector(s => s.space.screenHeight),
    width: useAppSelector(s => s.space.screenWidth)
  }

  useEffect(() => {
    dispatch(calculateSpaceSize());

    const handleResize = () => dispatch(calculateSpaceSize());
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [calculateSpaceSize, dispatch]);


  // return (
  //   <Stage height={size.height} width={size.width}>
  //     <SpaceMap 
  //       size={{
  //         height: size.height*0.8,
  //         width: size.width*0.8
  //       }}
  //       />
  //   </Stage>
  // )


  return (
    <Application height={size.height} width={size.width}>
      <SpaceMap
        size={{
          height: size.height * 0.8,
          width: size.width * 0.8
        }}

      />
    </Application>
  )
}

export default Space