import React, {useEffect, useState} from "react";
import {
    Dialog,
    Box,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    Typography,
    TextField,
    Grid, CircularProgress,
} from "@mui/material";
import {XMarkIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import PriceInput from "../../../Components/common/PriceInput.jsx";
import api from "../../../Components/auth/axiosConfig.js"
import {toast} from "react-toastify";

const schema = yup.object().shape({
    phoneNumber: yup
        .string()
        .required("شماره همراه الزامی است")
        .matches(/^[0-9]{10,11}$/, "شماره همراه نامعتبر است"),
    credit: yup
        .number()
        .typeError("مقدار اعتبار باید عدد باشد")
        .required("مقدار اعتبار الزامی است")
        .positive("مقدار اعتبار باید بیشتر از 0 باشد"),
    selectedBranchId: yup
        .string()
        .required("انتخاب شعبه الزامی است"),
});

function AddSpend() {
    const [open, setOpen] = useState(false);
    const [credit, setCredit] = useState("");
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [selectedBranchId, setSelectedBranchId] = React.useState('');
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [branches, setBranches] = useState([]);
    const [customerCredit, setCustomerCredit] = useState([]);
    const [customerCreditOpen, setCustomerCreditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [lines, setLines] = useState([]);
    const [selectedLine, setSelectedLine] = useState('');
    const [line, setLine] = useState("");

    const {
        control,
        handleSubmit,
        formState: {errors},
        watch,
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            maxCashBackCreditPay: "",
            cashBackPercentage: "",
            branchSharePercentage: "",
            fromDate: null,
            toDate: null,
            phoneNumber: "",
            credit: "",
            selectedBranchId: "",
        },
    });

    const fetchAllBranches = async () => {
        const {data} = await api.get("/Branch");
        setBranches(data.Data.branches);
    }

    const fetchCustomerCredit = async (cardNumber, branchId) => {
        const query = `/Customer/credit?cardNumber=${cardNumber}&branchId=${branchId}`;

        const {data} = await api.get(query);

        if (data && data.Data) {
            setCustomerCredit(data.Data);
            return true;
        } else {
            return false;
        }
    };


    const createSpend = async (data) => {
        await api.post("/Transaction/spend", data);
        toast.success("اعتبار با موفقیت خرج شد.")
    }

    const resetCustomerCredit = async () => {
        return null;
    }

    useEffect(() => {
        fetchAllBranches();
    }, []);

    const handleOpen = () => {
        setCredit("")
        setCustomerCredit(null);
        setPhoneNumber("");
        setSelectedBranchId("");
        setSelectedLine("");
        setLine("");
        setShowAdditionalFields(false);
        setCustomerCreditOpen(false);
        resetCustomerCredit();
        setOpen(!open);
    }
    const handleCreate = () => {
        setLoading(true);
        try {
            const request = {
                amount: credit,
                cardNumber: phoneNumber,
                branchId: selectedBranchId,
                lineId: line.id,
            };
            if (
                !line?.id ||
                !line?.title ||
                !request.amount || request.amount.length === 0 ||
                !request.cardNumber || request.cardNumber.trim() === "" ||
                !request.branchId
            ) {
                toast.error("تمامی موارد را وارد نمایید.");
                return;
            }
            createSpend(request);
            handleOpen(false)
        } finally {
            setLoading(false);
        }
    };

    const handleLineChange = (event) => {
        setSelectedLine(event.target.value);
        const selectedLineObject = lines.find((line) => line.id === event.target.value);
        setLine(selectedLineObject);
    };

    const fetchLines = async (branchId) => {
        const {data} = await api.get("/Line/dropdown/" + branchId);
        return data.Data.lines;
    }

    const handleSelectedBranchChange = async (e) => {
        setLoadingBranches(true);
        setSelectedBranchId(e.target.value);
        const fetchedLines = await fetchLines(e.target.value);
        setLines(fetchedLines);
        setShowAdditionalFields(true);
        setLoadingBranches(false);
    };
    const handleSearchButtonClick = async () => {
        setSearchLoading(true);
        try {
            const success = await fetchCustomerCredit(phoneNumber, selectedBranchId);
            if (success) {
                setCustomerCreditOpen(true);
            } else {
                +toast.error("کاربر یافت نشد. لطفاً شماره همراه و شعبه را بررسی کنید.");
            }
        } catch (error) {
            +toast.error("خطا در دریافت اطلاعات کاربر. لطفاً دوباره تلاش کنید.");
        } finally {
            setSearchLoading(false);
        }
    };


    return (
        <>
            <Button
                onClick={handleOpen}
                variant="outlined"
                color="error"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    borderRadius: "50px",
                    color: "red",
                    borderColor: "red",
                    fontWeight: "bold",
                    textTransform: "none",
                }}
            >
                <PlusCircleIcon className="w-5 h-5"/>
                <Typography>خرج کردن اعتبار</Typography>
            </Button>

            <Dialog open={open} onClose={handleOpen} maxWidth="lg" fullWidth>
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "BYekan",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        خرج کردن اعتبار
                    </Typography>
                    <IconButton
                        onClick={handleOpen}
                        sx={{
                            backgroundColor: "lightcoral",
                            padding: "6px",
                            "&:hover": {
                                backgroundColor: "darkred",
                                transform: "scale(1.1)",
                                transition: "transform 0.2s, background-color 0.3s",
                            },
                        }}
                    >
                        <XMarkIcon className="w-5 h-5" style={{color: "white"}}/>
                    </IconButton>
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Box>
                        <Grid
                            container
                            spacing={2}
                            alignItems="center"
                            justifyContent="space-between"
                            marginTop={2}
                        >
                            <Grid item xs={12} sm={6} md={4}>
                                <FormControl fullWidth error={!!errors.selectedBranchId}>
                                    <InputLabel>انتخاب شعبه</InputLabel>
                                    <Select
                                        value={selectedBranchId}
                                        onChange={handleSelectedBranchChange}
                                        label="انتخاب شعبه"
                                        sx={{textAlign: "right"}}
                                    >
                                        {loadingBranches ? (
                                            <MenuItem value="">
                                                <CircularProgress size={20}/>
                                            </MenuItem>
                                        ) : (branches.map((b) => (
                                                <MenuItem key={b.id} value={b.id}>
                                                    {b.title}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                    {errors.selectedBranchId && (
                                        <Typography color="error" variant="caption">
                                            {errors.selectedBranchId.message}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>

                        {
                            (loadingBranches || searchLoading) ? (
                                <Box display="flex" justifyContent="center" alignItems="center" py={2}>
                                    <CircularProgress size={30} color="primary"/>
                                </Box>
                            ) : (
                                showAdditionalFields && (
                                    <Box
                                        sx={{
                                            borderBottom: "1px solid gray",
                                            paddingBottom: 2,
                                        }}
                                    >
                                        <Grid
                                            container
                                            spacing={2}
                                            alignItems="center"
                                            justifyContent="space-between"
                                            marginTop={2}
                                        >
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField
                                                    value={phoneNumber}
                                                    onChange={(e) => {
                                                        setPhoneNumber(e.target.value);
                                                    }}
                                                    label="شماره همراه"
                                                    variant="outlined"
                                                    fullWidth
                                                />
                                            </Grid>

                                            <Grid item xs={12} sm={6} md={4}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{
                                                        width: "auto",
                                                        maxWidth: "200px",
                                                        height: "100%",
                                                        borderRadius: "50px",
                                                        padding: "10px 20px",
                                                    }}
                                                    onClick={handleSearchButtonClick}
                                                >
                                                    {searchLoading ? (
                                                        <CircularProgress size={24} color="inherit"/>
                                                    ) : (
                                                        "جست و جوی کاربر"
                                                    )}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )
                            )
                        }

                        {customerCreditOpen && (
                            <>
                                <Box
                                    sx={{
                                        borderBottom: "1px solid gray",
                                        paddingBottom: 2,
                                        marginTop: 2,
                                    }}>
                                    <Grid
                                        container
                                        spacing={1}
                                        sx={{
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                        }}
                                    >
                                        <Grid item xs={4}>
                                            <Grid container alignItems="center" justifyContent="flex-start"
                                                  sx={{gap: 0.5}}>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>نام
                                                        مشتری:</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        {customerCredit.name}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Grid container alignItems="center" justifyContent="flex-start"
                                                  sx={{gap: 0.5}}>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>شماره
                                                        همراه:</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        {customerCredit.userPhoneNumber}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Grid container alignItems="center" justifyContent="flex-start"
                                                  sx={{gap: 0.5}}>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>شماره
                                                        اشتراک:</Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        {customerCredit.subscriptionCode}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <Grid container alignItems="center" justifyContent="flex-start"
                                                  sx={{gap: 0.5}}>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        اعتبار:
                                                    </Typography>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        {customerCredit.credit}ریال
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box
                                    sx={{
                                        borderBottom: "1px solid gray",
                                        paddingBottom: 2,
                                    }}
                                >
                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                        marginTop={2}
                                    >
                                        <Grid item xs={12} sm={6} md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>
                                                    بخش
                                                    <span className={"text-Red mr-2"}>*</span>
                                                </InputLabel>
                                                <Select
                                                    label="بخش"
                                                    value={selectedLine}
                                                    onChange={handleLineChange}
                                                    sx={{textAlign: "right"}}
                                                >
                                                    {lines.map((b) => (
                                                        <MenuItem key={b.id} value={b.id}>
                                                            {b.title}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <PriceInput
                                                value={credit}
                                                onChange={(value) => setCredit(value)}
                                                label="اعتبار"
                                                error={!!errors.credit}
                                                helperText={errors.credit?.message}
                                                sx={{height: 40}}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </>
                        )}


                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        padding: "16px",
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleOpen}
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontFamily: "BYekan",
                            color: "gray",
                            borderColor: "gray",
                        }}
                    >
                        انصراف
                    </Button>
                    <Button
                        onClick={handleCreate}
                        variant="contained"
                        color="primary"
                        sx={{
                            textTransform: "none",
                            fontWeight: "bold",
                            fontFamily: "BYekan",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                        disabled={loading}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit"/>
                        ) : (
                            "ثبت و ذخیره تراکنش"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default AddSpend;
