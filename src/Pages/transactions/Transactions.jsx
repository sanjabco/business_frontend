import {useState, useEffect, useRef, memo, useCallback} from "react";
import {Square3Stack3DIcon, DocumentIcon, ExclamationCircleIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {IoIosSearch} from "react-icons/io";
import AddTransaction from "./components/AddTransaction.jsx";
import AddNewCustomer from "./components/AddNewCustomer.jsx";
import PageHeaders from "../../Components/common/PageHeaders";
import api from "../../Components/auth/axiosConfig.js";
import DataTable from "../../Components/common/DataTable.jsx";
import {toast} from "react-toastify";
import {saveAs} from "file-saver";
import {
    Box,
    Button,
    TextField,
    InputAdornment,
    Typography,
    IconButton,
    Tooltip,
    DialogContent,
    DialogActions,
    Dialog,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Pagination,
} from "@mui/material";
import {styled} from "@mui/system";
import AddSpend from "./components/AddSpend.jsx";
import UploadModal from "./components/UploadModal.jsx";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debouncedValue;
}

const DescriptionModal = ({open, onClose, description}) => (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogContent sx={{padding: 4}}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
                شرح
            </Typography>
            <Typography variant="body1" sx={{fontSize: "1.1rem", lineHeight: "1.5", whiteSpace: "pre-wrap"}}>
                {description}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose} color="primary" variant="contained">
                بستن
            </Button>
        </DialogActions>
    </Dialog>
);

const SearchInput = memo(({searchQuery, onSearchChange, inputRef}) => (
    <TextField
        id="Search"
        type="search"
        placeholder="جستجو"
        fullWidth
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={onSearchChange}
        inputRef={inputRef}
        sx={{
            "& .MuiOutlinedInput-root": {pl: 1},
            "& input": {textAlign: "left"},
        }}
        InputProps={{
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton edge="end">
                        <IoIosSearch/>
                    </IconButton>
                </InputAdornment>
            ),
        }}
    />
));

const columns = [
    {
        accessorKey: "id",
        header: "ردیف",
        cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
    },
    {
        accessorKey: "customerFullName",
        header: "نام مشتری",
        cell: ({row}) => <div className="text-center">{row.getValue("customerFullName")}</div>,
    },
    {
        accessorKey: "amount",
        header: "مبلغ",
        cell: ({row}) => (
            <div className="text-center">
                {row.getValue("amount").toLocaleString("en-US")} ریال
            </div>
        ),
    },
    {
        accessorKey: "paymentMethod",
        header: "نوع پرداخت",
        cell: ({row}) => <div className="text-center">{row.getValue("paymentMethod")}</div>,
    },
    {
        accessorKey: "date",
        header: "تاریخ",
        cell: ({row}) => <div className="text-center">{row.getValue("date")}</div>,
    },
    {
        accessorKey: "descriptions",
        header: "شرح",
        cell: ({row}) => {
            const [openModal, setOpenModal] = useState(false);
            const [selectedDescription, setSelectedDescription] = useState("");

            const handleOpenModal = () => {
                setSelectedDescription(row.getValue("descriptions"));
                setOpenModal(true);
            };

            const handleCloseModal = () => setOpenModal(false);

            return (
                <div className="text-center line-clamp-1">
                    <ExclamationCircleIcon onClick={handleOpenModal} className="w-5 h-5 text-primary cursor-pointer"/>
                    <DescriptionModal open={openModal} onClose={handleCloseModal} description={selectedDescription}/>
                </div>
            );
        },
    },
    {
        accessorKey: "branchTitle",
        header: "شعبه تراکنش",
        cell: ({row}) => <div className="text-center">{row.getValue("branchTitle")}</div>,
    },
    {
        accessorKey: "lineTitle",
        header: "بخش تراکنش",
        cell: ({row}) => <div className="text-center">{row.getValue("lineTitle")}</div>,
    },
];

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingButton, setLoadingButton] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const fileInputRef = useRef(null);
    const [addNewCustomerOpen, setAddNewCustomerOpen] = useState(false);
    const [tempPhoneNumber, setTempPhoneNumber] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [submittedQuery, setSubmittedQuery] = useState("");
    const [uploadModalOpen, setUploadModalOpen] = useState(false);

    const searchInputRef = useRef(null);

    const onSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    const debouncedSearchQuery = useDebounce(searchQuery, 1000);

    useEffect(() => {
        setSubmittedQuery(debouncedSearchQuery);
        setPageIndex(1);
    }, [debouncedSearchQuery]);

    useEffect(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [searchQuery]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const {data} = await api.get(`/Transaction`, {
                params: {
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                    customerFullName: submittedQuery,
                },
            });
            setTransactions(data.Data.transactions.items);
            setTotalCount(data.Data.transactions.totalCount);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [pageIndex, pageSize, submittedQuery]);

    const SearchWrapper = styled(Box)(({theme}) => ({
        position: "relative",
        width: "100%",
        [theme.breakpoints.up("sm")]: {
            maxWidth: "400px",
        },
    }));

    const handleOpenUploadModal = () => setUploadModalOpen(true);
    const handleCloseUploadModal = () => setUploadModalOpen(false);
    const handleModalSubmit = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }
    const refreshTable = () => fetchTransactions();

    const handleDownloadExcel = async () => {
        setLoadingButton(true);
        try {
            const response = await api.get(`/Transaction/excel`, {
                params: {
                    PageIndex: pageIndex,
                    PageSize: pageSize,
                },
                responseType: "blob",
            });
            const blob = new Blob([response.data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            saveAs(blob, "transactions.xlsx");
        } finally {
            setLoadingButton(false);
        }
    };

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <Box className="bg-lightWhite w-full">
            <PageHeaders current="تراکنش و پرداخت ها"/>
            <Box className="border-t border-Gray">
                <Box display="flex" alignItems="center" my={5}>
                    <Square3Stack3DIcon className="w-7 h-7 ml-2 text-Gray"/>
                    <Typography variant="h6" fontWeight="bold" ml={2}>
                        تراکنش و پرداخت های مشتریان
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" gap={5} flexWrap="wrap" alignItems="center">
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                        maxWidth: "384px",
                        borderBottom: "1px solid #D1D5DB",
                        position: "relative",
                    }}
                >
                    <SearchWrapper>
                        <SearchInput
                            searchQuery={searchQuery}
                            onSearchChange={onSearchChange}
                            inputRef={searchInputRef}
                        />
                    </SearchWrapper>
                </Box>

                <Box display="flex" flexWrap="wrap" gap={5} justifyContent="center" textAlign="center">
                    <Box display="flex" flexDirection="column" gap={3}>
                        <Button
                            variant="outlined"
                            startIcon={<PlusCircleIcon className="w-5 h-5 text-red-500"/>}
                            onClick={() => {
                                setTempPhoneNumber("");
                                setAddNewCustomerOpen(true);
                            }}
                            sx={{
                                borderRadius: "50px",
                                fontWeight: "bold",
                                borderColor: "red",
                                color: "red",
                            }}
                        >
                            افزودن مشتری جدید
                        </Button>
                        <AddNewCustomer
                            open={addNewCustomerOpen}
                            onClose={() => setAddNewCustomerOpen(false)}
                            defaultPhoneNumber={tempPhoneNumber}
                        />
                        <Tooltip title="دریافت تراکنش ها با اکسل" arrow>
                            <Button
                                variant="outlined"
                                color="error"
                                sx={{
                                    borderRadius: "50px",
                                    fontWeight: "bold",
                                    borderColor: "red",
                                    color: "red",
                                }}
                                startIcon={<DocumentIcon className="w-5 h-5"/>}
                                onClick={handleDownloadExcel}
                                disabled={loadingButton}
                            >
                                {loadingButton ?
                                    <CircularProgress size={24} color="inherit"/> : "دریافت تراکنش ها با اکسل"}
                            </Button>
                        </Tooltip>
                    </Box>

                    <Box display="flex" flexDirection="column" gap={3}>
                        <AddTransaction refreshTable={refreshTable}/>
                        <AddSpend/>
                        <Tooltip title="افزودن گروهی با اکسل" arrow>
                            <Button
                                variant="outlined"
                                color="error"
                                sx={{
                                    borderRadius: "50px",
                                    fontWeight: "bold",
                                    borderColor: "red",
                                    color: "red",
                                }}
                                startIcon={<DocumentIcon className="w-5 h-5"/>}
                                onClick={handleOpenUploadModal}
                            >
                                افزودن گروهی با اکسل
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>
            </Box>

            <Box sx={{mt: 5}}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" sx={{minHeight: "200px"}}>
                        <CircularProgress/>
                    </Box>
                ) : (
                    <>
                        <UploadModal open={uploadModalOpen} onClose={handleCloseUploadModal}
                                     onSubmit={handleModalSubmit} refreshTable={refreshTable}/>
                        <DataTable data={transactions} columns={columns}/>
                        <Box display="flex" alignItems="center" mt={2}>
                            <FormControl size="small" variant="outlined">
                                <InputLabel>تعداد در هر صفحه</InputLabel>
                                <Select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(e.target.value);
                                        setPageIndex(1);
                                    }}
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
                                onChange={(e, value) => setPageIndex(value)}
                                color="primary"
                                sx={{marginLeft: "10px"}}
                            />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Transactions;
