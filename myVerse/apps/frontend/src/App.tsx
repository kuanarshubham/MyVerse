import { ThemeProvider } from "@/components/theme-provider"
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Layout from './Layout';
import store from './store/Auth.store'
import { Provider } from 'react-redux'



const App = () => {

    const router = createBrowserRouter([
        {
            path: "/",
            Component: Layout,
            children: [
                {
                    path: "",
                    Component: Home
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