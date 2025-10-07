import {useState} from "react";
import {FaBars} from "react-icons/fa";
import {MdOutlineDashboard} from "react-icons/md";
import {Link, NavLink} from "react-router-dom";
import {
    ChevronLeftIcon,
    BuildingStorefrontIcon,
    BanknotesIcon,
    UsersIcon,
    CurrencyDollarIcon,
    StarIcon,
    ClipboardDocumentListIcon,
    ShareIcon,
    ChatBubbleBottomCenterTextIcon,
    ArchiveBoxIcon
} from "@heroicons/react/24/outline";
import {useLocation} from "react-router-dom";
import {Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton} from '@mui/material';

const menus = [
    {name: "داشبورد", link: "/", icon: <MdOutlineDashboard className={`w-5 h-5 `}/>},
    {name: "مدیریت فروشگاه", link: "/store-manager", icon: <BuildingStorefrontIcon className={`w-5 h-5 `}/>},
    {name: "مدیریت مشتریان", link: "/customers", icon: <UsersIcon className={`w-5 h-5 `}/>},
    {name: "تراکنش و پرداخت ها", link: "/transaction", icon: <BanknotesIcon className={`w-5 h-5 `}/>},
    {name: "طرح های تخفیفی/تشویقی", link: "/plans", icon: <CurrencyDollarIcon className={`w-5 h-5 `}/>},
    {name: "دیتای هوشمند", link: "/data", icon: <ClipboardDocumentListIcon className={`w-5 h-5 `}/>},
    {name: "اشتراک گذاری باشگاه مشتریان", link: "/customer-support", icon: <ShareIcon className={`w-5 h-5 `}/>},
    {name: "سامانه پیامکی", link: "/sms-system", icon: <ChatBubbleBottomCenterTextIcon className={`w-5 h-5 `}/>},
    {name: "صندوق کشبک", link: "/cashback-box", icon: <ArchiveBoxIcon className={`w-5 h-5 `}/>},
];

const Sidebar = ({isDrawerOpen, setIsDrawerOpen}) => {
    const location = useLocation();
    const [open, setOpen] = useState(true);

    const activeIndex = menus.findIndex((menu) => menu.link === location.pathname);

    const closeDrawer = () => setIsDrawerOpen(false);

    return (
        <>
            <Drawer
                open={isDrawerOpen}
                onClose={closeDrawer}
                anchor="left"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        backgroundColor: '#f4f4f4',
                        overflowY: 'auto',
                    },
                }}
            >
                <div className="flex justify-end px-5 mt-5 mb-10">
                    <img src="sanjab.png" alt="logo" className="w-16 p-0 bg-white rounded-lg"/>
                </div>
                <List>
                    {menus.map((item, index) => (
                        <NavLink
                            key={index}
                            to={item.link}
                            onClick={() => {
                                closeDrawer();
                            }}
                            style={{
                                textDecoration: 'none',
                                color: 'inherit',
                            }}
                        >
                            <ListItem
                                button
                                className={`rounded-xl p-3 ${activeIndex === index ? 'bg-lightRed text-Orange' : 'text-Gray hover:bg-lightGray'}`}
                            >
                                <ListItemIcon sx={{minWidth: 40}}>
                                    <div className="bg-white rounded-lg p-1">
                                        {item.icon}
                                    </div>
                                </ListItemIcon>
                                <ListItemText
                                    primary={<p className="mr-2 text-sm">{item.name}</p>}
                                />
                                <IconButton>
                                    <ChevronLeftIcon className="w-5"/>
                                </IconButton>
                            </ListItem>
                        </NavLink>
                    ))}
                </List>
            </Drawer>
            <section className="bg-primaryGray z-40 hidden 2xl:flex relative">
                <div className={`relative ${open ? "w-72" : "w-[4.5rem]"} duration-200`}>
                    <div
                        className={`fixed top-0 bottom-0 right-0 px-5 overflow-y-auto no-scrollbar ${open ? "w-66" : "w-fit"} max-h-screen`}>
                        <div className="py-3 flex">
                            <FaBars size={26} className="cursor-pointer" onClick={() => setOpen(!open)}/>
                        </div>
                        <div
                            className={`${open ? "mt-5 mb-10 p-5 flex w-full justify-start bg-lightWhite rounded-3xl" : "hidden"}`}>
                            <img src="sanjab.png" alt="logo" className="w-16 p-0 bg-white rounded-lg"/>
                        </div>
                        <ul className="flex flex-col mt-5">
                            {menus.map((menu, i) => (
                                <Link
                                    to={menu.link}
                                    key={i}
                                    className={`${menu.margin && "mt-5"} group`}
                                >
                                    <li className={`
                            ${open ? "my-1 px-6 py-5 mx-0 flex justify-between hover:bg-lightGray" : "flex px-0 m-0 py-5 hover:bg-inherit"}
                            ${activeIndex === i ? (open ? "text-Orange !bg-lightRed" : "text-Orange") : "text-Gray"}
                            text-sm rounded-xl p-3`}>
                                        <div className="flex items-center">
                                            <div className="bg-white rounded-lg p-1">
                                                {menu.icon}
                                            </div>
                                            <h2 className={`mr-2 ${open ? "" : "hidden"}`}>
                                                {menu.name}
                                            </h2>
                                        </div>
                                        <h2 className={`duration-50 flex ${!open && "hidden"}`}>
                                            <ChevronLeftIcon className="w-5"/>
                                        </h2>
                                    </li>
                                </Link>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Sidebar;