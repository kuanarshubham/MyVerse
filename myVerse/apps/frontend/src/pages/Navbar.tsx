import * as React from "react"
import { Link, useNavigate } from "react-router"

//redux
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setSignin } from "../feature/authSlice";


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
    const signin = useAppSelector(state => state.auth.signin);

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const [navBtn1, setNavBtn1] = React.useState<"default" | "outline" | null>("default");
    const [navBtn2, setNavBtn2] = React.useState<"default" | "outline" | null>("default");



    return (
        <NavigationMenu viewport={false} className="max-w-none h-[65%] w-screen flex justify-between pl-15 pr-9 mt-2 items-center">
            <NavigationMenuList className="lg:w-[550px] flex justify-between items-center">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/">Logo</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/about">About Us</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
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

                <NavigationMenuItem>
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

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                        <Link to="/pricing">Pricing</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>


            {
                token
                    ?
                    <div className="w-[17%] h-[100%] flex justify-around pt-2 pb-3 items-center">
                        <RainbowButton
                            variant={navBtn1}
                            onMouseEnter={() => setNavBtn1("outline")}
                            onMouseLeave={() => setNavBtn1("default")}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                        >
                            Profile
                        </RainbowButton>
                        <RainbowButton
                            variant={navBtn2}
                            onMouseEnter={() => setNavBtn2("outline")}
                            onMouseLeave={() => setNavBtn2("default")}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                        >
                            Create Space
                        </RainbowButton>
                    </div>
                    :
                    <div className="w-[17%] h-[100%] flex justify-around pt-2 pb-3 items-center">
                        <RainbowButton
                            variant={navBtn1}
                            onMouseEnter={() => setNavBtn1("outline")}
                            onMouseLeave={() => setNavBtn1("default")}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                            onClick={() => {
                                dispatch(setSignin());
                            }}
                        >
                            Login
                        </RainbowButton>
                        <RainbowButton
                            variant={navBtn2}
                            onMouseEnter={() => setNavBtn2("outline")}
                            onMouseLeave={() => setNavBtn2("default")}
                            style={{ transition: 'all 0.5s ease-in-out' }}
                        >
                            Register
                        </RainbowButton>
                    </div>
            }
        </NavigationMenu>
    )
}

export default Navbar;


