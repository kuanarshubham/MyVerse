// import { useCallback, useEffect, useState } from 'react'
// import { Application, extend } from '@pixi/react'
// import { Container, Assets, Texture, Sprite } from 'pixi.js'
// import { useParams } from 'react-router'
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

//     const [token, setToken] = useState<string>("");

//     useEffect(() => {
//         const storedToken = localStorage.getItem("auth-token");
//         if (storedToken) {
//             setToken(storedToken);
//         }
//     }, []); // The empty array [] makes this run only once.

//     const { spaceId } = useParams<{ spaceId: string }>();
//     console.log("Token from spaceTSX: ", token);
//     if (!spaceId) {
//         return <div style={{ color: 'white' }}>ERROR: No Space ID found in URL.</div>;
//     }
//     const socketURL = "ws://localhost:3001"; // Your WebSocket server URL


//     // --- FIX: All hooks are now called unconditionally at the top ---
//     const { users, myPosition, isConnected, sendMovement } = useSocket({ socketURL, token, spaceId });

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
//     const [otherPlayerTexture, setOtherPlayerTexture] = useState(Texture.EMPTY);

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

//     // --- FIX: Conditional return is now placed AFTER all hook calls ---
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

// export default Space;




import { useCallback, useEffect, useState } from 'react'
import { Application, extend } from '@pixi/react'
import { Container, Assets, Texture, Sprite } from 'pixi.js'
import { useParams } from 'react-router-dom';
import axios from 'axios';

extend({
    Container, Sprite
})

// redux
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { calculateSpaceSize } from "../../feature/spaceSlice";

// local
import Map1 from "./Map";
import { GAME_HEIGHT, GAME_WIDTH, TILE_SIZE, BASE_HTTP_URL } from '@/utils/constants.utils' 
import People from './People'
import { useSocket } from '../../sockets/useSocket';

// texture
import AvatarPng from "../../assets/avatar/Avatar.png" // This will now be a fallback/default
import MapPng from "../../assets/map/MeetingRoom.png";

const Space = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector(s => s.auth.token);
    
    const { spaceId } = useParams<{ spaceId: string }>();
    if (!spaceId) {
        return <div style={{ color: 'white' }}>ERROR: No Space ID found in URL.</div>;
    }
    const socketURL = "ws://localhost:3001";

    const { users, myPosition, isConnected, sendMovement } = useSocket({ socketURL, token, spaceId });

    const [collisionMap, setCollisionMap] = useState<number[]>([]);
    const [spaceDimensions, setSpaceDimensions] = useState({ width: 0, height: 0 });

    // CHANGE: New state to store a map of userId -> avatar Texture
    const [playerTextures, setPlayerTextures] = useState<Map<string, Texture>>(new Map());

    useEffect(() => {
        if (!token || !spaceId) return;

        const fetchSpaceData = async () => {
            try {
                const response = await axios.get(`${BASE_HTTP_URL}/space/${spaceId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                const spaceData = response.data.data.space[0];
                const [width, height] = spaceData.dimension.split('x').map(Number);
                setSpaceDimensions({ width, height });

                const newCollisionMap = Array(width * height).fill(0);
                spaceData.elements.spaceElements.forEach((element: any) => {
                    if (element.element.static) {
                        const index = element.y * width + element.x;
                        if (index < newCollisionMap.length) newCollisionMap[index] = 1;
                    }
                });
                setCollisionMap(newCollisionMap);
            } catch (error) {
                console.error("Failed to fetch space data:", error);
            }
        };
        fetchSpaceData();
    }, [spaceId, token]);

    // CHANGE: New useEffect to fetch avatar data when the user list changes
    useEffect(() => {
        if (!token || users.size === 0) return;

        const fetchUserAvatars = async () => {
            const userIds = Array.from(users.keys());
            
            try {
                const response = await axios.get(`${BASE_HTTP_URL}/user/metadata/bulk?ids=[${userIds.join(',')}]`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const usersWithAvatars = response.data.data.users;
                
                const newTextures = new Map<string, Texture>();
                const textureCache = new Map<string, Texture>(); 

                for (const user of usersWithAvatars) {
                    if (user.avatar?.imageUrl) {
                        let texture = textureCache.get(user.avatar.imageUrl);
                        if (!texture) {
                            texture = await Assets.load(user.avatar.imageUrl);
                            textureCache.set(user.avatar.imageUrl, texture!);
                        }
                        newTextures.set(user.id, texture!);
                    }
                }
                setPlayerTextures(newTextures);

            } catch (error) {
                console.error("Failed to fetch user avatars:", error);
            }
        };

        fetchUserAvatars();
    }, [users, token]);

    const sizeCanvas = {
        height: useAppSelector(s => s.space.screenHeight),
        width: useAppSelector(s => s.space.screenWidth)
    }

    const handleResize = () => {
        dispatch(calculateSpaceSize({ height: GAME_HEIGHT * 2, width: GAME_WIDTH * 2 }));
    };

    useEffect(() => {
        window.addEventListener("load", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const [heroTexture, setHeroTexture] = useState(Texture.EMPTY);
    const [bgTexture, setBgTexture] = useState(Texture.EMPTY);

    const onMove = useCallback((x: number, y: number) => {
        sendMovement(Math.round(x / TILE_SIZE), Math.round(y / TILE_SIZE));
    }, [sendMovement]);

    useEffect(() => {
        Assets.load(AvatarPng).then(setHeroTexture); // Load default avatar for the player
        Assets.load(MapPng).then(setBgTexture);
    }, []);

    if (!token) {
        return <div style={{ color: 'white' }}>Authenticating...</div>;
    }

    return (
    <div className={`w-[${sizeCanvas.width}] h-[${sizeCanvas.width}] flex justify-center items-center`}>
        {isConnected ? (
            <Application>
                <Map1 
                    size={sizeCanvas} 
                    texture={bgTexture} 
                />
                
                {myPosition && collisionMap.length > 0 && (
                    <People 
                        texture={heroTexture} 
                        initialPosition={myPosition} 
                        onMove={onMove} 
                        collisionMap={collisionMap} 
                        mapWidth={spaceDimensions.width}
                    />
                )}

                {/* Render other users */}
                {Array.from(users.values()).map(user => (
                    <pixiSprite
                        key={user.userId}
                        texture={playerTextures.get(user.userId) || heroTexture}
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