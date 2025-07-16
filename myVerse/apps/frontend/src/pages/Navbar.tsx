import * as React from "react"
import { Link, useNavigate } from "react-router"

// redux
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSignin, setToken } from "../feature/authSlice";
import { setNavBtn1, setNavBtn2 } from "@/feature/navSlice";


// ui
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { RainbowButton } from "@/components/magicui/rainbow-button";

// local
import CreateSpace from "./CreateSpace";



function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<"li"> & { href: string }) {

    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link to={href}>
                    <div className="text-sm leading-none font-medium">{title}</div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    )
}


const Navbar = () => {

    const token = useAppSelector(state => state.auth.token);

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const navBtn1 = useAppSelector(s => s.nav.navBtn1);
    const navBtn2 = useAppSelector(s => s.nav.navBtn2);

    React.useEffect(() => {
        if (!token) {
            const authToken = localStorage.getItem("auth-token");

            if (authToken) dispatch(setToken({ token: authToken }));
        }
    })



    return (
        <NavigationMenu viewport={true} className="max-w-full h-16 w-screen flex justify-between  mt-2 items-center pr-4 pl-4 lg:pl-8 lg:pr-8 ">
            <NavigationMenuList className="lg:w-[550px]  flex justify-between items-center">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/">
                            <h1 style={{fontFamily: "ByteBounce"}} className="font-light text-4xl w-full h-full   flex justify-center items-center  bg-gradient-to-bl from-purple-500 via-pink-400 to-yellow-500 text-transparent bg-clip-text">MyVerse</h1>
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem className="hidden lg:block">
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/about">About Us</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem className="hidden lg:block">
                    <NavigationMenuTrigger>Assert</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="from-muted/50 to-muted flex h-full w-full flex-col justify-end rounded-md bg-linear-to-b p-6 no-underline outline-hidden select-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mt-4 mb-2 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-tight">
                                            Beautifully designed components built with Tailwind CSS.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </ListItem>
                            <ListItem href="/docs/installation" title="Installation">
                                How to install dependencies and structure your app.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="hidden lg:block">
                    <NavigationMenuTrigger>Contact Us</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[300px] gap-4">
                            <li>
                                <NavigationMenuLink asChild>
                                    <Link to="#">
                                        <div className="font-medium">Components</div>
                                        <div className="text-muted-foreground">
                                            Browse all components in the library.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link to="#">
                                        <div className="font-medium">Documentation</div>
                                        <div className="text-muted-foreground">
                                            Learn how to use the library.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                                <NavigationMenuLink asChild>
                                    <Link to="#">
                                        <div className="font-medium">Blog</div>
                                        <div className="text-muted-foreground">
                                            Read our latest blog posts.
                                        </div>
                                    </Link>
                                </NavigationMenuLink>
                            </li>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem className="hidden lg:block">
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/pricing">Pricing</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>


            {
                token
                    ?
                    <div className="w-[17%] h-[100%] flex justify-end gap-4 lg:gap-8 pt-2 pb-3 items-center">
                        <RainbowButton
                            variant={navBtn1}
                            onMouseEnter={() => dispatch(setNavBtn1({type: "outline"}))}
                            onMouseLeave={() => dispatch(setNavBtn1({type: "default"}))}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                        >
                            Profile
                        </RainbowButton>

                        <CreateSpace />
                        
                    </div>
                    :
                    <div className="w-[50%] lg:w-[17%] h-[100%] flex justify-around pt-2 pb-3 items-center">
                        <RainbowButton
                            variant={navBtn1}
                            onMouseEnter={() => dispatch(setNavBtn1({type:"outline"}))}
                            onMouseLeave={() => dispatch(setNavBtn1({type:"default"}))}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                            onClick={() => {
                                dispatch(setSignin({ value: true }));
                                navigate("/auth");
                            }}
                        >
                            Login
                        </RainbowButton>
                        <RainbowButton
                            variant={navBtn2}
                            onMouseEnter={() => dispatch(setNavBtn2({type:"outline"}))}
                            onMouseLeave={() => dispatch(setNavBtn2({type:"default"}))}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                            onClick={() => {
                                dispatch(setSignin({ value: false }));
                                navigate("/auth");
                            }}
                        >
                            Register
                        </RainbowButton>
                    </div>
            }
        </NavigationMenu>
    )
}

export default Navbar;


