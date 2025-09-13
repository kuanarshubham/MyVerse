// import React, { useState } from "react";
// import axios from "axios";
// // CHANGE: Import useNavigate to redirect the user after creating a space
// import { useNavigate } from "react-router-dom";

// // ui
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button";
// import { MagicCard } from "@/components/magicui/magic-card";
// import { RainbowButton } from "@/components/magicui/rainbow-button"
// import { Card } from "@/components/ui/card";
// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger,
// } from "@/components/ui/hover-card"

// // redux
// import { useAppDispatch, useAppSelector } from "@/store/hooks";
// import { setNavBtn2 } from "@/feature/navSlice";

// // local
// import { BASE_HTTP_URL } from "@/utils/constants.utils";
// import type { Element, ElementCard } from "@/types/space.type";


// const MapElementsCard: React.FC<ElementCard> = ({imageSrc, name}) => {
//   return (
//     <HoverCard>
//       <HoverCardTrigger>
//         <Card className="h-12 w-12 lg:h-24 lg:w-22 flex justify-center items-center border-none rounded-none bg-white">
//           <img src={imageSrc} alt="element" className="w-full h-full object-contain"/>
//         </Card>
//       </HoverCardTrigger>
//       <HoverCardContent className="w-auto h-2 opacity-90 rounded-sm flex justify-center items-center">
//         {name}
//       </HoverCardContent>
//     </HoverCard>
//   )
// }


// const CreateSpace = () => {
//   const navBtn2 = useAppSelector(s => s.nav.navBtn2);
//   const dispatch = useAppDispatch();
//   const [elements, setElements] = useState<Element[]>([]);

//   // CHANGE: Get the auth token and navigate function
//   const token = useAppSelector(s => s.auth.token);
//   const navigate = useNavigate();

//   // CHANGE: Add state to manage the form inputs
//   const [spaceName, setSpaceName] = useState("");
//   const [dimensions, setDimensions] = useState("20x15"); // Set a default value

//   const getAllAvailableElements = async () => {
//     try {
//       // NOTE: Your tests indicate this endpoint is `/api/v1/admin/element`, not `/elements`.
//       // You may need to adjust this URL if it doesn't work.
//       const res = await axios.get(`${BASE_HTTP_URL}/elements`);
//       if (res.status !== 200) console.log("Error at fetching");
//       setElements(res.data.data.elements);
//     }
//     catch (e) {
//       console.log(`Error at creat space: ${e}`)
//     }
//   }

//   // CHANGE: Implement the form submission logic
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent the default browser refresh on form submission

//     if (!spaceName || !dimensions) {
//         alert("Please fill out all fields.");
//         return;
//     }

//     try {
//         const response = await axios.post(`${BASE_HTTP_URL}/space`, 
//             {
//                 name: spaceName,
//                 dimensions: dimensions,
//             },
//             {
//                 headers: {
//                     // Send the token for authentication
//                     Authorization: `Bearer ${token}`
//                 }
//             }
//         );

//         if (response.status === 200) {
//             const { spaceId } = response.data.data;
//             // On success, navigate the user to their new space
//             navigate(`/space/${spaceId}`);
//         }
//     } catch (err) {
//         console.error("Failed to create space:", err);
//         alert("Failed to create space. Please try again.");
//     }
//   }

//   return (
//     <Dialog>
//       {/* CHANGE: Add the onSubmit handler to the form */}
//       <form onSubmit={handleSubmit}>
//         <DialogTrigger asChild>
//           <RainbowButton
//             variant={navBtn2}
//             onMouseEnter={() => dispatch(setNavBtn2({ type: "outline" }))}
//             onMouseLeave={() => dispatch(setNavBtn2({ type: "default" }))}
//             style={{ transition: 'all 0.5s ease-in-out' }}
//             onClick={getAllAvailableElements}
//           >
//             Create Space
//           </RainbowButton>
//         </DialogTrigger>

//         <DialogContent className="bg-transparent border-none w-96 lg:w-full lg:max-w-5xl flex justify-center items-center">
//           <MagicCard className="h-[80dvh] w-full p-10" gradientSize={400}>
//             <DialogHeader>
//               <DialogTitle>Space Information</DialogTitle>
//               <DialogDescription>
//                 Create the space customised to your needs.
//               </DialogDescription>
//             </DialogHeader>

//             <div className="mt-4 grid gap-4">
//               <div className="grid gap-2">
//                 <Label htmlFor="spaceName">Space Name</Label>
//                 {/* CHANGE: Connect the input to the state */}
//                 <Input 
//                     id="spaceName" 
//                     name="spaceName" 
//                     value={spaceName}
//                     onChange={(e) => setSpaceName(e.target.value)}
//                     placeholder="My awesome new space"
//                 />
//               </div>
//               <div className="grid gap-2">
//                 <Label htmlFor="dimensions">Dimensions (e.g., 20x15)</Label>
//                  {/* CHANGE: Added an input for dimensions */}
//                 <Input 
//                     id="dimensions" 
//                     name="dimensions" 
//                     value={dimensions}
//                     onChange={(e) => setDimensions(e.target.value)}
//                 />
//               </div>
//             </div>

//             <div className="mt-4 flex justify-between w-full" id="mapSel&elementSel">
//               <div id="map" className="w-[60%]">
//                 {/* You can add a map selection UI here in the future */}
//                 <p>Map selection coming soon...</p>
//               </div>
//               <div className="w-[40%]" id="elements">
//                 {elements.map(e => (
//                   <MapElementsCard 
//                     key = {e.id}
//                     name={`${e.imageUrl + " & " + (e.static ? "static" : "non-static")}`}
//                     imageSrc={e.imageUrl}
//                   />
//                 ))}
//               </div>
//             </div>

//             <DialogFooter className="mt-4">
//               <DialogClose asChild>
//                 <Button variant="outline">Cancel</Button>
//               </DialogClose>
//               {/* CHANGE: The button's default type is submit, which now works with the form's onSubmit */}
//               <Button type="submit">Create</Button>
//             </DialogFooter>
//           </MagicCard>
//         </DialogContent>
//       </form>
//     </Dialog>
//   );
// }

// export default CreateSpace;



import React, { useState } from "react";
import axios from "axios";
// CHANGE: Import useNavigate to redirect the user after creating a space
import { useNavigate } from "react-router-dom";

// ui
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import { MagicCard } from "@/components/magicui/magic-card";
import { RainbowButton } from "@/components/magicui/rainbow-button"
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

// redux
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setNavBtn2 } from "@/feature/navSlice";

// local
import { BASE_HTTP_URL } from "@/utils/constants.utils";
import type { Element, ElementCard } from "@/types/space.type";


const MapElementsCard: React.FC<ElementCard> = ({imageSrc, name}) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <Card className="h-12 w-12 lg:h-24 lg:w-22 flex justify-center items-center border-none rounded-none bg-white">
          <img src={imageSrc} alt="element" className="w-full h-full object-contain"/>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto h-2 opacity-90 rounded-sm flex justify-center items-center">
        {name}
      </HoverCardContent>
    </HoverCard>
  )
}

const CreateSpace = () => {
  const navBtn2 = useAppSelector(s => s.nav.navBtn2);
  const dispatch = useAppDispatch();
  const [elements, setElements] = useState<Element[]>([]);

  // CHANGE: Get the auth token and navigate function for redirection
  const token = useAppSelector(s => s.auth.token);
  const navigate = useNavigate();

  // CHANGE: Add state to manage the form inputs
  const [spaceName, setSpaceName] = useState("");
  const [dimensions, setDimensions] = useState("20x15"); // Set a sensible default

  const getAllAvailableElements = async () => {
    try {
      // Note: Your tests indicate this endpoint might be under an /admin path.
      // Adjust if necessary.
      const res = await axios.get(`${BASE_HTTP_URL}/elements`);
      if (res.status !== 200) console.log("Error fetching elements");
      setElements(res.data.data.elements);
    } catch (e) {
      console.log(`Error fetching elements: ${e}`);
    }
  }

  // CHANGE: Implement the form submission logic
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default browser refresh

    console.log("Indide handle submit");

    if (!spaceName || !dimensions) {
        alert("Please provide a name and dimensions for your space.");
        return;
    }

    try {
        const response = await axios.post(`${BASE_HTTP_URL}/space`, 
            {
                name: spaceName,
                dimensions: dimensions,
                // You can add mapId here later when you build the map selection UI
            },
            {
                headers: {
                    // Send the token for authentication
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.status === 200) {
            const { spaceId } = response.data.data;
            // On success, navigate the user to their new space
            navigate(`/space/${spaceId}`);
        }
    } catch (err) {
        console.error("Failed to create space:", err);
        alert("Failed to create space. Please try again.");
    }
  }

  return (
    <Dialog>
      {/* CHANGE: Add the onSubmit handler to the form */}
      <form >
        <DialogTrigger asChild>
          <RainbowButton
            variant={navBtn2}
            onMouseEnter={() => dispatch(setNavBtn2({ type: "outline" }))}
            onMouseLeave={() => dispatch(setNavBtn2({ type: "default" }))}
            style={{ transition: 'all 0.5s ease-in-out' }}
            onClick={getAllAvailableElements}
          >
            Create Space
          </RainbowButton>
        </DialogTrigger>

        <DialogContent className="bg-transparent border-none w-96 lg:w-full lg:max-w-5xl flex justify-center items-center">
          <MagicCard className="h-[80dvh] w-full p-10" gradientSize={400}>
            <DialogHeader>
              <DialogTitle>Space Information</DialogTitle>
              <DialogDescription>
                Create a space customized to your needs.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="spaceName">Space Name</Label>
                {/* CHANGE: Connect the input to the state */}
                <Input 
                    id="spaceName" 
                    name="spaceName" 
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    placeholder="My awesome new space"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dimensions">Dimensions (e.g., 20x15)</Label>
                 {/* CHANGE: Added an input for dimensions and connected it to state */}
                <Input 
                    id="dimensions" 
                    name="dimensions" 
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-between w-full" id="mapSel&elementSel">
              <div id="map" className="w-[60%]">
                {/* You can add a map selection UI here in the future */}
                <p>Map selection coming soon...</p>
              </div>
              <div className="w-[40%]" id="elements">
                {elements.map(e => (
                  <MapElementsCard 
                    key = {e.id}
                    // The 'name' prop was causing issues, simplified for clarity
                    name={e.id} 
                    imageSrc={e.imageUrl}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              {/* This button's default type is 'submit', which now triggers the handleSubmit function */}
              <Button onClick={handleSubmit}>Create</Button>
            </DialogFooter>
          </MagicCard>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateSpace;