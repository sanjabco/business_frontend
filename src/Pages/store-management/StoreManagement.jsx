import {Storefront as StorefrontIcon} from "@mui/icons-material";
import {useState} from "react";
import PageHeaders from "../../Components/common/PageHeaders";
import {Box, Tab, Tabs, Typography} from "@mui/material";
import BusinessInfo from "./BusinessInfo";
import BranchManagement from "./BranchManagement";

const data = [
    {
        label: "اطلاعات فروشگاه",
        value: "businessInfo",
        component: <BusinessInfo/>
    },
    {
        label: "مدیریت بخش ها",
        value: "branchManagement",
        component: <BranchManagement/>
    },
];

const StoreManagement = () => {
    const [type, setType] = useState("businessInfo");

    const handleTabChange = (event, newValue) => {
        setType(newValue);
    };

    return (
        <>
            <div className="bg-lightWhite min-h-screen min-w-full">
                <PageHeaders current="مدیریت فروشگاه"/>
                <Box sx={{borderTop: 1, borderColor: "grey.400", pt: 2}}>
                    <Box sx={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: 3, mb: 2}}>
                        <Box sx={{display: "flex", alignItems: "center"}}>
                            <StorefrontIcon sx={{width: 28, height: 28, color: "gray"}}/>
                            <Typography variant="h6" sx={{fontWeight: "bold", ml: 1}}>
                                مدیریت فروشگاه
                            </Typography>
                        </Box>
                        <Tabs
                            value={type}
                            onChange={handleTabChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            sx={{
                                backgroundColor: "lightGray",
                                borderRadius: "50px",
                                padding: {xs: "4px 10px", sm: "6px 20px"},
                                '& .MuiTabs-indicator': {
                                    display: 'none',
                                },
                                overflowX: "auto",
                            }}
                        >
                            {data.map(({label, value}) => (
                                <Tab
                                    key={value}
                                    value={value}
                                    label={label}
                                    sx={{
                                        textTransform: "none",
                                        fontSize: {xs: "12px", sm: "14px"},
                                        fontWeight: "500",
                                        color: "gray",
                                        backgroundColor: value === type ? "white" : "transparent",
                                        borderRadius: "50px",
                                        '&.Mui-selected': {
                                            color: "black",
                                            backgroundColor: "white",
                                        },
                                        minWidth: 0,
                                        padding: {xs: "4px 8px", sm: "6px 12px"},
                                        transition: "background-color 0.3s ease",
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>

                    <Box sx={{marginTop: 2}}>
                        {data.map(({value, component}) => (
                            <Box
                                key={value}
                                sx={{
                                    display: value === type ? "block" : "none",
                                    transition: "transform 0.3s ease",
                                }}
                            >
                                {component}
                            </Box>
                        ))}
                    </Box>
                </Box>
            </div>
        </>
    );
};

export default StoreManagement;
