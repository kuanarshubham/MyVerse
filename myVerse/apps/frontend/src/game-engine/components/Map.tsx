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



// types
interface ISpaceMap {
    size: {height: number, width: number},
    texture: Texture
}

const Map = ({ size, children, texture }: PropsWithChildren<ISpaceMap>) => {

    return texture ? (
        <pixiSprite
            texture={texture}
            height={size.height}
            width={size.width}
            // anchor={{x:0.487, y:0.48}}
            // x={size.width/2}
            // y={size.height/2}
            children={children}
        />
    ): (<h1 className='text-white'>No texture</h1>);
}

export default Map