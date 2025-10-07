import {useRef, useState, useEffect} from "react";
import PageHeaders from "../../Components/common/PageHeaders.jsx";
import {Storefront as StorefrontIcon} from "@mui/icons-material";
import DataTable from "../../Components/common/DataTable.jsx";
import AssignCardModal from "../customer-management/components/AssignCardModal.jsx";
import {
    Box,
    Typography,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    Checkbox,
    FormControlLabel, DialogActions, CircularProgress, Pagination
} from "@mui/material";
import {useParams} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import {toast} from "react-toastify";
import api from "../../Components/auth/axiosConfig.js"
import {HttpStatusCode} from "axios";

const HandleAccept = async (e, shareBusinessId, accept) => {
    e.stopPropagation();
    await api.post("/share-customer-club/check", {shareBusinessId, accept});
}
const columns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "originalBusinessTitle",
        header: "عنوان کار",
        cell: ({row}) => row.getValue("originalBusinessTitle"),
    },
    {
        accessorKey: "targetBusinessTitle",
        header: "عنوان درخواست",
        cell: ({row}) => row.getValue("targetBusinessTitle"),
    },
    {
        accessorKey: "eventTitle",
        header: "عنوان طرح",
        cell: ({row}) => {
            const eventTitle = row.getValue("eventTitle");

            const eventTitleMap = {
                "Message": "پیام",
            };

            return eventTitleMap[eventTitle] || "نامشخص";
        },
    },
    {
        accessorKey: "message",
        header: "پیام",
        cell: ({row}) => row.getValue("message"),
    },
    {
        accessorKey: "status",
        header: "وضعیت",
        cell: ({row}) => {
            const status = row.getValue("status");
            const statusMap = {
                "PendingOnBusinessApproval": "منتظر تایید کسب و کار",
                "PendingOnAdminApproval": "منتظر تایید مدیریت",
                "Accepted": "پذیرفته شده",
                "Sent": "ارسال شده",
                "RejectedByBusiness": "رد شده توسط کسب و کار",
                "RejectedByAdmin": "رد شده توسط مدیریت",
            };

            return statusMap[status] || "نامشخص";
        },
    },
    {
        accessorKey: "type",
        header: "نوع",
        cell: ({row}) => {
            const type = row.getValue("type");

            const typeMap = {
                "Message": "پیام",
                "Cashback": "کش بک",
                "CreditEvent": "طرح اعتباری",
            };

            return typeMap[type] || "نامشخص";
        },
    },
    {
        accessorKey: "actions",
        header: "عملیات",
        cell: ({row}) => {
            const status = row.getValue("status");

            if (status !== "PendingOnBusinessApproval") return null;

            return (
                <div className="flex flex-col gap-2 justify-end">
                    <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        onClick={(e) => HandleAccept(e, row.original.id, true)}
                    >
                        تایید
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={(e) => HandleAccept(e, row.original.id, false)}
                    >
                        رد
                    </Button>
                </div>
            );
        },
    }
];
const columns2 = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "originalBusinessTitle",
        header: "عنوان کار",
        cell: ({row}) => row.getValue("originalBusinessTitle"),
    },
    {
        accessorKey: "targetBusinessTitle",
        header: "عنوان درخواست",
        cell: ({row}) => row.getValue("targetBusinessTitle"),
    },
    {
        accessorKey: "eventTitle",
        header: "عنوان طرح",
        cell: ({row}) => {
            const eventTitle = row.getValue("eventTitle");

            const eventTitleMap = {
                "Message": "پیام",
            };

            return eventTitleMap[eventTitle] || "نامشخص";
        },
    },
    {
        accessorKey: "totalPrice",
        header: "قیمت",
        cell: ({row}) => {
            const value = row.getValue("totalPrice");
            return new Intl.NumberFormat("fa-IR").format(value);
        }
    },
    {
        accessorKey: "message",
        header: "پیام",
        cell: ({row}) => row.getValue("message"),
    },
    {
        accessorKey: "status",
        header: "وضعیت",
        cell: ({row}) => {
            const status = row.getValue("status");

            const statusMap = {
                "PendingOnBusinessApproval": "منتظر تایید کسب و کار",
                "PendingOnAdminApproval": "منتظر تایید مدیریت",
                "Accepted": "پذیرفته شده",
                "Sent": "ارسال شده",
                "RejectedByBusiness": "رد شده توسط کسب و کار",
                "RejectedByAdmin": "رد شده توسط مدیریت",
            };

            return statusMap[status] || "نامشخص";
        },
    },
    {
        accessorKey: "type",
        header: "نوع",
        cell: ({row}) => {
            const type = row.getValue("type");

            const typeMap = {
                "Message": "پیام",
                "Cashback": "کش بک",
                "CreditEvent": "طرح اعتباری",
            };

            return typeMap[type] || "نامشخص";
        },
    },
];

function CustomerClub() {
    const [activeTab, setActiveTab] = useState("Sent Requests");
    const [visibleBusinesses, setVisibleBusinesses] = useState([]);
    const [setData] = useState([]);
    const [customerClubsFalse, setCustomerClubsFalse] = useState([]);
    const [customerClubsTrue, setCustomerClubsTrue] = useState([]);
    const assignCardModalRef = useRef();
    const [creditPlans, setCreditPlans] = useState([]);
    const [selectCategories, setSelectCategories] = useState("");
    const [selectTargetBusinessId, setSelectTargetBusinessId] = useState("");
    const [requestType, setRequestType] = useState("");
    const [message, setMessage] = useState("");
    const [numberOfCustomers, setNumberOfCustomers] = useState("");
    const [eventId, setEventId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(1);

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageIndex(1);
    };

    const handleChange = (event) => {
        setRequestType(event.target.value);
    };

    const ChangeTab = (activeTab) => {
        setActiveTab(activeTab);
    };

    const handleModalClose = () => {
        setSelectCategories("");
        setSelectTargetBusinessId("");
        setRequestType("");
        setEventId(null);
        setMessage("");
        setNumberOfCustomers("");

        setOpenModal(false);
    };

    const fetchCreditPlans = async () => {
        const {data} = await api.get("/credit-event");
        setCreditPlans(data.Data.items);
    }

    const fetchCustomerClub = async (IsSend, PageSize, PageIndex) => {
        const {data} = await api.get(`/share-customer-club?IsSends=${IsSend}&PageSize=${PageSize}&PageIndex=${PageIndex}`);
        const result = data.Data.result;
        if (IsSend === "true") {
            setCustomerClubsTrue(result.items);
        } else {
            setCustomerClubsFalse(result.items);
        }
        setTotalCount(data.Data.result.totalCount);
    }

    const fetchAllVisibleBusinesses = async (categoryId) => {
        const {data} = await api.get(`/share-customer-club/visibles?categoryId=${categoryId}`);
        setVisibleBusinesses(data.Data.visibleBusinesses);
    }

    const createCustomerClub = async (data) => {
        await api.post("/share-customer-club", data);
        await fetchCustomerClub("true", 20, 1);
    };

    const handleSubmit = async () => {
        const payload = {
            targetBusinessId: selectTargetBusinessId,
            numberOfCustomers: numberOfCustomers,
            message: message,
            type: requestType,
            eventId: eventId,
        };
        setModalLoading(true);
        try {
            const response = await createCustomerClub(payload);
            if (response.status === 200) {
                toast.success("درخواست ارسال پیام با موفقیت اضافه شد.");
            }
        } finally {
            setModalLoading(false)
        }
        handleModalClose();
    };


    const {id} = useParams();

    useEffect(() => {
        fetchCreditPlans()
        fetchCustomerClub(activeTab === "Sent Requests" ? "true" : "false", pageSize, pageIndex);
    }, [id, activeTab, pageSize, pageIndex]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const categoryResponse = await api.get('/Category/dropdown');
                setCategories(categoryResponse.data.Data.categories);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const dataTrue = customerClubsTrue.map((item, index) => ({
        id: item.id,
        rowNumber: index + 1,
        originalBusinessTitle: item.originalBusinessTitle,
        totalPrice: item.totalPrice,
        targetBusinessTitle: item.targetBusinessTitle,
        eventTitle: item.eventTitle,
        message: item.message,
        status: item.status,
        type: item.type
    }));

    const dataFalse = customerClubsFalse.map((item, index) => ({
        id: item.id,
        rowNumber: index + 1,
        originalBusinessTitle: item.originalBusinessTitle,
        totalPrice: item.totalPrice,
        targetBusinessTitle: item.targetBusinessTitle,
        eventTitle: item.eventTitle,
        message: item.message,
        status: item.status,
        type: item.type
    }))

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <Box className="bg-lightWhite min-h-screen">
            <PageHeaders current="اشتراک‌گذاری باشگاه مشتریان"/>

            <Box className="border-t border-Gray">
                <Box dir="rtl" display="flex" alignItems="center" justifyContent="space-between" mt={5}>
                    <Box display="flex" alignItems="center">
                        <StorefrontIcon sx={{width: 28, height: 28, ml: 2, color: "gray"}}/>
                        <Typography variant="h6" fontWeight="bold" ml={2}>اشتراک‌گذاری باشگاه مشتریان</Typography>
                    </Box>
                    <Box display="flex" className={"flex-col md:flex-row"} gap={2}>
                        {activeTab === "Sent Requests" && (
                            <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                onClick={() => setOpenModal(true)}
                                startIcon={<AddIcon/>}
                            >
                                درخواست ارسال پیام
                            </Button>
                        )}
                    </Box>

                </Box>

                <Box display="flex" alignItems="center" justifyContent="space-between" mt={5}>
                    <Typography variant="h6" fontWeight="bold" ml={2}>لیست درخواست ها</Typography>
                    <Box display="flex" alignItems="center" borderRadius="10px" bgcolor="lightGray" p={1}>
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "none",
                                backgroundColor: activeTab === "Sent Requests" ? "white" : "lightGray",
                                color: activeTab === "Sent Requests" ? "black" : "gray",
                                borderRadius: "10px",
                                mx: 1, // Add spacing between buttons
                                "&:hover": {
                                    backgroundColor: activeTab === "Sent Requests" ? "#f0f0f0" : "#e0e0e0", // Hover effect
                                },
                            }}
                            onClick={() => ChangeTab("Sent Requests")}
                        >
                            درخواست های ارسالی
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "none",
                                backgroundColor: activeTab === "Received Requests" ? "white" : "lightGray",
                                color: activeTab === "Received Requests" ? "black" : "gray",
                                borderRadius: "10px",
                                "&:hover": {
                                    backgroundColor: activeTab === "Received Requests" ? "#f0f0f0" : "#e0e0e0", // Hover effect
                                },
                            }}
                            onClick={() => ChangeTab("Received Requests")}
                        >
                            درخواست های دریافتی
                        </Button>
                    </Box>
                </Box>

                <Box display="flex" py={5} justifyContent="space-between">
                    {activeTab === "Sent Requests" ? (
                        <Box
                            display="flex"
                            bgcolor="white"
                            flexDirection="column"
                            borderRadius="1rem"
                            p={5}
                            className={"min-w-full"}
                        >
                            {loading ? (
                                <CircularProgress/>
                            ) : (
                                <>
                                    <DataTable data={dataTrue} columns={columns2}/>
                                    <AssignCardModal ref={assignCardModalRef} customerId={setData?.id}/>
                                    {(!dataTrue || dataTrue.length === 0) && (
                                        <Box mt={2} display="flex" justifyContent="center" alignItems="center"
                                             width="100%">
                                            <Typography variant="h6" color="textPrimary">
                                                داده‌ای یافت نشد
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box mt={2} display="flex" alignItems="center">
                                        <FormControl size="small" variant="outlined">
                                            <InputLabel>تعداد در هر صفحه</InputLabel>
                                            <Select
                                                value={pageSize}
                                                onChange={handlePageSizeChange}
                                                label="تعداد در هر صفحه"
                                            >
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={20}>20</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Pagination
                                            count={totalPages}
                                            page={pageIndex}
                                            onChange={handlePageChange}
                                            color="primary"
                                            sx={{marginLeft: "10px"}}
                                        />
                                    </Box>
                                </>
                            )}

                        </Box>
                    ) : (
                        <Box
                            display="flex"
                            flexDirection="column"
                            bgcolor="white"
                            borderRadius="1rem"
                            p={5}
                            className={"min-w-full"}
                        >
                            {loading ? (
                                <CircularProgress/>
                            ) : (
                                <>
                                    <DataTable data={dataFalse} columns={columns}/>
                                    <AssignCardModal ref={assignCardModalRef} customerId={setData?.id}/>
                                    {(!dataFalse || dataFalse.length === 0) && (
                                        <Box mt={2} display="flex" justifyContent="center"
                                             alignItems="center"
                                             width="100%">
                                            <Typography variant="h6" color="textPrimary">
                                                داده‌ای یافت نشد
                                            </Typography>
                                        </Box>
                                    )}
                                    <Box mt={2} display="flex" alignItems="center">
                                        <FormControl size="small" variant="outlined">
                                            <InputLabel>تعداد در هر صفحه</InputLabel>
                                            <Select
                                                value={pageSize}
                                                onChange={handlePageSizeChange}
                                                label="تعداد در هر صفحه"
                                            >
                                                <MenuItem value={5}>5</MenuItem>
                                                <MenuItem value={10}>10</MenuItem>
                                                <MenuItem value={20}>20</MenuItem>
                                                <MenuItem value={100}>100</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <Pagination
                                            count={totalPages}
                                            page={pageIndex}
                                            onChange={handlePageChange}
                                            color="primary"
                                            sx={{marginLeft: "10px"}}
                                        />
                                    </Box>
                                </>
                            )}
                        </Box>
                    )}
                    <Dialog
                        open={openModal}
                        onClose={handleModalClose}
                        fullWidth
                        maxWidth="md"
                        sx={{
                            '& .MuiDialog-paper': {
                                width: '80%',
                                maxWidth: '100%',
                                margin: 'auto',
                                padding: 2,
                            }
                        }}>
                        <Box className="flex flex-col">
                            <Typography variant="h7" fontWeight="bold">درخواست ارسال پیام</Typography>
                            <Box className="bg-white w-full h-full rounded-xl p-5 flex flex-col gap-5">
                                <FormControl fullWidth>
                                    <InputLabel>دستبندی درخواست</InputLabel>
                                    <Select value={selectCategories}
                                            onChange={(event) => {
                                                setSelectCategories(event.target.value)
                                                fetchAllVisibleBusinesses(event.target.value)
                                            }
                                            }>
                                        {categories.map((c) => (
                                            <MenuItem key={c.id} value={c.id}>
                                                {c.title}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <FormControl fullWidth>
                                    <InputLabel>مجموعه درخواست</InputLabel>
                                    <Select
                                        value={selectTargetBusinessId}
                                        onChange={(event) => setSelectTargetBusinessId(event.target.value)}
                                        displayEmpty
                                    >
                                        {visibleBusinesses.length > 0 ? (
                                            visibleBusinesses.map((c) => (
                                                <MenuItem key={c.id} value={c.id}>
                                                    {c.businessName}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled>
                                                هیچ کسب‌وکاری یافت نشد
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>


                                <FormControl fullWidth>
                                    <InputLabel>نوع درخواست</InputLabel>
                                    <Select value={requestType} onChange={handleChange}>
                                        <MenuItem value="message">پیام</MenuItem>
                                        <MenuItem value="creditevent">طرح اعتباری</MenuItem>
                                    </Select>
                                </FormControl>

                                {requestType === "creditevent" && (
                                    <FormControl fullWidth>
                                        <InputLabel>طرح اعتباری</InputLabel>
                                        <Select
                                            value={eventId}
                                            onChange={(e) => setEventId(e.target.value)}
                                        >
                                            {creditPlans.map((c) => (
                                                <MenuItem key={c.id} value={c.id}>
                                                    {c.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}

                                <TextField
                                    label="متن پیام"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    fullWidth
                                    multiline
                                    rows={4}
                                    variant="outlined"
                                />

                                <Typography variant="body2" color="textPrimary">
                                    پیام برای از چه شماره‌ای تا چه شماره‌ای ارسال شود.
                                </Typography>
                                <Box className="flex flex-col sm:flex-row gap-2 sm:gap-5">
                                    <TextField
                                        label="تعداد"
                                        value={numberOfCustomers}
                                        onChange={(e) => setNumberOfCustomers(e.target.value)}
                                        fullWidth
                                    />
                                </Box>

                                <Typography variant="body2" color="textPrimary">
                                    پیام در چه بستری منتشر شود:
                                </Typography>
                                <Box className="flex flex-wrap gap-2 sm:gap-5">
                                    <FormControlLabel
                                        control={<Checkbox checked disabled/>}
                                        label="پیام کوتاه"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox disabled/>}
                                        label="نوتیفیکیشن"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox disabled/>}
                                        label="اپلیکیشن"
                                    />
                                </Box>

                                <Button
                                    variant="contained"
                                    color="error"
                                    loading={modalLoading}
                                    sx={{py: 1.5, borderRadius: "1rem", fontWeight: "bold"}}
                                    onClick={handleSubmit}
                                >
                                    {modalLoading ? (
                                        <CircularProgress/>
                                    ) : (
                                        "ارسال درخواست"
                                    )}
                                </Button>
                            </Box>
                            <DialogActions>
                                <Button onClick={() => setOpenModal(false)} color="primary">
                                    بستن
                                </Button>
                            </DialogActions>
                        </Box>
                    </Dialog>
                </Box>
            </Box>
        </Box>
    );
}

export default CustomerClub;
