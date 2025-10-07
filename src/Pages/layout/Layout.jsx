import {Outlet} from "react-router-dom";
import {IconButton} from "@material-tailwind/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import Header from "../../Components/layout/Header";
import Sidebar from "../../Components/layout/Sidebar";
import {useState} from "react";

const Layout = () => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const openDrawer = () => setIsDrawerOpen(true);

    return (
        <>
            <div className="flex">
                <Sidebar isDrawerOpen={isDrawerOpen} setIsDrawerOpen={setIsDrawerOpen}/>
                <div className="flex flex-col relative w-full">
                    <div className="fixed z-50 right-20 top-6 2xl:hidden mr-4">
                        <IconButton variant="text" size="lg"
                                    onClick={openDrawer}
                        >
                            {isDrawerOpen ? (
                                <XMarkIcon className="h-8 w-8 stroke-2"/>

                            ) : (
                                <Bars3Icon className="h-8 w-8 stroke-2"/>
                            )}
                        </IconButton>
                    </div>
                    <Header/>
                    <div className="mt-28 2xl:mt-0 px-10 pb-10 w-full min-h-screen">
                        <Outlet/>
                    </div>
                </div>
            </div>

        </>
    )
        ;
}

export default Layout;
