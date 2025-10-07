import {NavLink, useNavigate} from "react-router-dom";
import {
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Avatar,
} from "@material-tailwind/react";
import api from "../../Components/auth/axiosConfig.js"
import {deleteCookie} from "../../helper";
import {toast} from "react-toastify";

const Header = () => {

    const navigate = useNavigate();

    const handleLogout = async () => {
        await api.post("/Otp/logout");
        deleteCookie("jwt");
        toast.success("با موفقیت خارج شدید")
        navigate("/login");
    }

    return (
        <>
            <header className="relative left-0 top-0 right-0">
                <div className="flex py-5 px-5 xl:px-10 justify-between fixed 2xl:relative bg-white w-full z-40">
                    <img src="sanjab.png" alt="logo" className="w-[3rem]"/>
                    <div>
                        <Menu placement="bottom-start">
                            <MenuHandler>
                                <Avatar
                                    variant="circular"
                                    alt="pfp"
                                    className="cursor-pointer bg-lightRed"
                                    src="sanjab.png"
                                />
                            </MenuHandler>
                            <MenuList>
                                <hr className="my-2 border-blue-gray-50 hover:border-none"/>
                                <NavLink to={"profile"} className={"border-none outline-none"}>
                                    <MenuItem className="flex items-center justify-center gap-2">
                                        پروفایل من
                                    </MenuItem>
                                </NavLink>
                                <hr className="my-2 border-blue-gray-50 hover:border-none"/>
                                <div onClick={handleLogout} className={"border-none outline-none"}>
                                    <MenuItem
                                        className="flex items-center justify-center gap-2 text-Red hover:text-Red hover:bg-lightRed">
                                        خروج
                                    </MenuItem>
                                </div>
                            </MenuList>
                        </Menu>
                    </div>
                </div>
            </header>
        </>
    );
}

export default Header;
