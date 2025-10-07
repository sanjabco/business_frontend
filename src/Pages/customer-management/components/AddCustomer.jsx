import {useState, useEffect} from "react";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useNavigate} from "react-router-dom";
import {
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
    Box,
    Typography,
} from "@mui/material";
import PageHeaders from "../../../Components/common/PageHeaders";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import {toast} from "react-toastify";
import api from "../../../Components/auth/axiosConfig.js"
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

const schema = yup.object().shape({
    firstName: yup.string(),
    lastName: yup.string().required("وارد کردن نام خانوادگی الزامی است"),
    phoneNumber: yup.string().required("وارد کردن شماره همراه الزامی است"),
    birthDate: yup.string(),
    anniversary: yup.string(),
    job: yup.string(),
    isMarried: yup.boolean(),
    nationalCode: yup.string(),
    subscriptionCode: yup.string(),
    gender: yup.string(),
});

const AddCustomer = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
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
            firstName: "",
            lastName: "",
            phoneNumber: "",
            subscriptionCode: "",
            gender: "",
            nationalCode: "",
            birthDate: "",
            isMarried: "false",
            anniversary: "",
            job: "",
        },
    });

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
    watch("state");
    axios.create({
        baseURL: "https://iran-locations-api.ir",
    });
    const onSubmit = async (data) => {
        setIsSubmitting(true);
        const convertedData = {...data};
        if (convertedData.fromDate) {
            convertedData.fromDate = convertFarsiToEnglishDigits(convertedData.fromDate);
        }
        if (convertedData.toDate) {
            convertedData.toDate = convertFarsiToEnglishDigits(convertedData.toDate);
        }

        try {
            await api.post("/customer", convertedData);
            toast.success("مشتری با موفقیت ایجاد شد.");
            navigate("/customers");
        } finally {
            setIsSubmitting(false); // Reset loading state after submission
        }
    };

    return (
        <>
            <PageHeaders current="افزودن مشتری"/>
            <Box mt={3} borderBottom={1} borderColor="divider">
                <Typography variant="h5" fontWeight="bold" display="flex" alignItems="center">
                    افزودن مشتری
                </Typography>
            </Box>
            <Box mt={3} bgcolor="white" p={3} borderRadius={2}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="نام"
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.firstName}
                                        helperText={errors.firstName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="lastName"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={<><span>نام خانوادگی</span><span className={"text-Red mr-2"}>*</span></>}
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.lastName}
                                        helperText={errors.lastName?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label={<><span>شماره همراه</span><span className={"text-Red mr-2"}>*</span></>}
                                        variant="outlined"
                                        fullWidth
                                        error={!!errors.phoneNumber}
                                        helperText={errors.phoneNumber?.message}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="subscriptionCode"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="شماره اشتراک"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="gender"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <InputLabel>جنسیت</InputLabel>
                                        <Select {...field}>
                                            <MenuItem value="man">مرد</MenuItem>
                                            <MenuItem value="woman">زن</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="nationalCode"
                                control={control}
                                render={({field}) => (
                                    <TextField
                                        {...field}
                                        label="کد ملی"
                                        variant="outlined"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="birthDate"
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
                                                label="تاریخ تولد"
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
                                name="isMarried"
                                control={control}
                                render={({field}) => (
                                    <FormControl fullWidth>
                                        <InputLabel>وضعیت تاهل</InputLabel>
                                        <Select
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                if (e.target.value !== true) {
                                                    setValue("anniversary", null);
                                                }
                                            }}
                                        >
                                            <MenuItem value={true}>متاهل</MenuItem>
                                            <MenuItem value={false}>مجرد</MenuItem>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="anniversary"
                                control={control}
                                disabled={!watch("isMarried")}
                                render={({field: {value, onChange}}) => (
                                    <DatePicker
                                        value={value}
                                        onChange={onChange}
                                        calendar={persian}
                                        locale={persian_fa}
                                        render={(valueProps, openCalendar) => (
                                            <TextField
                                                {...valueProps}
                                                label="سالگرد ازدواج"
                                                variant="outlined"
                                                disabled={!watch("isMarried")}
                                                fullWidth
                                                onClick={watch("isMarried") ? openCalendar : undefined}
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
                                name="job"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field} label="شغل" variant="outlined" fullWidth/>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={isSubmitting}
                                startIcon={isSubmitting && <CircularProgress size={20} color="inherit"/>}
                            >
                                {isSubmitting ? "در حال ارسال..." : "افزودن مشتری"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </>
    );
};

export default AddCustomer;
