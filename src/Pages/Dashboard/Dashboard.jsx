import {ChevronLeft, AddCircle, ErrorOutlined} from "@mui/icons-material";
import {AccountCircle, Storefront, Redeem, ShoppingCart} from "@mui/icons-material";
import {Square3Stack3DIcon} from "@heroicons/react/24/outline";
import {Box, Typography, Grid, Button, Card, CardContent} from "@mui/material";
import {NavLink} from "react-router-dom";
import Footer from "../../Components/DesignSystem/Footer.jsx";
import AddCreditModal from "./components/AddCreditModal.jsx";
import {useEffect, useState} from "react";
import api from "../../Components/auth/axiosConfig.js"
import {toast} from "react-toastify";

function Dashboard() {
    const [dashboardData, setDashboardData] = useState({
        customerCount: 0,
        transactionCount: 0,
        charge: 0,
    });

    const fetchDashboardData = async () => {
        try {
            const {data} = await api.get("/Business/for-dashboard");
            setDashboardData(data.Data);

            if (data.Data.charge < 1000000) {
                toast.warn("موجودی پیامک پایین است.", {autoClose: 20000});
            }
        } catch {}
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const refreshTable = () => {
        fetchDashboardData();
    }

    const {customerCount, transactionCount, charge} = dashboardData;

    const data = [
        {icon: <AccountCircle sx={{width: 40, height: 40}}/>, text: "تعداد مشتریان", value: customerCount},
        {icon: <Storefront sx={{width: 40, height: 40}}/>, text: "تعداد پرداخت ها", value: transactionCount},
        {icon: <Redeem sx={{width: 40, height: 40}}/>, text: "تعداد نظرسنجی ها", value: 0},
        {
            icon: <ShoppingCart sx={{width: 40, height: 40}}/>,
            text: "اعتبار سامانه پیامکی",
            value: `${charge} ریال`,
            color: charge < 1000000 ? "red" : "inherit",
        },
    ];

    return (
        <Box>
            <Box sx={{borderTop: 1, borderColor: "grey.500", width: "100%", pb: 6}}>
                <Box sx={{display: "flex", alignItems: "center", mt: 6, gap: 2}}>
                    <Square3Stack3DIcon className={"w-7 h-7 text-Gray"}/>
                    <Typography variant="h6" sx={{fontWeight: "900"}}>
                        داشبورد مدیریتی
                    </Typography>
                </Box>

                <Grid container spacing={4} sx={{mt: 10}}>
                    {data.map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card sx={{
                                p: 4,
                                position: "relative",
                                borderRadius: "16px",
                                boxShadow: 4,
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: '100%',
                            }}>
                                <Box sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    width: 48,
                                    height: 48,
                                    bgcolor: "pink",
                                    borderRadius: "50%",
                                    zIndex: 1
                                }}/>
                                <Box sx={{
                                    position: "absolute",
                                    top: 32,
                                    right: 32,
                                    width: 16,
                                    height: 16,
                                    bgcolor: "pink",
                                    borderRadius: "50%",
                                    zIndex: 2
                                }}/>
                                <Box sx={{display: "flex", flexDirection: "column", gap: 2}}>
                                    {item.icon}
                                    <Typography variant="h5" sx={{fontWeight: 900}}>
                                        {item.value}
                                    </Typography>
                                    <Typography sx={{color: "grey.600", whiteSpace: "nowrap"}}>
                                        {item.text}
                                    </Typography>
                                    {index === 3 && <AddCreditModal refreshTable={refreshTable}/>}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{mx: 10, mt: 20}}>
                    <Box sx={{display: "flex", justifyContent: "space-between"}}>
                        <Typography variant="h6" sx={{fontWeight: "bold"}}>
                            طرح تخفیفی
                        </Typography>
                        <NavLink to="/" style={{
                            textDecoration: "none",
                            color: "red",
                            display: "flex",
                            alignItems: "center"
                        }}>
                            مشاهده همه
                            <ChevronLeft sx={{width: 16, height: 16}}/>
                        </NavLink>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10}}>
                        <Card sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: 5,
                            bgcolor: "white",
                            color: "red",
                            p: 12,
                            boxShadow: 2,
                            borderRadius: "12px",
                        }}>
                            <ErrorOutlined sx={{width: 20, height: 20}}/>
                            <Typography variant="body2" sx={{ml: 1}}>
                                رکوردی برای این قسمت ثبت نشده است
                            </Typography>
                        </Card>
                    </Box>
                </Box>

                <Grid container spacing={6} justifyContent="center" sx={{my: 20}}>
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            position: "relative",
                            borderRadius: "16px",
                            boxShadow: 6,
                            overflow: "hidden",
                        }}>
                            <CardContent sx={{mt: 10}}>
                                <Typography variant="h6" sx={{fontWeight: "extrabold"}}>
                                    مدیریت مشتریان
                                </Typography>
                                <Typography variant="body2" sx={{color: "grey.600", mt: 3}}>
                                    لیستی از نظرات مشتریان رو می‌توانید در این بخش ببینید و باتوجه به نظرات نقاط ضعف
                                    و قوت سامانه خود را بشناسید.
                                </Typography>
                                <Button sx={{
                                    color: "red",
                                    fontSize: "small",
                                    mt: 3,
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    <AddCircle sx={{width: 18, height: 18, mr: 1}}/>
                                    معرفی مشتری
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card sx={{
                            position: "relative",
                            borderRadius: "16px",
                            boxShadow: 6,
                            overflow: "hidden",
                        }}>
                            <CardContent sx={{mt: 10}}>
                                <Typography variant="h6" sx={{fontWeight: "extrabold"}}>
                                    نظرسنجی
                                </Typography>
                                <Typography variant="body2" sx={{color: "grey.600", mt: 3}}>
                                    در این بخش می‌توانید مشتریان فروشگاه خود را تعریف و خریدها، امتیازات و تخفیف های
                                    آیشان را مدیریت کنید
                                </Typography>
                                <Button sx={{
                                    color: "red",
                                    fontSize: "small",
                                    mt: 3,
                                    display: "flex",
                                    alignItems: "center"
                                }}>
                                    <AddCircle sx={{width: 18, height: 18, mr: 1}}/>
                                    افزودن نظرسنجی
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Footer/>
            </Box>
        </Box>
    );
}

export default Dashboard;
