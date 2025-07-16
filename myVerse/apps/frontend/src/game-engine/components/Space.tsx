import { useCallback, useEffect, useState } from 'react'
import { Application, extend, useTick } from '@pixi/react'
import { Container, Assets, Texture } from 'pixi.js'
extend({
    Container
})

// redux
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { calculateSpaceSize } from "../../feature/spaceSlice";

// local
import Map from "./Map";
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from '@/utils/constants.utils'
import People from './People'

// texture
import AvatarPng from "../../assets/avatar/Avatar.png"
import MapPng from "../../assets/map/MeetingRoom.png";

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

    const handleResize = () => {
        dispatch(calculateSpaceSize({
            height: GAME_HEIGHT*2 ,
            width: GAME_WIDTH*2
        }));
    };

    console.log(sizeCanvas.width);

    useEffect(() => {
        window.addEventListener("load", handleResize);
        // window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            // window.addEventListener("load", handleResize);
        }
    }, []);


    // texture
    const [heroTexture, setHeroTexture] = useState(Texture.EMPTY);
    const [bgTexture, setBgTexture] = useState(Texture.EMPTY);

    useEffect(() => {
        if (heroTexture === Texture.EMPTY) {
            Assets
                .load(AvatarPng)
                .then((result) => {
                    setHeroTexture(result)
                });
        }

        if(bgTexture === Texture.EMPTY){
            Assets
                .load(MapPng)
                .then((result) => {
                    setBgTexture(result);
                })
        }

    }, []);

    // hero
    const [heroPosition, setHeroPosition] = useState({x: 0, y:0});

    const updateHeroPosition = useCallback((x: number, y: number) => {
        setHeroPosition({
            x: Math.floor(x/TILE_SIZE),
            y: Math.floor(x/TILE_SIZE)
        })
    }, []);

    return (
        // <div className={`w-[${sizeCanvas.width}] h-[${sizeCanvas.width}] flex justify-center items-center`}>

            <Application height={auto} width={sizeCanvas.width+100} backgroundColor={"yellow"} className='flex justify-center items-center'>
                <Map
                    size={{
                        height: sizeCanvas.height,
                        width: sizeCanvas.width
                    }}

                    texture={bgTexture}
                />
                <People texture={heroTexture} onMove={updateHeroPosition} />
            </Application>
        // </div>
    )
}

export default Space