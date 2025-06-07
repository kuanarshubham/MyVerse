// gloabl import
import { useCallback, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';


// ui
import { RetroGrid } from "@/components/magicui/retro-grid";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { AnimatedGradientText } from "@/components/magicui/animated-gradient-text";


// local import
import type { LoginForm } from '../types/auth.types';
import { baseUrlHttp } from '../utils/constants.utils';


// redux
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setSignin } from "../feature/authSlice";


const Auth = () => {


  const signin = useAppSelector((state) => state.auth.signin);
  const dispatch = useAppDispatch()

  const navigate = useNavigate();


  const toggleSignin = useCallback(() => {
    dispatch(setSignin());
  }, [dispatch, setSignin, signin]);


  const [form, setForm] = useState<LoginForm>({
    username: "",
    password: ""
  });


  const handleForm = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev: LoginForm) => ({
      ...prev,
      [e.target?.name]: e.target?.value
    }));

  }, [setForm]);

  const handleAuth = useCallback(async () => {
    try {
      let response;

      if (signin === true) {
        response = await axios.post(`${baseUrlHttp}/signin`, {
          ...form
        });
      }
      else {
        response = await axios.post(`${baseUrlHttp}/signup`, {
          ...form,
          type: "user"
        });
      }

      if (response.status === 200) {
        const { token } = response.data.data;
        localStorage.setItem("auth-token", token);
        navigate("/");

      }
    }
    catch (e) {
      console.log(`Error at axios: ${e}`);
    }

  }, [baseUrlHttp, form, navigate, signin]);

  return (
    <div className="h-screen w-screen">

      <div className="relative h-full w-full overflow-hidden flex flex-col justify-center items-center">
        <AnimatedGradientText
          speed={2}
          colorFrom="#A07CFE"
          colorTo="#FFBE7B"
          className="text-6xl font-black tracking-tight mb-4 flex pb-4"
        >
          MyVerse
        </AnimatedGradientText>

        <RetroGrid opacity={.25} lightLineColor='purple' darkLineColor='yellow' cellSize={40} />

        {signin ?
          <Card className="relative overflow-hidden max-w-[350px] w-full">
            <ShineBorder shineColor={["#A07CFE", "#A07CFE", "#FFBE7B"]} />
            <CardHeader>
              <CardTitle className="text-xl">Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input name="username" type="string" placeholder="Must be unique" onChange={handleForm} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" placeholder="•••••••••" onChange={handleForm} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col ">
              <Button className="w-full" onClick={handleAuth}>Sign In</Button>
              <div className="w-[70%] flex justify-around mt-1.5 font-normal text-sm">Don't have a account?<span className="font-medium underline" onClick={toggleSignin}>Register</span></div>
            </CardFooter>
          </Card>
          :
          <Card className="relative overflow-hidden max-w-[350px] w-full">
            <ShineBorder shineColor={["#A07CFE", "#A07CFE", "#FFBE7B"]} />
            <CardHeader>
              <CardTitle className="text-xl">Register</CardTitle>
              <CardDescription>
                Create new account with credentials.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input name="username" type="string" placeholder="Must be unique" onChange={handleForm} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input name="password" type="password" placeholder="•••••••••" onChange={handleForm} />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col ">
              <Button className="w-full" onClick={handleAuth}>Register</Button>
              <div className="w-[65%] flex justify-around mt-1.5 font-normal text-sm">Already have account?<span className="font-medium underline" onClick={toggleSignin}>Login</span></div>
            </CardFooter>
          </Card>}
      </div>
    </div>
  )
}

export default Auth