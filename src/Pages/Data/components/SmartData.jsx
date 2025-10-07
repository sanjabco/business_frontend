import {useEffect, useState, useRef} from "react";
import api from "../../../Components/auth/axiosConfig.js"
import {useParams} from "react-router-dom";
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Checkbox,
    Dialog,
    FormControlLabel,
    Button, DialogActions, CircularProgress
} from '@mui/material';
import PageHeaders from "../../../Components/common/PageHeaders.jsx";
import DataTable from "../../../Components/common/DataTable.jsx";
import AssignCardModal from "../../customer-management/components/AssignCardModal.jsx";
import AddIcon from "@mui/icons-material/Add.js";

const columns = [
    {
        accessorKey: "rowNumber",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "eventTitle",
        header: "عنوان",
        cell: ({row}) => {
            const requestType = row.getValue("eventTitle");
            const requestTypeMap = {
                "Message": "پیام",
                "Cashback": "کش بک",
                "CreditEvent": "طرح اعتباری",
            };
            return requestTypeMap[requestType] || "نامشخص";
        },
    },
    {
        accessorKey: "requestType",
        header: "نوع درخواست",
        cell: ({row}) => {
            const requestType = row.getValue("requestType");
            const requestTypeMap = {
                "Message": "پیام",
                "Cashback": "کش بک",
                "CreditEvent": "طرح اعتباری",
            };
            return requestTypeMap[requestType] || "نامشخص";
        },
    },
    {
        accessorKey: "messageType",
        header: "نوع پیام",
        cell: ({row}) => {
            const messageType = row.getValue("messageType");

            const messageTypeMap = {
                "Message": "پیام",
            };

            return messageTypeMap[messageType] || "نامشخص";
        },
    },
    {
        accessorKey: "state",
        header: "وضعیت",
        cell: ({row}) => {
            const state = row.getValue("state");

            const stateMap = {
                "PendingOnAdminApproval": "منتظر تایید مدیریت",
                "Accepted": "پذیرفته شده",
                "Sent": "ارسال شده",
                "RejectedByAdmin": "رد شده توسط مدیریت",
            };

            return stateMap[state] || "نامشخص";
        },
    },
    {
        accessorKey: "smartDataTitle",
        header: "نام دیتا",
        cell: ({row}) => row.getValue("smartDataTitle"),
    },
    {
        accessorKey: "message",
        header: "پیام",
        cell: ({row}) => row.getValue("message"),
    },
    {
        accessorKey: "creationDate",
        header: "تاریخ ایجاد",
        cell: ({row}) => row.getValue("creationDate"),
    },
];

const SmartData = () => {
    const {id} = useParams();
    const assignCardModalRef = useRef();

    const [selectedsmartdata, setSelectedSmartData] = useState(null);
    const [allData, setAllData] = useState([]);
    const [creditplans, setCreditPlans] = useState([]);

    const [requestType, setRequestType] = useState("");
    const [message, setMessage] = useState("");
    const [fromNumber, setFromNumber] = useState("");
    const [toNumber, setToNumber] = useState("");
    const [eventId, setEventId] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const smartDataResponse = await api.get(`/SmartData/data/${id}`);
            setSelectedSmartData(smartDataResponse.data.Data.smartDataDto);

            const allDataResponse = await api.get("/SmartData");
            setAllData(allDataResponse.data.Data.result);

            const creditPlansResponse = await api.get("/credit-event");
            setCreditPlans(creditPlansResponse.data.Data.items);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleChange = (event) => {
        setRequestType(event.target.value);
    };

    const resetModal = () => {
        setRequestType("");
        setMessage("");
        setFromNumber("");
        setToNumber("");
        setEventId(null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            smartDataId: id,
            type: requestType,
            eventId: eventId,
            from: fromNumber,
            to: toNumber,
            message: message,
        };

        try {
            await api.post("/SmartData", payload);
            setOpenModal(false);
            resetModal();
            fetchData();
        } catch (error) {
            console.error("Error creating SmartData:", error);
        } finally {
            setLoading(false);
        }
    };

    const data = allData.map(item => ({
        rowNumber: item.rowNumber,
        eventTitle: item.eventTitle,
        requestType: item.requestType,
        messageType: item.messageType,
        state: item.state,
        smartDataTitle: item.smartDataTitle,
        message: item.message,
        creationDate: item.creationDate
    }));

    return (
        <>
            <PageHeaders current="دیتای هوشمند"/>
            <Box className="flex flex-col border-t border-Gray p-5 items-top gap-10">
                <div className={"flex items-center justify-between"}>
                    <Box className="flex flex-col w-full h-full gap-2 ">
                        <Typography variant="h6" fontWeight="bold">{selectedsmartdata?.title || "No Title"}</Typography>
                        <Typography variant="body2" color="Gray">
                            دارای {selectedsmartdata?.count || "no count"} عضو
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        className={"w-fit lg:w-1/4"}
                        onClick={() => setOpenModal(true)}
                        icon={<AddIcon/>}
                    >
                        درخواست ارسال پیام
                    </Button>
                </div>

                <div className={"flex xl:flex-row flex-col items-top justify-center gap-5"}>
                    <Box display="flex" flexDirection="column" bgcolor="white" borderRadius="1rem" gap={5} fullWidth>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                                <CircularProgress/>
                            </Box>
                        ) : (
                            <DataTable data={data} columns={columns}/>
                        )}
                        <AssignCardModal ref={assignCardModalRef} customerId={selectedsmartdata?.id}/>
                    </Box>

                    <Dialog
                        open={openModal}
                        onClose={() => {
                            setOpenModal(false);
                            resetModal();
                        }}
                        fullWidth
                        maxWidth="md"
                        sx={{
                            '& .MuiDialog-paper': {
                                width: '80%',
                                maxWidth: '100%',
                                margin: 'auto',
                                padding: 2,
                            }
                        }}
                    >
                        <Box className="flex flex-col">
                            <Typography variant="h7" fontWeight="bold">درخواست ارسال پیام</Typography>
                            <Box className="bg-white w-full h-full rounded-xl p-5 flex flex-col gap-5">
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
                                            {creditplans.map((c) => (
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

                                <Typography variant="body2" color="textSecondary">
                                    پیام برای از چه شماره‌ای تا چه شماره‌ای ارسال شود.
                                </Typography>
                                <Box className="flex flex-col sm:flex-row gap-2 sm:gap-5">
                                    <TextField
                                        label="از"
                                        value={fromNumber}
                                        onChange={(e) => setFromNumber(e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="تا"
                                        value={toNumber}
                                        onChange={(e) => setToNumber(e.target.value)}
                                        fullWidth
                                    />
                                </Box>

                                <Typography variant="body2" color="textSecondary">
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
                                    sx={{py: 1.5, borderRadius: "1rem", fontWeight: "bold"}}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    endIcon={loading ?
                                        <CircularProgress size={24}/> : null}
                                >
                                    ارسال درخواست
                                </Button>
                            </Box>
                        </Box>
                        <DialogActions>
                            <Button onClick={() => setOpenModal(false)} color="primary">
                                بستن
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </Box>
        </>
    );
};

export default SmartData;
