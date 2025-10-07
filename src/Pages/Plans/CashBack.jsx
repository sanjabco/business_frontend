import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import {FaMedal} from "react-icons/fa";
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import persian from "react-date-object/calendars/persian";
import {useEffect, useState} from "react";
import DatePicker from "react-multi-date-picker";
import CashbackCard from "./components/CashBackCard.jsx";
import {useNavigate} from "react-router-dom";
import persian_fa from "react-date-object/locales/persian_fa";
import api from "../../Components/auth/axiosConfig.js"
import PriceInput from "../../Components/common/PriceInput.jsx";
import {toast} from "react-toastify";

const schema = yup.object().shape({
    maxCashBackCreditPay: yup.string().required("حداکثر مبلغ کشبک الزامی است"),
    cashBackPercentage: yup.number()
        .typeError("فقط عدد وارد کنید")
        .min(0, "حداقل مقدار باید ۱ باشد")
        .max(100, "حداکثر مقدار باید 100 باشد")
        .required("درصد کشبک الزامی است"),
    ExpirationInDays: yup
        .number()
        .typeError("فقط عدد وارد کنید")
        .positive("عدد باید مثبت باشد")
        .required("مقدار انقضا الزامی است"),
    branchSharePercentage: yup.string(),
    fromDate: yup.string(),
    toDate: yup.string(),
});

const CashBack = () => {
    const [lines, setLines] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cashbacks, setCashbacks] = useState([]);
    const [branches, setBranches] = useState([]);
    const [cashbackLoading, setCashbackLoading] = useState(true);
    const navigate = useNavigate();

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
            ExpirationInDays: null,
            lineId: 0,
        },
    });

    const convertFarsiToEnglishDigits = (persianString) => {
        const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

        return persianString.split('').map(char => {
            const index = persianDigits.indexOf(char);
            return index !== -1 ? englishDigits[index] : char;
        }).join('');
    };

    const handleBranchChange = (e) => {
        const selectedBranchKey = e.target.value;
        setValue("branchId", selectedBranchKey);
        const selectedBranch = branches.find((branch) => branch.id === selectedBranchKey);
        if (selectedBranch) {
            setLines(selectedBranch.lines);
        } else {
            setLines([]);
        }
    };

    const fetchCashbacks = async () => {
        setCashbackLoading(true);
        try {
            const response = await api.get("/cash-back");
            setCashbacks(response.data.Data.cashBackModel);
        } finally {
            setCashbackLoading(false);
        }
    };

    const onSubmit = async (data) => {
        const convertedData = {...data};
        if (convertedData.fromDate) {
            convertedData.fromDate = convertFarsiToEnglishDigits(convertedData.fromDate);
        }
        if (convertedData.toDate) {
            convertedData.toDate = convertFarsiToEnglishDigits(convertedData.toDate);
        }

        setLoading(true);
        try {
            await api.post("/cash-back", convertedData);
            toast.success("کشبک با موفقیت اضافه شد.");
        } finally {
            fetchCashbacks();
            setLoading(false);
            navigate("/plans/cashback");
        }
    };

    const fetchBranches = async () => {
        const response = await api.get("/Branch");
        setBranches(response.data.Data.branches);
    };

    useEffect(() => {
        fetchCashbacks();
        fetchBranches();
    }, []);

    return (
        <>
            <Box display="flex" alignItems="center" gap={2} borderTop={1} borderColor="gray" pt={2}>
                <FaMedal style={{fontSize: "1.5rem", color: "gray"}}/>
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        طرح کش بک
                    </Typography>
                    <Typography variant="body2" color="Gray">
                        به کاربران هر بخشی که میخواهید کش بک هدیه بدید
                    </Typography>
                </Box>
            </Box>
            <Box mt={4} display="flex" flexDirection={{xs: "column", lg: "row"}} gap={4}>
                <Box
                    flex={1}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={{flexGrow: 1}}
                    className={"h-[500px] overflow-y-auto"}
                >
                    {cashbackLoading ? (
                        <CircularProgress/>
                    ) : cashbacks.length === 0 ? (
                        <Typography variant="h6" color="gray">
                            هیچ کشبکی موجود نیست
                        </Typography>
                    ) : (
                        cashbacks.map((c) => (
                            <div className={"min-h-fit"}>
                                <CashbackCard
                                    key={c.id}
                                    id={c.id}
                                    section={c.lineTitle}
                                    branch={c.branchTitle}
                                    branchSharePercentage={c.branchSharePercentage}
                                    ExpirationInDays={c.expirationInDays}
                                    percentage={c.cashBackPercentage}
                                    maxAmount={c.maxCashBackCreditPay}
                                    startDate={c.fromDate}
                                    endDate={c.toDate}
                                    onActionComplete={fetchCashbacks}
                                />
                            </div>
                        ))
                    )}
                </Box>
                <Box
                    flex={1}
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    gap={2}
                    display="flex"
                    flexDirection="column"
                    sx={{flexGrow: 1}}
                    className={"h-fit"}
                >
                    <Typography variant="h6" fontWeight="bold">
                        طرح جدید
                    </Typography>
                    <Box flex={1}>
                        <FormControl fullWidth>
                            <InputLabel>شعبه</InputLabel>
                            <Select
                                label="شعبه"
                                value={watch("branchId") || ""}
                                onChange={handleBranchChange}
                            >
                                {branches.map((b) => (
                                    <MenuItem key={b.id} value={b.id}>
                                        {b.title}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box flex={1}>
                        <Controller
                            name="lineId"
                            control={control}
                            render={({field}) => (
                                <FormControl fullWidth disabled={lines.length === 0}>
                                    <InputLabel>بخش</InputLabel>
                                    <Select {...field} label="بخش" value={field.value || ""}>
                                        {lines.length > 0 ? (
                                            lines.map((line) => (
                                                <MenuItem key={line.id} value={line.id}>
                                                    {line.title}
                                                </MenuItem>
                                            ))
                                        ) : (
                                            <MenuItem disabled value="">
                                                هیچ بخشی وجود ندارد
                                            </MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </Box>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="maxCashBackCreditPay"
                                control={control}
                                render={({field}) => (
                                    <PriceInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        label="حداکثر مبلغ کشبک"
                                        error={!!errors.maxPayAmountByCashBack}
                                        helperText={errors.maxPayAmountByCashBack?.message}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="cashBackPercentage"
                                control={control}
                                render={({field}) => (
                                    <Box>
                                        <TextField
                                            label="درصد کشبک"
                                            fullWidth
                                            {...field}
                                            error={!!errors.cashBackPercentage}
                                            helperText={errors.cashBackPercentage?.message}
                                        />
                                        <Typography variant="caption" color="lightsGray" sx={{mt: 1, display: "block"}}>
                                            عددی که نشان می دهد چند درصد از فروش به عنوان کش بک برای حساب مشتری شارژ می
                                            شود.
                                        </Typography>
                                    </Box>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="branchSharePercentage"
                                control={control}
                                render={({field}) => (
                                    <Box>
                                        <TextField label="درصد مشارکت شعبه" fullWidth {...field} />
                                    </Box>
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="ExpirationInDays"
                                control={control}
                                render={({field}) => (
                                    <Box>
                                        <TextField
                                            label="انقضا (روز)"
                                            fullWidth
                                            {...field}
                                            error={!!errors.ExpirationInDays}
                                            helperText={errors.ExpirationInDays?.message}
                                        />
                                    </Box>
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="fromDate"
                                control={control}
                                render={({field: {value, onChange}}) => (
                                    <DatePicker
                                        value={value}
                                        onChange={onChange}
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
                                                value={value ? value.format("YYYY/MM/DD") : ""}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="toDate"
                                control={control}
                                render={({field: {value, onChange}}) => (
                                    <DatePicker
                                        value={value}
                                        onChange={onChange}
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
                                                value={value ? value.format("YYYY/MM/DD") : ""}
                                            />
                                        )}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? <CircularProgress size={24} color="inherit"/> : "افزودن طرح"}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default CashBack;
