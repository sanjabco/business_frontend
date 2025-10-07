import {useState, useEffect} from "react";
import {useForm, Controller} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Button,
    TextField,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Grid,
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress,
} from "@mui/material";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import api from "../../../Components/auth/axiosConfig.js"
import {toast} from "react-toastify";
import "react-multi-date-picker/styles/layouts/mobile.css";


const schema = yup.object({
    lastName: yup.string().required("وارد کردن نام خانوادگی الزامی است"),
    phoneNumber: yup.string().required("وارد کردن شماره همراه الزامی است"),
});

const EditCustomer = ({open, onClose, customer, onEditSuccess}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleClose = () => {
        onClose();
    };

    const {
        control,
        handleSubmit,
        formState: {errors},
        watch,
        setValue,
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            lastName: "",
            phoneNumber: "",
            firstName: "",
            gender: "",
            nationalCode: "",
            subscriptionCode: "",
            birthDate: "",
            isMarried: false,
            anniversary: "",
            job: "",
        },
    });

    useEffect(() => {
        if (customer) {
            reset({
                ...customer,
                isMarried: customer.isMarried ?? false,
            });
        }
    }, [customer, reset]);

    const convertFarsiToEnglishDigits = (persianString) => {
        if (!persianString || typeof persianString !== "string") {
            return persianString;
        }

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

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        const convertedBirthDate = convertFarsiToEnglishDigits(
            data.birthDate ? data.birthDate.toString() : ""
        );
        const convertedAnniversary = convertFarsiToEnglishDigits(
            data.anniversary ? data.anniversary.toString() : ""
        );

        const formattedData = {
            ...data,
            birthDate: convertedBirthDate,
            anniversary: convertedAnniversary,
        };

        try {
            await api.put(`/Customer/update/${customer.id}`, formattedData);
            toast.success("اطلاعات مشتری با موفقیت به‌روزرسانی شد.");
            onEditSuccess(formattedData);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <Dialog open={open && !!customer} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>ویرایش اطلاعات مشتری</DialogTitle>
            <DialogContent>
                <Box mt={2}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2}>
                            {/* Last Name */}
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            label="نام خانوادگی"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.lastName}
                                            helperText={errors.lastName?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            label="شماره همراه"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber?.message}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="firstName"
                                    control={control}
                                    render={({field}) => (
                                        <TextField {...field} label="نام" variant="outlined" fullWidth/>
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
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

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="nationalCode"
                                    control={control}
                                    render={({field}) => (
                                        <TextField {...field} label="کد ملی" variant="outlined" fullWidth/>
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

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="birthDate"
                                    control={control}
                                    render={({field: {value, onChange}}) => (
                                        <DatePicker
                                            value={value}
                                            onChange={onChange}
                                            calendar={persian}
                                            locale={persian_fa}
                                            className="rmdp-mobile"
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
                                                    value={value ? (value).toString("YYYY/MM/DD") : ""}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
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
                                                    if (!e.target.value) {
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

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="anniversary"
                                    control={control}
                                    render={({field: {value, onChange}}) => (
                                        <DatePicker
                                            value={value}
                                            onChange={onChange}
                                            calendar={persian}
                                            locale={persian_fa}
                                            className="rmdp-mobile"
                                            render={(valueProps, openCalendar) => (
                                                <TextField
                                                    {...valueProps}
                                                    label="سالگرد ازدواج"
                                                    variant="outlined"
                                                    fullWidth
                                                    disabled={!watch("isMarried")}
                                                    onClick={watch("isMarried") ? openCalendar : undefined}
                                                    inputProps={{
                                                        ...valueProps.inputProps,
                                                        readOnly: true,
                                                    }}
                                                    value={value ? (value).toString("YYYY/MM/DD") : ""}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="job"
                                    control={control}
                                    render={({field}) => (
                                        <TextField {...field} label="شغل" variant="outlined" fullWidth/>
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    انصراف
                </Button>
                <Button
                    onClick={handleSubmit(onSubmit)}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    startIcon={isSubmitting && <CircularProgress size={20} color="inherit"/>}
                >
                    {isSubmitting ? "در حال به‌روزرسانی..." : "ذخیره"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditCustomer;
