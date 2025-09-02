import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


// ui
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lens } from "@/components/magicui/lens";


// types
import type {Space, SpaceCardProps} from "@/types/home.type";


// local
import { BASE_HTTP_URL } from '@/utils/constants.utils';
import { useAppSelector } from '@/store/hooks';



const Home = () => {

  const token = useAppSelector(s => s.auth.token);

  const [spaces, setSpaces] = useState<Space[]>([]);

  const getAllUserSpace = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_HTTP_URL}/space/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.status === 200) {
        const allSpace = res.data.data.spaces;

        setSpaces(allSpace);
      }
    }
    catch (e) {
      console.log(`Error at getting all user's spaces`);
    }
  }, [token, spaces, setSpaces]);

  useEffect(() => {
    getAllUserSpace();
  }, [token]);

  return (
    <div className="h-screen w-[100%] flex items-center justify-center mt-96">
      <div className="grid w-[80%] lg:grid-cols-3 lg:gap-15 place-items-center">
        {
          spaces.map(sp => (
            <SpaceCard
              key={sp.id}
              thumbnail={sp.thumbnail}
              id={sp.id}
              height={sp.height}
              width={sp.width}
              title={sp.title}
            />
          ))
        }
      </div>
    </div>
  )
}

const SpaceCard: React.FC<SpaceCardProps> = ({ id, thumbnail, title, height, width }) => {
  const navigate = useNavigate(); 
  let randH = Math.random() * height;
  let randW = Math.random() * width;
  return (
    <Card className="relative max-w-md shadow-none lg:w-[300px] lg:h-[350px]">
      <CardHeader className="lg:w-[300px] lg:h-[350px] flex justify-center items-center">
        <Lens
          defaultPosition={{ x: randW / 2, y: randH / 2 }}
          lensSize={height / 3}
        >
          <img
            src={thumbnail}
            alt="image placeholder"
            width={height}
            height={width}
          />
        </Lens>
      </CardHeader>
      <CardContent>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardContent>
      <CardFooter className="space-x-4">
        <Button onClick={() => navigate(`/space/${id}`)}>Let's go</Button>
        <Button variant="secondary">Another time</Button>
      </CardFooter>
    </Card>
  )
}

export default Home