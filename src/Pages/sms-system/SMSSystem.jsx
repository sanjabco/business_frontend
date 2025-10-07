import {useRef, useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import {toast} from "react-toastify";
import api from "../../Components/auth/axiosConfig.js"
import PageHeaders from "../../Components/common/PageHeaders.jsx";
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
    FormControlLabel,
    DialogActions,
    CircularProgress,
    Grid, Pagination, Alert, OutlinedInput, IconButton,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import MessageIcon from "@mui/icons-material/Message";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import ErrorIcon from "@mui/icons-material/Error";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import InfoIcon from "@mui/icons-material/Info";
import {Storefront as StorefrontIcon, Add as AddIcon, Clear} from "@mui/icons-material";
import {RiFileExcel2Fill} from "react-icons/ri";

import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import dayjs from "dayjs";
import jalaliday from "jalaliday";

dayjs.extend(jalaliday);


const convertFarsiToEnglishDigits = (persianString) => {
    const persianDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    return persianString
        .split("")
        .map((char) => {
            const index = persianDigits.indexOf(char);
            return index !== -1 ? englishDigits[index] : char;
        })
        .join("");
};

const statusMap = {
    "PendingOnBusinessApproval": "منتظر تایید کسب و کار",
    "PendingOnAdminApproval": "منتظر تایید مدیریت",
    "Accepted": "پذیرفته شده",
    "Confirmed": "پذیرفته شده",
    "Sent": "ارسال شده",
    "RejectedByBusiness": "رد شده توسط کسب و کار",
    "RejectedByAdmin": "رد شده توسط مدیریت",
    "Queue": "در صف",
};

const typeMap = {
    "Message": "پیام",
    "Messages": "پیام",
    "Cashback": "کش بک",
    "CashBack": "کش بک",
    "CreditEvent": "طرح اعتباری",
};

const SMScolumns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "type",
        header: "نوع",
        cell: ({row}) => {
            const type = row.getValue("type");
            return typeMap[type] || "نامشخص";
        },
    },
    {accessorKey: "totalPrice", header: "قیمت"},
    {accessorKey: "date", header: "تاریخ"},
    {accessorKey: "numberOfMessages", header: "مقدار پیام ها"},
    {accessorKey: "numberOfSent", header: "تعداد ارسالی "},
    {accessorKey: "numberInQueue", header: "تعداد در صف"},
    {accessorKey: "numberFailed", header: "تعداد نرسیده"},
    {
        accessorKey: "internalMessageStatus",
        header: "وضعیت پیام",
        cell: ({row}) => {
            const status = row.getValue("internalMessageStatus");
            return statusMap[status] || "نامشخص";
        },
    },
];

const ChargesColumns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {accessorKey: "creationDate", header: "تاریخ ایجاد"},
    {
        accessorKey: "amount", header: "قیمت",
        cell: ({row}) => {
            const value = row.getValue("amount");
            return new Intl.NumberFormat("fa-IR").format(value);
        }
    },
];

const selfMessagesColumns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "type", header: "نوع", cell: ({row}) => {
            const type = row.getValue("type");
            return typeMap[type] || "نامشخص";
        },
    },
    {accessorKey: "date", header: "تاریخ"},
    {accessorKey: "totalPrice", header: "قیمت"},
    {
        accessorKey: "status", header: "وضعیت پیام", cell: ({row}) => {
            const status = row.getValue("status");
            return statusMap[status] || "نامشخص";
        },
    },
];
const shareClubsColumns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "targetBusinessTitle", header: "نام کسب و کار"
    },
    {
        accessorKey: "type", header: "نوع", cell: ({row}) => {
            const type = row.getValue("type");
            return typeMap[type] || "نامشخص";
        },
    },
    {accessorKey: "numberOfCustomers", header: "تعداد مشتریان"},
    {
        accessorKey: "evenTitle",
        header: "نام پلن",
        cell: ({row}) => {
            const type = row.getValue("evenTitle");
            return typeMap[type] || "نامشخص";
        },
    },
    {accessorKey: "date", header: "تاریخ"},
    {accessorKey: "totalPrice", header: "قیمت"},
    {
        accessorKey: "status", header: "وضعیت پیام", cell: ({row}) => {
            const status = row.getValue("status");
            return statusMap[status] || "نامشخص";
        },
    },
];
const smartDataRequestsColumns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "smartDataName", header: "نام دیتای هوشمند"
    },
    {
        accessorKey: "type", header: "نوع", cell: ({row}) => {
            const type = row.getValue("type");
            return typeMap[type] || "نامشخص";
        },
    },
    {accessorKey: "from", header: "از"},
    {accessorKey: "to", header: "تا"},
    {accessorKey: "date", header: "تاریخ"},
    {accessorKey: "totalPrice", header: "قیمت"},
    {
        accessorKey: "status", header: "وضعیت پیام", cell: ({row}) => {
            const status = row.getValue("status");
            return statusMap[status] || "نامشخص";
        },
    },
];


function SMSSystem() {
    const [activeTab, setActiveTab] = useState("Sent Requests");
    const [setData] = useState([]);
    const [sms, setSms] = useState([]);
    const [cards, setCards] = useState(null);
    const [charges, setCharges] = useState([]);
    const [selfMessages, setSelfMessages] = useState([]);
    const [shareClubs, setShareClubs] = useState([]);
    const [smartDataRequests, setSmartDataRequests] = useState([]);
    const [creditPlans, setCreditPlans] = useState([]);
    const [requestType, setRequestType] = useState("");
    const [messageType, setMessageType] = useState("");
    const [message, setMessage] = useState("");
    const [eventId, setEventId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const assignCardModalRef = useRef();
    const [lines, setLines] = useState([]);
    const [branches, setBranches] = useState([]);
    const [branchId, setBranchId] = useState("");
    const [lineId, setLineId] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const {id} = useParams();
    const [fromDate, setFromDate] = useState(dayjs().calendar("jalali").startOf("day"));
    const [toDate, setToDate] = useState(dayjs().calendar("jalali").startOf("day"));
    const [fromDateCards, setFromDateCards] = useState(dayjs().calendar("jalali").startOf("day"));
    const [toDateCards, setToDateCards] = useState(dayjs().calendar("jalali").startOf("day"));
    const [recipientCount, setRecipientCount] = useState(null);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const resetFormData = () => {
        setRequestType("");
        setEventId("");
        setMessage("");
        setMessageType("");
        setSelectedFile(null);
        setBranchId("");
        setLineId("");
        setLines([]);
    };

    const handleFromChange = (newDate) => {
        setFromDate(newDate);
    };

    const handleToChange = (newDate) => {
        setToDate(newDate);
    };

    const handleFromCardsChange = (newDate) => {
        setFromDateCards(newDate);
    };

    const handleToChangeCards = (newDate) => {
        setToDateCards(newDate);
    };

    const handleDownloadTemplate = () => {
        const fileUrl = "/assets/SampleMobileList.xlsx";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "SampleMobileList.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const fetchBranches = async () => {
        const {data} = await api.get("/branch");
        setBranches(data.Data.branches);
    };

    const fetchRecipientCount = async (branchId, lineId) => {
        const params = {
            branchId, lineId
        };

        const {data} = await api.get("/Sms/customer-count", {params});

        setRecipientCount(data.Data.customerCount);
    };

    useEffect(() => {
        fetchRecipientCount(branchId, lineId);
    }, [branchId, lineId]);

    const fetchSMSRequests = async () => {
        setLoading(true)
        const {data} = await api.get("/Sms/requests");
        setSelfMessages(data.Data.selfMessages)
        setShareClubs(data.Data.shareClubs)
        setSmartDataRequests(data.Data.smartDataRequests)
        setLoading(false)
    }

    const handlePageChange = (event, value) => {
        setPageIndex(value);
    };

    const handlePageSizeChange = (event) => {
        setPageSize(event.target.value);
        setPageIndex(1);
    };

    const handleBranchChange = (branchId) => {
        setBranchId(branchId);
        const selectedBranch = branches.find((branch) => branch.id === branchId);
        setLines(selectedBranch ? selectedBranch.lines : []);
        setLineId("");
    };

    const fetchCreditPlans = async () => {
        const {data} = await api.get("/credit-event");
        setCreditPlans(data.Data.items);
    };
    const fetchSMS = async (PageSize, PageIndex) => {
        if (fromDate && toDate) {
            setLoading(true)
            try {
                const {data} = await api.get(`/Sms?PageSize=${PageSize}&PageIndex=${PageIndex}`, {
                    params: {
                        from: convertFarsiToEnglishDigits(fromDate.format("YYYY/MM/DD")),
                        to: convertFarsiToEnglishDigits(toDate.format("YYYY/MM/DD")),
                    },
                });
                setSms(data.Data.items);
                setTotalCount(data.Data.totalCount);
            } finally {
                setLoading(false);
            }
        }
    };

    const fetchCards = async () => {
        if (fromDateCards && toDateCards) {
            setLoading(true)
            try {
                const {data} = await api.get(`/Sms/transactions-summary`, {
                    params: {
                        from: convertFarsiToEnglishDigits(fromDateCards.format("YYYY/MM/DD")),
                        to: convertFarsiToEnglishDigits(toDateCards.format("YYYY/MM/DD")),
                    },
                });
                setCards(data.Data);
            } finally {
                setLoading(false);
            }
        }
    }

    const fetchCharges = async (PageSize, PageIndex) => {
        setLoading(true)
        try {
            const {data} = await api.get(`/Payment?PageSize=${PageSize}&PageIndex=${PageIndex}`);
            setCharges(data.Data.items);
            setTotalCount(data.Data.totalCount);
        } finally {
            setLoading(false)
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            if (messageType === "customerMessage") {
                const data = {
                    message,
                    type: requestType === "creditevent" ? "CreditEvent" : "Message",
                };

                if (branchId) data.branchId = branchId;
                if (lineId) data.lineId = lineId;
                if (eventId) data.EventId = eventId;

                await api.post("/Sms", data);
            } else if (messageType === "file") {
                const formData = new FormData();
                formData.append("message", message);
                formData.append("type", requestType === "creditevent" ? "CreditEvent" : "Message");

                if (branchId) formData.append("branchId", branchId);
                if (lineId) formData.append("lineId", lineId);
                if (eventId) formData.append("EventId", eventId);
                formData.append("ExcelFile", selectedFile);

                await api.post("/Sms/excel", formData);
            }

            await fetchSMS(1, 10);
            toast.success("درخواست پیام با موفقیت ارسال شد.");
            setOpenModal(false);
            resetFormData();
        } finally {
            setLoading(false);
        }
    };

    const ChangeTab = async (activeTab) => {
        setActiveTab(activeTab);
    };

    useEffect(() => {
        fetchCharges(10, 1);
        fetchSMSRequests();
        fetchBranches();
        fetchCreditPlans();
    }, [id]);

    useEffect(() => {
        if (fromDateCards && toDateCards) {
            fetchCards();
        }
    }, [fromDateCards, toDateCards]);

    useEffect(() => {
        if (fromDate && toDate) {
            fetchSMS(10, 1);
        }
    }, [fromDate, toDate]);


    const dataSMS = sms.map((item, index) => ({
        rowNumber: index + 1,
        numberOfMessages: item.numberOfMessages,
        type: item.type,
        date: item.date,
        numberOfSent: item.numberOfSent,
        totalPrice: item.totalPrice,
        numberInQueue: item.numberInQueue,
        numberFailed: item.numberFailed,
        internalMessageStatus: item.internalMessageStatus,
    }));

    const dataCharges = charges.map((item, index) => ({
        rowNumber: index + 1,
        amount: item.amount,
        creationDate: item.creationDate,
    }));

    const dataSelfMessages = selfMessages.map((item, index) => ({
        rowNumber: index + 1,
        totalPrice: item.totalPrice,
        type: item.type,
        date: item.date,
        status: item.status,
    }))

    const dataShareClubs = shareClubs.map((item, index) => ({
        rowNumber: index + 1,
        targetBusinessTitle: item.targetBusinessTitle,
        totalPrice: item.totalPrice,
        numberOfCustomers: item.numberOfCustomers,
        evenTitle: item.evenTitle,
        type: item.type,
        date: item.date,
        status: item.status,
    }))

    const dataSmartDataRequests = smartDataRequests.map((item, index) => ({
        rowNumber: index + 1,
        totalPrice: item.totalPrice,
        smartDataName: item.smartDataName,
        from: item.from,
        to: item.to,
        evenTitle: item.evenTitle,
        type: item.type,
        date: item.date,
        status: item.status,
    }))

    const renderLabel = (key) => {
        const map = {
            numberOfMessages: {label: "تعداد پیام‌ها", icon: <MessageIcon color="primary"/>},
            numberOfSent: {label: "تعداد ارسال شده", icon: <SendIcon color="success"/>},
            numberInQueue: {label: "در صف", icon: <HourglassTopIcon color="warning"/>},
            numberFailed: {label: "ناموفق", icon: <ErrorIcon color="error"/>},
            internalMessageStatus: {label: "وضعیت داخلی", icon: <InfoIcon color="info"/>},
            totalPrice: {label: "مجموع قیمت", icon: <PriceCheckIcon color="secondary"/>},
        };
        return map[key] || {label: key, icon: null};
    };

    const translateStatus = (status) => {
        const statusMap = {
            Queue: "در صف",
            Sent: "ارسال شده",
            Failed: "ناموفق",
            Delivered: "تحویل داده شده",
        };
        return statusMap[status] || status;
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <Box className="bg-lightWhite min-h-screen">
            <PageHeaders current="سامانه پیامکی"/>

            <Box className="border-t border-Gray">
                <Box dir="rtl" display="flex" alignItems="center" justifyContent="space-between" mt={5}>
                    <Box className={"flex flex-col items-center gap-2"}>
                        <Typography variant="h6" fontWeight="bold" ml={2} gap={2}>
                            <StorefrontIcon sx={{width: 28, height: 28, ml: 2, color: "gray"}}/>
                            سامانه پیامکی
                        </Typography>
                    </Box>
                    <Box display="flex" className="flex-col md:flex-row" gap={2}>
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
                                mx: 1,
                                "&:hover": {
                                    backgroundColor: activeTab === "Sent Requests" ? "#f0f0f0" : "#e0e0e0", // Hover effect
                                },
                            }}
                            onClick={() => ChangeTab("Sent Requests")}
                        >
                            پیام های ارسالی
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "none",
                                backgroundColor: activeTab === "Received Requests" ? "white" : "lightGray",
                                color: activeTab === "Received Requests" ? "black" : "gray",
                                borderRadius: "10px",
                                mx: 1,
                                "&:hover": {
                                    backgroundColor: activeTab === "Received Requests" ? "#f0f0f0" : "#e0e0e0", // Hover effect
                                },
                            }}
                            onClick={() => ChangeTab("Received Requests")}
                        >
                            درخواست پیام
                        </Button>
                        <Button
                            variant="text"
                            sx={{
                                textTransform: "none",
                                backgroundColor: activeTab === "Cards Requests" ? "white" : "lightGray",
                                color: activeTab === "Cards Requests" ? "black" : "gray",
                                borderRadius: "10px",
                                mx: 1,
                                "&:hover": {
                                    backgroundColor: activeTab === "Cards Requests" ? "#f0f0f0" : "#e0e0e0", // Hover effect
                                },
                            }}
                            onClick={() => ChangeTab("Cards Requests")}
                        >
                            پیام های تراکنش
                        </Button>
                    </Box>
                </Box>

                <Box display="flex" py={5} justifyContent="space-between">
                    {activeTab === "Sent Requests" && (
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
                                <Box display="flex-col" alignItems="center" justifyContent="center">
                                    <Box mb={10}>
                                        <Typography variant="h6" fontWeight="bold" mb={5} gap={2}>
                                            درخواست های شارژها
                                        </Typography>
                                        <DataTable data={dataCharges} columns={ChargesColumns} loading={loading}/>
                                        <AssignCardModal ref={assignCardModalRef} customerId={setData?.id}/>
                                        {(!dataCharges || dataCharges.length === 0) && (
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
                                    </Box>
                                    <Box>
                                        <Box display="flex" gap={2} className="items-center mb-5">
                                            <Typography variant="h6" fontWeight="bold" gap={2}>
                                                درخواست های ارسالی
                                            </Typography>
                                            <DatePicker
                                                value={fromDate}
                                                onChange={handleFromChange}
                                                calendar={persian}
                                                locale={persian_fa}
                                                render={(valueProps, openCalendar) => (
                                                    <TextField
                                                        {...valueProps}
                                                        label="از تاریخ"
                                                        variant="outlined"
                                                        fullWidth
                                                        onClick={openCalendar}
                                                        inputProps={{
                                                            ...valueProps.inputProps,
                                                            readOnly: true,
                                                        }}
                                                        value={fromDate ? fromDate.format("YYYY/MM/DD") : ""}
                                                    />
                                                )}
                                                maxDate={toDate}
                                            />
                                            <DatePicker
                                                value={toDate}
                                                onChange={handleToChange}
                                                calendar={persian}
                                                locale={persian_fa}
                                                render={(valueProps, openCalendar) => (
                                                    <TextField
                                                        {...valueProps}
                                                        label="تا تاریخ"
                                                        variant="outlined"
                                                        fullWidth
                                                        onClick={openCalendar}
                                                        inputProps={{
                                                            ...valueProps.inputProps,
                                                            readOnly: true,
                                                        }}
                                                        value={toDate ? toDate.format("YYYY/MM/DD") : ""}
                                                    />
                                                )}
                                                minDate={fromDate}
                                            />
                                        </Box>
                                        <DataTable data={dataSMS} columns={SMScolumns} loading={loading}/>
                                        <AssignCardModal ref={assignCardModalRef} customerId={setData?.id}/>
                                        {(!dataSMS || dataSMS.length === 0) && (
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
                                    </Box>
                                </Box>
                            )}

                        </Box>
                    )}
                    {activeTab === "Received Requests" && (
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
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" mb={5} gap={2}>
                                            درخواست های کاربر
                                        </Typography>
                                        <DataTable data={dataSelfMessages} columns={selfMessagesColumns}/>
                                        {(!dataSelfMessages || dataSelfMessages.length === 0) && (
                                            <Box mt={2} display="flex" justifyContent="center"
                                                 alignItems="center"
                                                 width="100%">
                                                <Typography variant="h6" color="textPrimary">
                                                    داده‌ای یافت نشد
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" my={5} gap={2}>
                                            درخواست های باشگاه اشتراک مشتریان
                                        </Typography>
                                        <DataTable data={dataShareClubs} columns={shareClubsColumns}/>
                                        {(!dataShareClubs || dataShareClubs.length === 0) && (
                                            <Box mt={2} display="flex" justifyContent="center"
                                                 alignItems="center"
                                                 width="100%">
                                                <Typography variant="h6" color="textPrimary">
                                                    داده‌ای یافت نشد
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" my={5} gap={2}>
                                            درخواست های دیتای هوشمند
                                        </Typography>
                                        <DataTable data={dataSmartDataRequests} columns={smartDataRequestsColumns}/>
                                        {(!dataSmartDataRequests || dataSmartDataRequests.length === 0) && (
                                            <Box mt={2} display="flex" justifyContent="center"
                                                 alignItems="center"
                                                 width="100%">
                                                باشگاه اشتراک مشتریان <Typography variant="h6" color="textPrimary">
                                                داده‌ای یافت نشد
                                            </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </>
                            )}
                        </Box>
                    )}

                    {activeTab === "Cards Requests" && (
                        <Box
                            display="flex"
                            flexDirection="column"
                            bgcolor="white"
                            borderRadius="1rem"
                            p={5}
                            className="min-w-full"
                        >
                            <Typography variant="h6" fontWeight="bold" mb={4}>
                                درخواست پیام های تراکنش
                            </Typography>

                            <Grid display="flex" gap={2} mb={4}>
                                <DatePicker
                                    value={fromDateCards}
                                    onChange={(date) => {
                                        handleFromCardsChange(date);
                                        fetchCards();
                                    }}
                                    calendar={persian}
                                    locale={persian_fa}
                                    render={(valueProps, openCalendar) => (
                                        <TextField
                                            {...valueProps}
                                            label="از تاریخ"
                                            variant="outlined"
                                            fullWidth
                                            onClick={openCalendar}
                                            inputProps={{
                                                ...valueProps.inputProps,
                                                readOnly: true,
                                            }}
                                            value={fromDateCards ? fromDateCards.format("YYYY/MM/DD") : ""}
                                        />
                                    )}
                                    maxDate={toDateCards}
                                />
                                <DatePicker
                                    value={toDateCards}
                                    onChange={(date) => {
                                        handleToChangeCards(date);
                                        fetchCards(); // fetch when changed
                                    }}
                                    calendar={persian}
                                    locale={persian_fa}
                                    render={(valueProps, openCalendar) => (
                                        <TextField
                                            {...valueProps}
                                            label="تا تاریخ"
                                            variant="outlined"
                                            fullWidth
                                            onClick={openCalendar}
                                            inputProps={{
                                                ...valueProps.inputProps,
                                                readOnly: true,
                                            }}
                                            value={toDateCards ? toDateCards.format("YYYY/MM/DD") : ""}
                                        />
                                    )}
                                    minDate={fromDateCards}
                                />
                            </Grid>

                            {/* Cards Grid */}
                            <Grid container spacing={2} mt={3}>
                                {Object.entries(cards || {
                                    numberOfMessages: 0,
                                    numberOfSent: 0,
                                    numberInQueue: 0,
                                    numberFailed: 0,
                                    totalPrice: "0",
                                })
                                    .filter(([key]) =>
                                        [
                                            "numberOfMessages",
                                            "numberOfSent",
                                            "numberInQueue",
                                            "numberFailed",
                                            "totalPrice",
                                        ].includes(key)
                                    )
                                    .map(([key, value]) => {
                                        const {label, icon} = renderLabel(key);

                                        const displayValue =
                                            key === "internalMessageStatus"
                                                ? translateStatus(value)
                                                : key === "totalPrice"
                                                    ? new Intl.NumberFormat("fa-IR").format(Number(value))
                                                    : value;

                                        return (
                                            <Grid item xs={12} sm={6} md={4} key={key}>
                                                <Box
                                                    p={3}
                                                    bgcolor="#f9f9f9"
                                                    borderRadius="0.75rem"
                                                    boxShadow={1}
                                                    display="flex"
                                                    flexDirection="column"
                                                    gap={1}
                                                >
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {icon}
                                                        <Typography fontWeight="bold">{label}</Typography>
                                                    </Box>
                                                    <Typography>{displayValue}</Typography>
                                                </Box>
                                            </Grid>
                                        );
                                    })}
                            </Grid>
                        </Box>
                    )}

                    <Dialog
                        open={openModal}
                        onClose={() => {
                            setOpenModal(false);
                            resetFormData();
                        }}
                        fullWidth
                        دیتای هوشمند maxWidth="md"
                        sx={{
                            "& .MuiDialog-paper": {
                                width: "80%",
                                maxWidth: "100%",
                                margin: "auto",
                                padding: 2,
                            },
                        }}
                    >
                        <Box className="flex flex-col">
                            <Typography variant="h7" fontWeight="bold">
                                درخواست ارسال پیام
                            </Typography>
                            <Box className="bg-white w-full h-full rounded-xl p-5 flex flex-col gap-5">
                                <FormControl fullWidth>
                                    <InputLabel>نوع درخواست</InputLabel>
                                    <Select
                                        value={requestType}
                                        required
                                        onChange={(e) => setRequestType(e.target.value)}
                                    >
                                        <MenuItem value="message">پیام</MenuItem>
                                        <MenuItem value="creditevent">طرح اعتباری</MenuItem>
                                    </Select>
                                </FormControl>

                                {requestType === "creditevent" && (
                                    <FormControl fullWidth>
                                        <InputLabel>طرح اعتباری</InputLabel>
                                        <Select
                                            value={eventId}
                                            required
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
                                    required
                                />

                                <FormControl fullWidth>
                                    <InputLabel>نوع پیام</InputLabel>
                                    <Select
                                        value={messageType}
                                        required
                                        onChange={(e) => setMessageType(e.target.value)}
                                    >
                                        <MenuItem value="file">فایل</MenuItem>
                                        <MenuItem value="customerMessage">مشتری</MenuItem>
                                    </Select>
                                </FormControl>

                                {messageType === "file" && (
                                    <Box display="flex" gap={2}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleDownloadTemplate}
                                            className="w-1/2 gap-2"
                                        >
                                            <RiFileExcel2Fill/>
                                            دانلود قالب
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            className="w-1/2 gap-2"
                                        >
                                            انتخاب فایل
                                            <input
                                                type="file"
                                                hidden
                                                accept=".xlsx, .xls"
                                                onChange={(e) => setSelectedFile(e.target.files[0])}
                                            />
                                        </Button>
                                        {selectedFile && (
                                            <Typography variant="body2" color="primary">
                                                فایل انتخاب شده: {selectedFile.name}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {messageType === "customerMessage" && (
                                    <>
                                        <FormControl fullWidth>
                                            <InputLabel>شعبه</InputLabel>
                                            <Select
                                                name="branchId"
                                                value={branchId}
                                                onChange={(e) => handleBranchChange(e.target.value)}
                                                input={
                                                    <OutlinedInput
                                                        label="شعبه"
                                                        endAdornment={
                                                            branchId ? (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleBranchChange("");
                                                                    }}
                                                                >
                                                                    <Clear fontSize="small"/>
                                                                </IconButton>
                                                            ) : null
                                                        }
                                                    />
                                                }
                                            >
                                                {branches.map((branch) => (
                                                    <MenuItem key={branch.id} value={branch.id}>
                                                        {branch.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <FormControl fullWidth>
                                            <InputLabel>بخش</InputLabel>
                                            <Select
                                                name="lineId"
                                                value={lineId}
                                                onChange={(e) => setLineId(e.target.value)}
                                                disabled={!lines.length}
                                                input={
                                                    <OutlinedInput
                                                        label="بخش"
                                                        endAdornment={
                                                            lineId ? (
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setLineId("");
                                                                    }}
                                                                >
                                                                    <Clear fontSize="small"/>
                                                                </IconButton>
                                                            ) : null
                                                        }
                                                    />
                                                }
                                            >
                                                {lines.map((line) => (
                                                    <MenuItem key={line.id} value={line.id}>
                                                        {line.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                        <Alert severity="info" sx={{mt: 2, borderRadius: 2}}>
                                            درخواست شما به <strong
                                            className="text-red-300">{recipientCount}</strong> نفر ارسال خواهد شد.
                                        </Alert>
                                    </>
                                )}

                                <Typography variant="body2" color="textPrimary">
                                    پیام در چه بستری منتشر شود:
                                </Typography>
                                <Box className="flex flex-wrap gap-2 sm:gap-5">
                                    <FormControlLabel control={<Checkbox checked disabled/>} label="پیام کوتاه"/>
                                    <FormControlLabel control={<Checkbox disabled/>} label="نوتیفیکیشن"/>
                                    <FormControlLabel control={<Checkbox disabled/>} label="اپلیکیشن"/>
                                </Box>

                                <Button
                                    variant="contained"
                                    color="error"
                                    sx={{py: 1.5, borderRadius: "1rem", fontWeight: "bold"}}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} sx={{color: "white"}}/>
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

export default SMSSystem;
