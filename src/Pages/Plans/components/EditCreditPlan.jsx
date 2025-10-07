import {useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Tooltip,
    Grid, TextField, CircularProgress, Backdrop,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import EditIcon from "@mui/icons-material/Edit";
import {toast} from "react-toastify";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import "react-multi-date-picker/styles/layouts/mobile.css";
import PriceInput from "../../../Components/common/PriceInput.jsx";
import api from "../../../Components/auth/axiosConfig.js"

const schema = yup.object().shape({
    section: yup.string(),
    branchSharePercentage: yup
        .number()
        .required("درصد مشارکت شعبه الزامی است")
        .min(0, "حداقل مقدار 0 است")
        .max(100, "حداکثر مقدار 100 است"),
    title: yup
        .string()
        .required("درصد کش بک الزامی است")
        .min(0, "حداقل مقدار 0 است")
        .max(100, "حداکثر مقدار 100 است"),
    credit: yup
        .number()
        .required("سقف مبلغ کش بک الزامی است")
        .positive("مقدار باید مثبت باشد"),
    fromDate: yup.string().required("تاریخ شروع الزامی است"),
    toDate: yup.string().required("تاریخ پایان الزامی است"),
});

const EditCreditPlan = ({id, onActionComplete}) => {
    const [submitLoading, setSubmitLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);


    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            section: "",
            branchSharePercentage: "",
            title: "",
            credit: "",
            fromDate: "",
            toDate: "",
        },
    });

    const handleOpen = async () => {
        setLoading(true);
        setOpen(true);
        try {
            const {data} = await api.get(`/credit-event/${id}`);
            const creditEventData = data?.Data;

            if (creditEventData) {
                setValue("section", creditEventData.section || "");
                setValue("branchSharePercentage", creditEventData.branchSharePercentage || "");
                setValue("title", creditEventData.title || "");
                setValue("credit", creditEventData.credit || "");
                setValue("fromDate", creditEventData.fromDate || "");
                setValue("toDate", creditEventData.toDate || "");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        reset();
    };


    const handleFormSubmit = async (formData) => {
        setSubmitLoading(true);

        const {fromDate, toDate, ...payload} = formData;
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

        const convertedStartDate = convertFarsiToEnglishDigits(fromDate);
        const convertedEndDate = convertFarsiToEnglishDigits(toDate);

        const apiPayload = {
            branchSharePercentage: payload.branchSharePercentage,
            title: payload.title,
            credit: payload.credit,
            fromDate: convertedStartDate,
            toDate: convertedEndDate,
            id,
        };

        try {
            await api.put(`/credit-event/${id}`, apiPayload);
            toast.success("اطلاعات طرح اعتباری با موفقیت بروزرسانی شد.");
            setOpen(false);
            if (onActionComplete) {
                onActionComplete();
            }
        } finally {
            setSubmitLoading(false);
        }
    };


    return (
        <>
            <Tooltip title="ویرایش طرح اعتباری" arrow>
        <span
            className="cursor-pointer p-2 bg-[#DBDBE7] rounded-xl"
            onClick={handleOpen}
        >
          <EditIcon sx={{fontSize: 20}}/>
        </span>
            </Tooltip>
            <Dialog open={open} onClose={handleOpen} maxWidth="sm" fullWidth>
                {loading && (
                    <Backdrop
                        open={true}
                        sx={{
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                            color: "#fff",
                        }}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                )}
                <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white relative">
                    <DialogTitle>ویرایش طرح اعتباری</DialogTitle>
                    <DialogContent>
                        <Grid container spacing={2} sx={{mt: 2}}>
                            <Grid item xs={12} sm={6}>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            label="عنوان"
                                            fullWidth
                                            error={Boolean(errors.title)}
                                            helperText={errors.title?.message}
                                            sx={{mb: 2}}
                                        />
                                    )}
                                />
                                <Controller
                                    name="credit"
                                    control={control}
                                    render={({field}) => (
                                        <PriceInput
                                            {...field}
                                            label="مبلغ اعتبار"
                                            fullWidth
                                            error={Boolean(errors.credit)}
                                            helperText={errors.credit?.message}
                                            sx={{mb: 2}}
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
                                            {...field}
                                            label="درصد مشارکت شعبه"
                                            variant="outlined"
                                            fullWidth
                                            error={Boolean(errors.branchSharePercentage)}
                                            helperText={errors.branchSharePercentage?.message}
                                            sx={{
                                                marginBottom: 2,
                                                "& .MuiInputBase-root": {padding: "4px 8px"},
                                            }}
                                        />
                                    )}
                                />
                            </Grid>
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
                                            className="rmdp-mobile"
                                            render={(valueProps, openCalendar) => (
                                                <TextField
                                                    {...valueProps}
                                                    label="تاریخ شروع"
                                                    variant="outlined"
                                                    fullWidth
                                                    onClick={openCalendar}
                                                    inputProps={{
                                                        ...valueProps.inputProps,
                                                        readOnly: true,
                                                    }}
                                                    value={value ? value.toString("YYYY/MM/DD") : ""}
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
                                            className="rmdp-mobile"
                                            render={(valueProps, openCalendar) => (
                                                <TextField
                                                    {...valueProps}
                                                    label="تاریخ پایان"
                                                    variant="outlined"
                                                    fullWidth
                                                    onClick={openCalendar}
                                                    inputProps={{
                                                        ...valueProps.inputProps,
                                                        readOnly: true,
                                                    }}
                                                    value={value ? value.toString("YYYY/MM/DD") : ""}
                                                />
                                            )}
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={submitLoading}
                        >
                            {submitLoading ? (
                                <CircularProgress size={24} color="inherit"/>
                            ) : (
                                "ویرایش"
                            )}
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleClose} disabled={submitLoading}>
                            انصراف
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default EditCreditPlan;
