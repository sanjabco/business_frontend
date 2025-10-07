import React, {useEffect, useRef, useState} from "react";
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
    Grid, CircularProgress, ButtonGroup, Popper, Grow, Paper, ClickAwayListener, MenuList,
} from "@mui/material";
import {XMarkIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import PriceInput from "../../../Components/common/PriceInput.jsx";
import {Controller, useForm} from "react-hook-form";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import DatePicker from "react-multi-date-picker";
import DateObject from "react-date-object";
import AddIcon from "@mui/icons-material/Add.js";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";
import api from "../../../Components/auth/axiosConfig.js"
import AddNewCustomer from "./AddNewCustomer.jsx";

const schema = yup.object().shape({
    payFromCredit: yup.string().required("ورود اعتبار الزامی است"),
    price: yup.string().required("مقدار تراکنش الزامی است"),
    lineTitle: yup.string().required("انتخاب شعبه الرامی است"),
    description: yup.string(),
    paymentMethod: yup.string(),
    selectedBranchId: yup.string().required("انتخاب شعبه الرامی است"),
});

const AddTransaction = ({refreshTable}) => {
    const [open, setOpen] = useState(false);
    const [line, setLine] = useState("");
    const [payment, setPayment] = useState("");
    const [phoneNumber, setPhoneNumber] = useState('');
    const [transactionPrice, setTransactionPrice] = useState('');
    const [creditPrice, setCreditPrice] = useState("0");
    const [description, setDescription] = useState('');
    const [selectedBranchId, setSelectedBranchId] = useState('');
    const [selectedLine, setSelectedLine] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [posName, setPosName] = useState("");
    const [cardReceiptNumber, setCardReceiptNumber] = useState("");
    const [chequeReceiptNumber, setCheckReceiptNumber] = useState("");
    const [chequePrice, setChequePrice] = useState("");
    const [chequeBank, setChequeBank] = useState("");
    const [chequeOwnerName, setChequeOwnerName] = useState("");
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const [branches, setBranches] = useState([]);
    const [lines, setLines] = useState([]);
    const [customerCredit, setCustomerCredit] = useState([]);
    const [customerCreditOpen, setCustomerCreditOpen] = useState(false);
    const totalCredit = transactions.reduce((sum, transaction) => sum + Number(transaction.payFromCredit || 0), 0);
    const totalPrice = transactions.reduce((sum, transaction) => sum + Number(transaction.price || 0), 0);
    const totalCreditSeparated = new Intl.NumberFormat().format(totalCredit);
    const totalPriceSeparated = new Intl.NumberFormat().format(totalPrice);
    const priceDiff = totalPrice - totalCredit;
    const priceDiffSeparated = new Intl.NumberFormat().format(priceDiff);
    const paymentPrice = new Intl.NumberFormat().format(transactionPrice - creditPrice);
    const chequePriceSeparated = new Intl.NumberFormat().format(chequePrice);
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [openSplit, setOpenSplit] = useState(false);
    const anchorRef = useRef(null);
    const [showAddCustomerPrompt, setShowAddCustomerPrompt] = useState(false);
    const [tempPhoneNumber, setTempPhoneNumber] = useState("");
    const [AddNewCustomerOpen, setAddNewCustomerOpen] = useState("");

    const options = [
        {label: "ثبت و ذخیره تراکنش", action: () => handleCreate(false)},
        {
            label: "ثبت با پیامک", action: () => {
                handleCreate(true)
            }
        },
    ];

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpenSplit(false);
    };

    const handleToggle = () => {
        setOpenSplit((prevOpen) => !prevOpen);
    };

    const handleCloseSplit = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenSplit(false);
    };

    const handleMainButtonClick = () => {
        options[selectedIndex].action();
    };

    const {
        control,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const addTransaction = () => {
        if (
            !line?.id ||
            !line?.title ||
            !transactionPrice ||
            transactionPrice <= 0 ||
            !payment
        ) {
            toast.error("تمامی موارد الزامی را وارد نمایید.");
            return;
        }

        if (payment === "پوز" && !posName) {
            toast.error("نام دستگاه پوز را وارد کنید.");
            return;
        }

        if (payment === "کارت" && !cardReceiptNumber) {
            toast.error("شماره رسید کارت را وارد کنید.");
            return;
        }

        if (payment === "چک" && (!chequeReceiptNumber || !chequePriceSeparated || !chequeBank || !chequeOwnerName)) {
            toast.error("تمامی اطلاعات چک را وارد کنید.");
            return;
        }

        const newTransaction = {
            lineId: line.id,
            lineTitle: line.title,
            price: transactionPrice,
            payFromCredit: creditPrice || 0,
            description: description || "",
        };

        switch (payment) {
            case "پوز":
                newTransaction.PaymentMethod = `${payment} - ${posName}`;
                break;
            case "کارت":
                newTransaction.PaymentMethod = `${payment} - ${cardReceiptNumber}`;
                break;
            case "چک":
                newTransaction.PaymentMethod = `${payment} - ${chequeReceiptNumber} - ${chequePriceSeparated} - ${chequeBank} - ${chequeOwnerName}`;
                break;
            case "نقد":
            case "بدهی":
                newTransaction.PaymentMethod = payment;
                break;
        }

        setTransactions([...transactions, newTransaction]);
        toast.success("تراکنش با موفقیت به لیست اضافه شد!");
    };


    const fetchBranches = async () => {
        const {data} = await api.get("/Branch");
        setBranches(data.Data.branches);
    }

    const fetchLines = async (branchId) => {
        const {data} = await api.get("/Line/dropdown/" + branchId);
        return data.Data.lines;
    }

    const resetCustomerCredit = async () => {
        const result = await new Promise((resolve) => {
            setTimeout(() => resolve(null), 1000);
        });
        return result;
    }

    const fetchCustomerCredits = async (cardNumber, branchId) => {
        const query = `/Customer/credit?cardNumber=${cardNumber}&branchId=${branchId}`;
        const response = await api.get(query);

        if (response.status === 200) {
            setCustomerCredit(response.data.Data);
            return true;
        } else {
            return false;
        }
    };

    const createTransaction = async (data) => {
        await api.post("/transaction", data);
        toast.success("تراکنش با موفقیت ایجاد شد.")
    }

    useEffect(() => {
        fetchBranches()
    }, []);

    const handleOpen = () => {
        setLine("");
        setPayment("");
        setPhoneNumber("");
        setTransactionPrice("");
        setCreditPrice("");
        setDescription("");
        setSelectedBranchId("");
        setSelectedLine("");
        setTransactions([]);
        setPosName("");
        setChequeOwnerName("");
        setChequePrice("");
        setChequeBank("");
        setCustomerCreditOpen(false);
        setShowAdditionalFields(false);
        resetCustomerCredit()
        setOpen(!open);
    }
    const handleCreate = async (shouldSendMessage) => {
        const request = {
            cashBackDto: transactions,
            cardNumber: phoneNumber,
            shouldSendMessage: shouldSendMessage,
            branchId: selectedBranchId,
        };

        if (
            !request.cashBackDto || request.cashBackDto.length === 0 ||
            !request.cardNumber || request.cardNumber.trim() === "" ||
            !request.branchId
        ) {
            toast.error("تمامی موارد را وارد نمایید.");
            return;
        }

        await createTransaction(request);
        refreshTable();
        handleOpen();
    };


    const handleSelectedBranchChange = async (e) => {
        setLoadingBranches(true);
        const branchId = e.target.value;
        setSelectedBranchId(branchId);
        const fetchedLines = await fetchLines(branchId);
        setLines(fetchedLines);
        setShowAdditionalFields(true);
        setLoadingBranches(false);
    };
    const handleLineChange = (event) => {
        setSelectedLine(event.target.value);
        const selectedLineObject = lines.find((line) => line.id === event.target.value);
        setLine(selectedLineObject);
    };
    const handlePaymentChange = (event) => {
        setPayment(event.target.value);
    };

    const handlePosChange = (event) => {
        setPosName(event.target.value);
        console.log(posName)
    };

    const handleSearchButtonClick = async () => {
        setSearchLoading(true);
        try {
            const success = await fetchCustomerCredits(phoneNumber, selectedBranchId);
            if (success) {
                setCustomerCreditOpen(true);
            }
        } catch {
            setTempPhoneNumber(phoneNumber);
            setShowAddCustomerPrompt(true);
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
                <Typography>ثبت تراکنش جدید</Typography>
            </Button>

            <Dialog open={open} onClose={handleOpen} maxWidth="lg" fullWidth disableEnforceFocus
                    disableAutoFocus>
                <DialogTitle
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "BYekan",
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        ثبت تراکنش جدید
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
                                <FormControl fullWidth required error={!!errors.selectedBranchId}>
                                    <InputLabel>انتخاب شعبه</InputLabel>
                                    <Controller
                                        name="selectedBranchId"
                                        control={control}
                                        render={({field}) => (
                                            <Select
                                                {...field}
                                                label="انتخاب شعبه"
                                                onChange={handleSelectedBranchChange}
                                                sx={{textAlign: 'right'}}
                                            >
                                                {branches.map((b) => (
                                                    <MenuItem key={b.id} value={b.id}>
                                                        {b.title}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        )}
                                    />
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
                                        marginTop: 2,
                                    }}
                                >
                                    <Grid container spacing={2}
                                          sx={{flexDirection: "row", justifyContent: "flex-start"}}>
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
                                                value={transactionPrice}
                                                onChange={(newValue) => setTransactionPrice(newValue)} // Update state with the numeric value
                                                label={<><span>مبلغ تراکنش</span><span
                                                    className={"text-Red mr-2"}>*</span></>}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <PriceInput
                                                value={creditPrice || "0"}
                                                onChange={(newValue) => {
                                                    const numericValue = Number(newValue) || 0; // Convert input to a number or fallback to 0
                                                    console.log("New creditPrice value:", numericValue); // Debug the value being set
                                                    setCreditPrice(numericValue);
                                                }}
                                                label={<><span>مبلغ اعتبار</span><span
                                                    className={"text-Red mr-2"}>*</span></>}
                                                fullWidth
                                                error={false}
                                                helperText=""
                                            />


                                            {line && (
                                                <Typography variant="body2" color="red" sx={{marginTop: 1}}>
                                                    حداکثر مبلغ استفاده از اعتبار{" "}
                                                    <span
                                                        className="text-Green">{new Intl.NumberFormat().format(line.maxPayAmountByCashBack)}</span> ریال
                                                    می‌باشد.
                                                </Typography>
                                            )}
                                        </Grid>

                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField value={description}
                                                       onChange={(e) => {
                                                           setDescription(e.target.value);
                                                       }} label="توضیحات" fullWidth/>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={4}>
                                            <FormControl fullWidth>
                                                <InputLabel>
                                                    نوع پرداخت
                                                    <span className={"text-Red mr-2"}>*</span>
                                                </InputLabel>
                                                <Select
                                                    value={payment}
                                                    onChange={handlePaymentChange}
                                                    label="نوع پرداخت"
                                                    sx={{textAlign: "right"}}
                                                >
                                                    <MenuItem value="نقد">نقدی</MenuItem>
                                                    <MenuItem value="پوز">پوز</MenuItem>
                                                    <MenuItem value="کارت">کارت به کارت</MenuItem>
                                                    <MenuItem value="چک">چک</MenuItem>
                                                    <MenuItem value="بدهی">بدهی</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {payment === `پوز` && (
                                            <Grid item xs={12} sm={6} md={4}>
                                                <FormControl fullWidth>
                                                    <InputLabel>نام پوز</InputLabel>
                                                    <Select
                                                        value={posName}
                                                        onChange={handlePosChange}
                                                        label="نام پوز"
                                                        sx={{textAlign: "right"}}>
                                                        <MenuItem value="پوز آبی">پوز آبی</MenuItem>
                                                        <MenuItem value="پوز قرمز">پوز قرمز</MenuItem>
                                                        <MenuItem value="پوز زرد">پوز زرد</MenuItem>
                                                        <MenuItem value="پوز سبز">پوز سبز</MenuItem>
                                                        <MenuItem value="پوز سفید">پوز سفید</MenuItem>
                                                        <MenuItem value="دیگر پوز ها">دیگر پوزها</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        )}
                                        {payment === "کارت" && (
                                            <Grid item xs={12} sm={6} md={4}>
                                                <TextField onChange={(e) => {
                                                    setCardReceiptNumber(e.target.value)
                                                }} label="شماره رسید" fullWidth/>
                                            </Grid>
                                        )}
                                        {payment === "چک" && (
                                            <>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Controller
                                                        name="chequeReceiptNumber"
                                                        control={control}

                                                        render={({field: {value, onChange}}) => (
                                                            <DatePicker
                                                                value={value}
                                                                onChange={(newValue) => {
                                                                    onChange(newValue);

                                                                    setCheckReceiptNumber(newValue ? newValue.format("YYYY/MM/DD") : "");
                                                                }}
                                                                calendar={persian}
                                                                locale={persian_fa}
                                                                minDate={new DateObject({
                                                                    calendar: persian,
                                                                    locale: persian_fa
                                                                })}
                                                                render={(valueProps, openCalendar) => (
                                                                    <TextField
                                                                        {...valueProps}
                                                                        label={
                                                                            <>
                                                                                <span>تاریخ سررسید</span>
                                                                                <span className="text-Red mr-2">*</span>
                                                                            </>
                                                                        }
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        onClick={openCalendar}
                                                                        inputProps={{
                                                                            ...valueProps.inputProps,
                                                                            readOnly: true,
                                                                        }}
                                                                        value={value ? value.format("YYYY/MM/DD") : ""}
                                                                    />
                                                                )}
                                                            />
                                                        )}
                                                    />

                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Controller
                                                        name="chequePrice"
                                                        control={control}
                                                        rules={{
                                                            required: "مبلغ چک الزامی است.",
                                                        }}
                                                        render={({field}) => (
                                                            <PriceInput
                                                                value={field.value}
                                                                onChange={(newValue) => {
                                                                    const numericValue = Number(newValue); // Ensure numeric input
                                                                    field.onChange(numericValue);
                                                                    setChequePrice(numericValue);
                                                                }}
                                                                label={
                                                                    <>
                                                                        <span>مبلغ چک</span>
                                                                        <span className={"text-Red mr-2"}>*</span>
                                                                    </>
                                                                }
                                                                fullWidth
                                                                error={false}
                                                                helperText=""
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Controller
                                                        name="chequeBank"
                                                        control={control}
                                                        rules={{
                                                            required: "اسم بانک الزامی است.",
                                                        }}
                                                        render={({field}) => (
                                                            <TextField
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    field.onChange(newValue);
                                                                    setChequeBank(newValue);
                                                                }}
                                                                label={
                                                                    <>
                                                                        <span>بانک</span>
                                                                        <span className="text-Red mr-2">*</span>
                                                                    </>
                                                                }
                                                                fullWidth
                                                            />
                                                        )}
                                                    />

                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4}>
                                                    <Controller
                                                        name="chequeOwnerName"
                                                        control={control}
                                                        rules={{
                                                            required: "نام صاحب حساب الزامی است.",
                                                        }}
                                                        render={({field}) => (
                                                            <TextField
                                                                {...field}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    field.onChange(newValue);
                                                                    setChequeOwnerName(newValue);
                                                                }}
                                                                label={
                                                                    <>
                                                                        <span>نام صاحب حساب</span>
                                                                        <span className={"text-Red mr-2"}>*</span>
                                                                    </>
                                                                }
                                                                fullWidth
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </>
                                        )}

                                        <Grid item xs={12} sm={6} md={4}>
                                            <Grid container alignItems="start" justifyContent="center" sx={{gap: 0.5}}>
                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                    مبلغ پرداختی:
                                                </Typography>
                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                    {paymentPrice}ریال
                                                </Typography>
                                            </Grid>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button
                                                variant="outlined"
                                                onClick={addTransaction}
                                                startIcon={<AddIcon/>}
                                                sx={{
                                                    textTransform: "none",
                                                    fontWeight: "bold",
                                                    fontFamily: "BYekan",
                                                    color: "gray",
                                                    borderColor: "gray",
                                                }}
                                            >
                                                افزودن تراکنش جدید
                                            </Button>
                                        </Grid>


                                        <Grid item xs={12}>
                                            <Box
                                                sx={{
                                                    borderBottom: "1px solid gray",
                                                    paddingBottom: 2,
                                                    marginTop: 2,
                                                }}
                                            >
                                                <Grid container spacing={1}
                                                      sx={{flexDirection: "row", justifyContent: "flex-start"}}>
                                                    {transactions.map((e) => (
                                                        <React.Fragment key={e.id}>
                                                            <Grid item xs={12} sm={6} md={4} sx={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}>
                                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                                    نام بخش:
                                                                </Typography>
                                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                                    {e.lineTitle}
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4}
                                                                  sx={{
                                                                      display: "flex",
                                                                      flexDirection: "row",
                                                                      alignItems: "center",
                                                                      gap: 1,
                                                                  }}>
                                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                                    مبلغ تراکنش:
                                                                </Typography>
                                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                                    {new Intl.NumberFormat().format(e.price)} ریال
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs={12} sm={6} md={4} sx={{
                                                                display: "flex",
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                gap: 1,
                                                            }}>
                                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                                    مبلغ اعتبار:
                                                                </Typography>
                                                                <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                                    {new Intl.NumberFormat().format(e.payFromCredit)} ریال
                                                                </Typography>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))}
                                                </Grid>
                                            </Box>

                                            <Grid container spacing={1} marginTop={1}
                                                  sx={{flexDirection: "row", justifyContent: "flex-start"}}>
                                                <Grid item xs={12} sm={6} md={4} sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        مبلغ کل تراکنش:
                                                    </Typography>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        {totalPriceSeparated} ریال
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        مبلغ کل اعتبار:
                                                    </Typography>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        {totalCreditSeparated} ریال
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={4} sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 1,
                                                }}>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        ما به تفاوت:
                                                    </Typography>
                                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                                        {priceDiffSeparated} ریال
                                                    </Typography>
                                                </Grid>
                                            </Grid>
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
                    <ButtonGroup variant="contained" ref={anchorRef} color="primary">
                        <Button onClick={handleMainButtonClick} variant="contained"
                                color="primary"
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    fontFamily: "BYekan",
                                }}
                        >
                            {options[selectedIndex].label}
                        </Button>
                        <Button
                            color="primary"
                            size="small"
                            onClick={handleToggle}
                        >
                            ▼
                        </Button>
                    </ButtonGroup>
                    <Popper open={openSplit} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                        {({TransitionProps, placement}) => (
                            <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                        placement === "bottom" ? "center top" : "center bottom",
                                }}
                            >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleCloseSplit}>
                                        <MenuList id="split-button-menu">
                                            {options.map((option, index) => (
                                                <MenuItem
                                                    key={option.label}
                                                    selected={index === selectedIndex}
                                                    onClick={(event) => handleMenuItemClick(event, index)}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </DialogActions>
                <Dialog
                    open={showAddCustomerPrompt}
                    onClose={() => setShowAddCustomerPrompt(false)}
                    disablePortal
                    sx={{zIndex: (theme) => theme.zIndex.modal + 1}}
                >
                    <DialogTitle>کاربر یافت نشد</DialogTitle>
                    <DialogContent>
                        شماره {tempPhoneNumber} یافت نشد. آیا مایل به افزودن این شماره هستید؟
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowAddCustomerPrompt(false)}>خیر</Button>
                        <Button
                            onClick={() => {
                                setShowAddCustomerPrompt(false);
                                setPhoneNumber(tempPhoneNumber);
                                setAddNewCustomerOpen(true);
                            }}
                        >
                            بله، افزودن
                        </Button>
                    </DialogActions>
                </Dialog>
            </Dialog>
            <AddNewCustomer
                open={AddNewCustomerOpen}
                onClose={() => setAddNewCustomerOpen(false)}
                defaultPhoneNumber={tempPhoneNumber}
            />
        </>
    );
}

export default AddTransaction;
