import React, { useCallback, useState } from "react";
import axios from "axios";

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

  const getAllAvailableElements = async () => {
    try {
      const res = await axios.get(`${BASE_HTTP_URL}/elements`);

      // TODO
      if (res.status !== 200) console.log("Error at fetching");

      setElements(res.data.data.elements);
    }
    catch (e) {
      console.log(`Error at creat space: ${e}`)
    }
  }

  const handleSbmit = useCallback(() => {
    
  }, [])


  return (
    <Dialog>
      <form >

        <DialogTrigger asChild>
          <RainbowButton
            variant={navBtn2}
            onMouseEnter={() => dispatch(setNavBtn2({ type: "outline" }))}
            onMouseLeave={() => dispatch(setNavBtn2({ type: "default" }))}
            style={{ transition: 'all 0.5s ease-in-out' }}
            onClick={() => getAllAvailableElements()}
          >
            Create Space
          </RainbowButton>
        </DialogTrigger>



        <DialogContent className="bg-transparent border-none w-96 lg:w-full lg:max-w-5xl flex justify-center items-center">
          <MagicCard className="h-[80dvh] w-full p-10" gradientSize={400}>
            <DialogHeader>
              <DialogTitle>Space Information</DialogTitle>
              <DialogDescription>
                Create the sapce customised to your needs.
              </DialogDescription>
            </DialogHeader>


            <div className="mt-4">
              <div className="grid gap-4">
                <Label htmlFor="name-1">Space Name</Label>
                <Input id="spaceName" name="spaceName" />
              </div>
            </div>

            <div className="mt-4 flex justify-between bg-amber-50 w-full" id="mapSel&elementSel">
              <div id="map" className="w-[60%]">
                
              </div>

              <div className="w-[40%]" id="elements">
                {elements.map(e => (
                  <MapElementsCard 
                    key = {e.id}
                    name={`${e.imageUrl + " & " + (e.static ? "static" : "non-static")}`}
                    imageSrc={e.imageUrl}
                  />
                ))}
              </div>
            </div>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </MagicCard>
        </DialogContent>
      </form>
    </Dialog>
  );
}

export default CreateSpace;


