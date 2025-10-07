import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import "./index.css";
import {router} from "./routes/router";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {ThemeProvider} from "@mui/material";
import {CacheProvider} from "@emotion/react";
import {theme, cacheRtl} from "../mui.config.js";

createRoot(document.getElementById("root")).render(
    <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
            <RouterProvider router={router}/>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </ThemeProvider>
    </CacheProvider>
);
