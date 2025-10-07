import {createTheme} from "@mui/material/styles";
import rtlPlugin from "stylis-plugin-rtl";
import createCache from "@emotion/cache";

// RTL Cache
export const cacheRtl = createCache({
    key: "mui-rtl",
    stylisPlugins: [rtlPlugin],
});

// MUI Theme
export const theme = createTheme({
    direction: "rtl",
    typography: {
        fontFamily: "B Yekan",
    },
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: 'gray',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& label.Mui-focused': {
                        color: '#d32f2f', // Focused label color
                    },
                    '& .MuiInputLabel-root': {
                        color: "gray",
                    },
                    '& .MuiFormLabel-root': {
                        color: "gray",
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            transition: "all 0.2s",
                        },
                        '&:hover fieldset': {
                            borderColor: '#b71c1c', // Border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#d32f2f', // Border color when focused
                        },
                    },
                },
            },
        },
    },
    palette: {
        primary: {
            main: "#ff5644",
        },
        secondary: {
            main: "#ff5644",
        },
        error: {
            main: "#ff5644",
        },
        warning: {
            main: "#fd6757",
        },
        info: {
            main: "#7a7aa5",
        },
        success: {
            main: "#5ab55e",
        },
        background: {
            default: "#edeff1",
            paper: "#f9fafb",
        },
        text: {
            primary: "#6f6f9d",
            secondary: "#e5e7e8",
        },
    },
});


