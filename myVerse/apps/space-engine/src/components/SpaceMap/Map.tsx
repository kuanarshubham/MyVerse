import { useMemo } from 'react'
import { Texture } from 'pixi.js'
import type { PropsWithChildren } from 'react'
import { Application, extend } from '@pixi/react'
import { Sprite } from 'pixi.js'
extend({
    Sprite
});


// local
import MapPng from "../../assets/map/office.png"


// types
import type { Map } from '../../types/map'



const SpaceMap = ({ size, children }: PropsWithChildren<Map>) => {

    const mapTexture = useMemo(() => Texture.from(MapPng), []);
    
    return (
        <Application>
            <pixiSprite 
                texture={mapTexture}
                height={size.height}
                width={size.width}
                >
                {children}
            </pixiSprite>
        </Application>
    );
}

export default SpaceMap