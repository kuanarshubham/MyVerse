import { useEffect, useState } from 'react'
import { Texture, Container, Assets } from 'pixi.js';
import type { PropsWithChildren } from 'react'
import { extend } from '@pixi/react'
import { Sprite } from 'pixi.js'
extend({
    Sprite,
    Texture,
    Container
});


// local
import MapPng from "../../assets/map/office.png"


// types
import type { TSpaceMap } from '../../types/spaceMap'



const SpaceMap = ({ size, children }: PropsWithChildren<TSpaceMap>) => {


    const [texture, setTexture] = useState(Texture.EMPTY)

    useEffect(() => {
        if (texture === Texture.EMPTY) {
            Assets
                .load(MapPng)
                .then((result) => {
                    setTexture(result)
                });
        }
    }, [texture]);

    return texture ? (
        <pixiSprite
            texture={texture}
            height={size.height}
            width={size.width}
            children={children}
        />
    ): (<h1 style={{color: 'white'}}>No texture</h1>);
}

export default SpaceMap