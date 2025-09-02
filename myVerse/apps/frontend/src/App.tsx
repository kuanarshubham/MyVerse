import { ThemeProvider } from "@/components/theme-provider"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Layout from './Layout';
import Space from "./game-engine/components/Space";
import store from './store/store'
import { Provider } from 'react-redux'
import "./assets/fonts/font.css";



const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            Component: Layout,
            children: [
                {
                    path: "",
                    Component: Home
                },
                {
                    path: "space/:spaceId",
                    Component: Space
                }
            ]
        },
        {
            path: "/auth",
            Component: Auth
        }
    ]);

    return (
        <Provider store={store}>
            <ThemeProvider>
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
    )
}

export default App;