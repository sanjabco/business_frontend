import {useState, useEffect, useRef, useCallback, useMemo} from "react";
import {Square3Stack3DIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {IoIosSearch} from "react-icons/io";
import {NavLink} from "react-router-dom";
import {
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    InputAdornment,
    CircularProgress,
    Pagination,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Menu,
} from "@mui/material";
import {styled} from "@mui/system";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import api from "../../Components/auth/axiosConfig.js";
import PageHeaders from "../../Components/common/PageHeaders";
import DataTable from "../../Components/common/DataTable";
import AddCustomerByCard from "./components/AddCustomerByCard";
import AssignCardModal from "./components/AssignCardModal";
import DeleteModal from "./components/DeleteCustomer";
import EditCustomerModal from "./components/EditCustomer";
import CustomerDetails from "./components/CustomerDetails.jsx";

const StyledMenu = styled((props) => (
    <Menu
        elevation={2}
        anchorOrigin={{vertical: "bottom", horizontal: "right"}}
        transformOrigin={{vertical: "top", horizontal: "right"}}
        {...props}
    />
))(({theme}) => ({
    "& .MuiPaper-root": {
        borderRadius: 12,
        minWidth: 180,
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
        boxShadow: "0 6px 18px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.04)",
    },
    "& .MuiMenuItem-root": {
        borderRadius: 8,
        gap: theme.spacing(1.5),
        paddingBlock: theme.spacing(1),
        "&:hover": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

const RowActions = ({row, onEdit, onDelete, onDetails}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleOpen = (e) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    return (
        <>
            <IconButton size="small" onClick={handleOpen}>
                <MoreVertIcon/>
            </IconButton>
            <StyledMenu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem
                    onClick={() => {
                        onEdit(row.original);
                        handleClose();
                    }}
                >
                    <EditIcon fontSize="small"/> ویرایش
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onDelete(row.original);
                        handleClose();
                    }}
                >
                    <DeleteIcon fontSize="small"/> حذف
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        onDetails(row.original);
                        handleClose();
                    }}
                >
                    <VisibilityIcon fontSize="small"/> جزئیات
                </MenuItem>
            </StyledMenu>
        </>
    );
};

const SearchWrapper = styled(Box)(({theme}) => ({
    position: "relative",
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "400px",
    },
}));

const CustomerManagement = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerData, setCustomerData] = useState(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

    const assignCardModalRef = useRef();

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const {data} = await api.get(
                `/Customer?PageIndex=${pageIndex}&PageSize=${pageSize}&Name=${debouncedSearchQuery}`
            );
            setCustomers(data.Data.items);
            setTotalCount(data.Data.totalCount);
        } finally {
            setLoading(false);
        }
    }, [pageIndex, pageSize, debouncedSearchQuery]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        fetchCustomers();
    }, [fetchCustomers]);

    const handleDeleteModalOpen = (customer) => {
        setSelectedCustomer(customer);
        setDeleteModalOpen(true);
    };

    const handleEditModalOpen = (customer) => {
        setSelectedCustomer(customer);
        setEditModalOpen(true);
    };

    const handleDetailsModalOpen = (customer) => {
        setSelectedCustomer(customer);
        setDetailsModalOpen(true);
    };

    const handleModalClose = () => {
        setDeleteModalOpen(false);
        setEditModalOpen(false);
        setDetailsModalOpen(false);
    };

    const handleDeleteSuccess = () => {
        fetchCustomers();
        handleModalClose();
    };

    const handleEditSuccess = () => {
        fetchCustomers();
        handleModalClose();
    };

    const handlePageChange = (_e, value) => setPageIndex(value);
    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        setPageIndex(1);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: "rowNumber",
                header: "ردیف",
                cell: ({row}) => <div className="text-center">{row.index + 1}</div>,
            },
            {accessorKey: "firstName", header: "نام"},
            {accessorKey: "lastName", header: "نام خانوادگی"},
            {accessorKey: "phoneNumber", header: "شماره همراه"},
            {accessorKey: "nationalCode", header: "کدملی"},
            {accessorKey: "subscriptionCode", header: "کد اشتراک"},
            {accessorKey: "birthDate", header: "تاریخ تولد"},
            {
                accessorKey: "isMarried",
                header: "وضعیت تاهل",
                cell: ({row}) => (row.getValue("isMarried") ? "متاهل" : "مجرد"),
            },
            {
                accessorKey: "actions",
                header: "عملیات",
                cell: ({row}) => (
                    <RowActions
                        row={row}
                        onEdit={handleEditModalOpen}
                        onDelete={handleDeleteModalOpen}
                        onDetails={handleDetailsModalOpen}
                    />
                ),
            },
        ],
        []
    );

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="bg-lightWhite w-full">
            <PageHeaders current="مدیریت مشتریان"/>
            <Box className="border-t border-Gray">
                <Box display="flex" alignItems="center" my={5}>
                    <Square3Stack3DIcon className="w-7 h-7 ml-2 text-Gray"/>
                    <Typography variant="h6" fontWeight="bold" ml={2}>
                        داشبورد مشتریان
                    </Typography>
                </Box>
            </Box>

            <Box mt={5}>
                <Box className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
                    <SearchWrapper>
                        <TextField
                            id="Search"
                            type="search"
                            placeholder="جستجو"
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                    </SearchWrapper>

                    <Box display="flex" flexWrap="wrap" justifyContent="center" gap={5} mt={2}>
                        <AddCustomerByCard/>
                        <NavLink to="add">
                            <Button variant="outlined" startIcon={<PlusCircleIcon className="w-5 h-5"/>}>
                                افزودن مشتری جدید
                            </Button>
                        </NavLink>
                    </Box>
                </Box>
            </Box>

            <Box mt={4}>
                {loading ? (
                    <Box className="flex justify-center items-center">
                        <CircularProgress/>
                    </Box>
                ) : customers.length === 0 ? (
                    <Typography variant="h6" align="center">
                        مشتری یافت نشد
                    </Typography>
                ) : (
                    <>
                        <DataTable data={customers} columns={columns}/>
                        <Box mt={2} display="flex" alignItems="center">
                            <FormControl size="small" variant="outlined">
                                <InputLabel>تعداد در هر صفحه</InputLabel>
                                <Select value={pageSize} onChange={handlePageSizeChange} label="تعداد در هر صفحه">
                                    {[5, 10, 20, 100].map((sz) => (
                                        <MenuItem key={sz} value={sz}>
                                            {sz}
                                        </MenuItem>
                                    ))}
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

            <AssignCardModal ref={assignCardModalRef} customerId={customerData?.id}/>
            <DeleteModal
                key={selectedCustomer?.id || "delete-modal"}
                open={deleteModalOpen}
                onClose={handleModalClose}
                customer={selectedCustomer}
                onDeleteSuccess={handleDeleteSuccess}
            />
            <EditCustomerModal
                key={selectedCustomer?.id || "edit-modal"}
                open={editModalOpen}
                onClose={handleModalClose}
                customer={selectedCustomer}
                onEditSuccess={handleEditSuccess}
            />
            <CustomerDetails
                key={selectedCustomer?.id || "details-modal"}
                open={detailsModalOpen}
                onClose={handleModalClose}
                customer={selectedCustomer}
            />
        </div>
    );
};

export default CustomerManagement;
