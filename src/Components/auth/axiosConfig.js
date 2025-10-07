import axios from "axios";
import {deleteCookie, getCookie} from "../../helper/index.js";
import {toast} from "react-toastify";

let redirecting = false;

const api = axios.create({
    baseURL: import.meta.env.VITE_SANJAB_API_URL + "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token =
            document.cookie.split("; ").find((row) => row.startsWith("jwt="))?.split("=")[1] ||
            localStorage.getItem("jwt") ||
            getCookie("jwt");

        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
        const {Code, Message} = response.data;

        if (Code === 200 || typeof Code === "undefined") {
            return response;
        }

        if (Code === 401 || Code === 403) {
            if (!redirecting) {
                redirecting = true;
                deleteCookie("jwt");
                toast.error(Message || "دسترسی غیرمجاز", {autoClose: 3000});
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            }
            return Promise.reject(response.data);
        }

        if (Code >= 400 && Code < 500) {
            toast.warning(Message, {autoClose: 3000});
        } else if (Code >= 500) {
            toast.error(Message, {autoClose: 3000});
        }

        return Promise.reject(response.data);
    },
    (error) => {
        if (error.code === "ERR_NETWORK") {
            toast.error("دسترسی به اینترنت شما قطع شده است.", {autoClose: 3000});
            return Promise.reject(error);
        }
    }
);

export default api;
