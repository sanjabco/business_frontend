import React, {useState, useEffect, useMemo} from "react";
import DatePicker from "react-multi-date-picker";
import {
    TextField,
    Box,
    Button,
    CircularProgress,
    Typography,
    Dialog,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Collapse,
    IconButton,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {ArchiveBoxIcon} from "@heroicons/react/24/outline/index.js";
import api from "../../Components/auth/axiosConfig.js";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import PageHeaders from "../../Components/common/PageHeaders.jsx";
import {toast} from "react-toastify";

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

const CollapsibleRow = ({branch, lines, index}) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <TableRow>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>
                <TableCell align="center">{index + 1}</TableCell>
                <TableCell align="center">{branch.title}</TableCell>
                <TableCell align="center">{branch.branchName}</TableCell>
                <TableCell
                    align="center"
                    style={{color: branch.amount < 0 ? "red" : "inherit"}}
                >
                    {branch.amount.toLocaleString("en-US")} ریال
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{paddingBottom: 0, paddingTop: 0}} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                            <Typography variant="subtitle1" gutterBottom>
                                جزئیات بخش ها
                            </Typography>
                            <Table size="small" aria-label="lines">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">ردیف</TableCell>
                                        <TableCell align="center">عنوان</TableCell>
                                        <TableCell align="center">مبلغ</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lines.map((line, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell align="center">{idx + 1}</TableCell>
                                            <TableCell align="center">{line.title}</TableCell>
                                            <TableCell
                                                align="center"
                                                style={{color: line.amount < 0 ? "red" : "inherit"}}
                                            >
                                                {line.amount.toLocaleString("en-US")} ریال
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const CreateModal = ({openModal, setOpenModal, onSubmit}) => {
    const [modalFromDate, setModalFromDate] = useState(null);
    const [modalToDate, setModalToDate] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleModalSubmit = async () => {
        if (modalFromDate && modalToDate) {
            setLoading(true);
            try {
                await api.post("/FinancialBalance", {
                    from: convertFarsiToEnglishDigits(modalFromDate.format("YYYY/MM/DD")),
                    to: convertFarsiToEnglishDigits(modalToDate.format("YYYY/MM/DD")),
                });
                toast.success("صندوق خالی شد.");
                onSubmit(modalFromDate, modalToDate);
                setOpenModal(false);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
            <Box p={3}>
                <Typography variant="h6" mb={2}>
                    تنظیم تاریخ‌ها
                </Typography>
                <Box display="flex" flexDirection="column" gap={3}>
                    <DatePicker
                        value={modalFromDate}
                        onChange={setModalFromDate}
                        calendar={persian}
                        locale={persian_fa}
                        className="rmdp-mobile"
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
                                value={modalFromDate ? modalFromDate.format("YYYY/MM/DD") : ""}
                            />
                        )}
                        maxDate={modalToDate}
                    />
                    <DatePicker
                        value={modalToDate}
                        onChange={setModalToDate}
                        calendar={persian}
                        locale={persian_fa}
                        className="rmdp-mobile"
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
                                value={modalToDate ? modalToDate.format("YYYY/MM/DD") : ""}
                            />
                        )}
                        minDate={modalFromDate}
                    />
                </Box>
                <Box mt={3} display="flex" gap={2}>
                    <Button onClick={() => setOpenModal(false)} color="secondary" variant="outlined">
                        لغو
                    </Button>
                    <Button onClick={handleModalSubmit} color="primary" variant="contained" disabled={loading}>
                        {loading ? "در حال ارسال..." : "ارسال"}
                    </Button>
                </Box>
            </Box>
        </Dialog>
    );
};

const CashbackBox = () => {
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [SMS, setSMS] = useState([]);

    const handleFromChange = (newDate) => {
        setFromDate(newDate);
    };

    const handleToChange = (newDate) => {
        setToDate(newDate);
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleModalSubmit = (modalFromDate, modalToDate) => {
        setFromDate(modalFromDate);
        setToDate(modalToDate);
        fetchData();
    };

    const fetchData = async () => {
        if (fromDate && toDate) {
            setLoading(true);
            try {
                const response = await api.get("/FinancialBalance", {
                    params: {
                        from: convertFarsiToEnglishDigits(fromDate.format("YYYY/MM/DD")),
                        to: convertFarsiToEnglishDigits(toDate.format("YYYY/MM/DD")),
                    },
                });
                setSMS(response.data.Data.balances);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchData();
    }, [fromDate, toDate]);

    const groupedData = useMemo(() => {
        const branches = SMS.filter(item => item.type === "branch");
        return branches.map(branch => ({
            branch,
            lines: SMS.filter(item => item.parentId === branch.id)
        }));
    }, [SMS]);


    return (
        <div className="bg-lightWhite w-full">
            <PageHeaders current="سامانه پیامکی"/>
            <Box className="border-t border-Gray">
                <Box display="flex" alignItems="center" justifyContent="start" my={5}>
                    <ArchiveBoxIcon className="w-7 h-7 ml-2 text-Gray"/>
                    <Typography variant="h6" fontWeight="bold" ml={2}>
                        صندوق کشبک
                    </Typography>
                </Box>
            </Box>
            <Box display="flex" mb={4} alignItems="center" justifyContent="space-between">
                <Box display="flex" gap={2}>
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
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    رسیدگی به صورت حساب
                </Button>
            </Box>

            <CreateModal openModal={modalOpen} setOpenModal={setModalOpen} onSubmit={handleModalSubmit}/>

            <Box mt={4}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress/>
                    </Box>
                ) : groupedData.length === 0 ? (
                    <Typography variant="h6" align="center">
                        پیامکی یافت نشد
                    </Typography>
                ) : (
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">
                                        <Typography variant="h6" fontWeight="bold">
                                            شعبه
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">ردیف</TableCell>
                                    <TableCell align="center">عنوان</TableCell>
                                    <TableCell align="center">مبلغ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {groupedData.map((group, index) => (
                                    <CollapsibleRow
                                        key={index}
                                        branch={group.branch}
                                        lines={group.lines}
                                        index={index}
                                    />
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </div>
    );
};

export default CashbackBox;
