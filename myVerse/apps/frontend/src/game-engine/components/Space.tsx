// import { useCallback, useEffect, useState } from 'react'
// import { Application, extend } from '@pixi/react'
// import { Container, Assets, Texture, Sprite } from 'pixi.js'
// extend({
//     Container, Sprite
// })

// // redux
// import { useAppDispatch, useAppSelector } from '../../store/hooks'
// import { calculateSpaceSize } from "../../feature/spaceSlice";

// // local
// import Map from "./Map";
// import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from '@/utils/constants.utils'
// import People from './People'
// import { useSocket } from '../../sockets/useSocket';

// // texture
// import AvatarPng from "../../assets/avatar/Avatar.png"
// import MapPng from "../../assets/map/MeetingRoom.png";

// const Space = () => {
//     const dispatch = useAppDispatch();

//     const [token, setToken] = useState<string | null>(null);

//     useEffect(() => {
//         const storedToken = localStorage.getItem("auth-token");
//         if (storedToken) {
//             setToken(storedToken);
//         }
//     }, []); // The empty array [] makes this run only once.

//     const spaceId = "1"; // Replace with actual space ID
//     console.log("Token from spaceTSX: ", token);
//     const socketURL = "ws://localhost:3001"; // Your WebSocket server URL



//     const { users, myPosition, isConnected, sendMovement } = useSocket({ socketURL, token, spaceId });

//     // const position = {
//     //     x: useAppSelector(s => s.people.x),
//     //     y: useAppSelector(s => s.people.y)
//     // };

//     const sizeCanvas = {
//         height: useAppSelector(s => s.space.screenHeight),
//         width: useAppSelector(s => s.space.screenWidth)
//     }

//     const handleResize = () => {
//         dispatch(calculateSpaceSize({
//             height: GAME_HEIGHT * 2,
//             width: GAME_WIDTH * 2
//         }));
//     };

//     console.log(sizeCanvas.width);

//     useEffect(() => {
//         window.addEventListener("load", handleResize);
//         // window.addEventListener("resize", handleResize);
//         return () => {
//             window.removeEventListener("resize", handleResize);
//             // window.addEventListener("load", handleResize);
//         }
//     }, []);


//     // texture
//     const [heroTexture, setHeroTexture] = useState(Texture.EMPTY);
//     const [bgTexture, setBgTexture] = useState(Texture.EMPTY);

//     const onMove = useCallback((x: number, y: number) => {
//         // Round to nearest integer for grid-based movement
//         sendMovement(Math.round(x / TILE_SIZE), Math.round(y / TILE_SIZE));
//     }, [sendMovement]);

//     useEffect(() => {
//         if (heroTexture === Texture.EMPTY) {
//             Assets
//                 .load(AvatarPng)
//                 .then((result) => {
//                     setHeroTexture(result)
//                     setOtherPlayerTexture(result)
//                 });
//         }

//         if (bgTexture === Texture.EMPTY) {
//             Assets
//                 .load(MapPng)
//                 .then((result) => {
//                     setBgTexture(result);
//                 })
//         }

//     }, []);

//     // hero
//     // const [heroPosition, setHeroPosition] = useState({x: 0, y:0});

//     // const updateHeroPosition = useCallback((x: number, y: number) => {
//     //     setHeroPosition({
//     //         x: Math.floor(x/TILE_SIZE),
//     //         y: Math.floor(x/TILE_SIZE)
//     //     })
//     // }, []);

//     // return (
//     //     <div className={`w-[${sizeCanvas.width}] h-[${sizeCanvas.width}] flex justify-center items-center`}>

//     //         <Application>
//     //             <Map
//     //                 size={{
//     //                     height: sizeCanvas.height,
//     //                     width: sizeCanvas.width
//     //                 }}

//     //                 texture={bgTexture}
//     //             />
//     //             <People texture={heroTexture} onMove={updateHeroPosition} />
//     //         </Application>
//     //     </div>
//     // )

//     const [otherPlayerTexture, setOtherPlayerTexture] = useState(Texture.EMPTY);

//     if (!token) {
//         return <div style={{ color: 'white' }}>Authenticating...</div>;
//     }

//     return (
//         <div className={`w-[${sizeCanvas.width}] h-[${sizeCanvas.width}] flex justify-center items-center`}>
//             {isConnected ? (
//                 <Application>
//                     <Map
//                         size={{
//                             height: sizeCanvas.height,
//                             width: sizeCanvas.width
//                         }}
//                         texture={bgTexture}
//                     />
//                     {myPosition && <People texture={heroTexture} initialPosition={myPosition} onMove={onMove} />}

//                     {/* Render other users */}
//                     {Array.from(users.values()).map(user => (
//                         <pixiSprite
//                             key={user.userId}
//                             texture={otherPlayerTexture}
//                             x={user.x * TILE_SIZE}
//                             y={user.y * TILE_SIZE}
//                             width={TILE_SIZE}
//                             height={TILE_SIZE}
//                         />
//                     ))}
//                 </Application>
//             ) : (
//                 <div style={{ color: 'white' }}>Connecting to server...</div>
//             )}
//         </div>
//     )
// }

// export default Space



import { useCallback, useEffect, useState } from 'react'
import { Application, extend } from '@pixi/react'
import { Container, Assets, Texture, Sprite } from 'pixi.js'
extend({
    Container, Sprite
})

// redux
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { calculateSpaceSize } from "../../feature/spaceSlice";

// local
import Map from "./Map";
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE } from '@/utils/constants.utils'
import People from './People'
import { useSocket } from '../../sockets/useSocket';

// texture
import AvatarPng from "../../assets/avatar/Avatar.png"
import MapPng from "../../assets/map/MeetingRoom.png";

const Space = () => {
    const dispatch = useAppDispatch();

    const [token, setToken] = useState<string>("");

    useEffect(() => {
        const storedToken = localStorage.getItem("auth-token");
        if (storedToken) {
            setToken(storedToken);
        }
    }, []); // The empty array [] makes this run only once.

    const spaceId = "1"; // Replace with actual space ID
    console.log("Token from spaceTSX: ", token);
    const socketURL = "ws://localhost:3001"; // Your WebSocket server URL


    // --- FIX: All hooks are now called unconditionally at the top ---
    const { users, myPosition, isConnected, sendMovement } = useSocket({ socketURL, token, spaceId });

    const sizeCanvas = {
        height: useAppSelector(s => s.space.screenHeight),
        width: useAppSelector(s => s.space.screenWidth)
    }

    const handleResize = () => {
        dispatch(calculateSpaceSize({
            height: GAME_HEIGHT * 2,
            width: GAME_WIDTH * 2
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
    const [otherPlayerTexture, setOtherPlayerTexture] = useState(Texture.EMPTY);

    const onMove = useCallback((x: number, y: number) => {
        // Round to nearest integer for grid-based movement
        sendMovement(Math.round(x / TILE_SIZE), Math.round(y / TILE_SIZE));
    }, [sendMovement]);

    useEffect(() => {
        if (heroTexture === Texture.EMPTY) {
            Assets
                .load(AvatarPng)
                .then((result) => {
                    setHeroTexture(result)
                    setOtherPlayerTexture(result)
                });
        }

        if (bgTexture === Texture.EMPTY) {
            Assets
                .load(MapPng)
                .then((result) => {
                    setBgTexture(result);
                })
        }

    }, []);

    // --- FIX: Conditional return is now placed AFTER all hook calls ---
    if (!token) {
        return <div style={{ color: 'white' }}>Authenticating...</div>;
    }

    return (
        <div className={`w-[${sizeCanvas.width}] h-[${sizeCanvas.width}] flex justify-center items-center`}>
            {isConnected ? (
                <Application>
                    <Map
                        size={{
                            height: sizeCanvas.height,
                            width: sizeCanvas.width
                        }}

                        texture={bgTexture}
                    />
                    {myPosition && <People texture={heroTexture} initialPosition={myPosition} onMove={onMove} />}

                    {/* Render other users */}
                    {Array.from(users.values()).map(user => (
                        <pixiSprite
                            key={user.userId}
                            texture={otherPlayerTexture}
                            x={user.x * TILE_SIZE}
                            y={user.y * TILE_SIZE}
                            width={TILE_SIZE}
                            height={TILE_SIZE}
                        />
                    ))}
                </Application>
            ) : (
                <div style={{ color: 'white' }}>Connecting to server...</div>
            )}
        </div>
    )
}

export default Space;
