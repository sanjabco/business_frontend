import {
    Box,
    Button, CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {FaMedal} from "react-icons/fa";
import * as yup from "yup";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {useEffect, useState} from "react";
import DatePicker from "react-multi-date-picker";
import {useNavigate} from "react-router-dom";
import persian_fa from "react-date-object/locales/persian_fa";
import CreditPlanCard from "./components/CreditPlanCard.jsx";
import PriceInput from "../../Components/common/PriceInput.jsx";
import api from "../../Components/auth/axiosConfig.js"
import persian from "react-date-object/calendars/persian";
import {toast} from "react-toastify";

const schema = yup.object().shape({
    title: yup.string().required("عنوان ضروری است"),
    credit: yup.number().required("مبلغ اعتبار ضروری است").min(1, "مبلغ اعتبار باید بیشتر از صفر باشد"),
    branchSharePercentage: yup.number().required("درصد مشارکت شعبه ضروری است").min(1, "مقدار درصد باید بیشتر از صفر باشد"),
    fromDate: yup.string().required("تاریخ شروع ضروری است"),
    toDate: yup.string().required("تاریخ پایان ضروری است"),
});

const CreditPlan = () => {
    const [lines, setLines] = useState([]);
    const [branches, setBranches] = useState([]);
    const [creditPlans, setCreditPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creditplanLoading, setCreditplanLoading] = useState(true);
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
            title: "",
            credit: "",
            branchSharePercentage: "",
            fromDate: null,
            toDate: null,
            branchId: 0,
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
            await api.post("/credit-event", convertedData);
            fetchCreditPlans();
            toast.success("طرح اعتباری با موفقیت اضافه شد.");
        } finally {
            setLoading(false);
            navigate("/plans/credit-plan");
        }
    };

    const fetchCreditPlans = async () => {
        setCreditplanLoading(true);
        try {
            const response = await api.get("/credit-event");
            setCreditPlans(response.data.Data.items);
        } finally {
            setCreditplanLoading(false);
        }
    };

    const fetchBranches = async () => {
        const response = await api.get("/Branch");
        setBranches(response.data.Data.branches);
    };

    useEffect(() => {
        fetchBranches();
        fetchCreditPlans();
    }, []);

    return (
        <>
            <Box display="flex" alignItems="center" gap={2} borderTop={1} borderColor="gray" pt={2}>
                <FaMedal style={{fontSize: "1.5rem", color: "gray"}}/>
                <Box>
                    <Typography variant="h6" fontWeight="bold">
                        طرح اعتباری
                    </Typography>
                    <Typography variant="body2" color="Gray">
                        به کاربران هر بخشی که میخواهید طرح اعتباری هدیه بدید
                    </Typography>
                </Box>
            </Box>
            <Box mt={4} display="flex" flexDirection={{xs: "column", lg: "row"}} gap={4}>
                <Box flex={1} display="flex" flexDirection="column" gap={2}>
                    {creditplanLoading ? (
                        <CircularProgress/>
                    ) : creditPlans.length === 0 ? (
                        <Typography variant="h6" color="gray">
                            هیچ کشبکی موجود نیست
                        </Typography>
                    ) : (
                        creditPlans.map((c) => (
                            <CreditPlanCard
                                key={c.Id}
                                id={c.id}
                                section={c.branchTitle}
                                branchSharePercentage={c.branchSharePercentage}
                                credit={c.credit}
                                title={c.title}
                                startDate={c.fromDate}
                                endDate={c.toDate}
                                onActionComplete={fetchCreditPlans}
                            />
                        ))
                    )}
                </Box>
                <Box flex={1} component="form" onSubmit={handleSubmit(onSubmit)} gap={2} display="flex"
                     className={"h-fit"}
                     flexDirection="column">
                    <Typography variant="h6" fontWeight="bold">
                        طرح جدید
                    </Typography>

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

                    <Grid item xs={12} sm={6}>
                        <Controller
                            name="title"
                            control={control}
                            render={({field}) => (
                                <TextField
                                    label="عنوان"
                                    fullWidth
                                    {...field}
                                    error={!!errors.title}
                                    helperText={errors.title ? errors.title.message : ''}
                                />
                            )}
                        />
                    </Grid>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="credit"
                                control={control}
                                render={({field}) => (
                                    <PriceInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        label="مبلغ اعتبار"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="branchSharePercentage"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        label="درصد مشارکت شعبه"
                                        fullWidth
                                        {...field}
                                        error={!!errors.branchSharePercentage}
                                        helperText={errors.branchSharePercentage ? errors.branchSharePercentage.message : ''}
                                    />
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
                        {loading ? "در حال بارگذاری..." : "افزودن طرح"}
                    </Button>
                </Box>
            </Box>
        </>
    );
};

export default CreditPlan;
