import {useEffect, useState} from "react";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Radio,
    Button,
    TextField,
    IconButton,
    Typography,
    Grid,
    FormControlLabel,
    RadioGroup,
    FormLabel,
    FormControl,
    CircularProgress,
} from "@mui/material";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {toast} from "react-toastify";
import api from "../../../Components/auth/axiosConfig.js";

const schema = yup.object().shape({
    firstName: yup.string().optional(),
    lastName: yup.string().required("وارد کردن نام خانوادگی الزامی است"),
    phoneNumber: yup
        .string()
        .matches(/^09\d{9}$/, "شماره همراه معتبر نیست")
        .required("وارد کردن شماره همراه الزامی است"),
    subscriptionCode: yup.string().optional(),
    gender: yup.string().optional(),
});

export default function AddNewCustomer({open, onClose, defaultPhoneNumber = ""}) {
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            firstName: "",
            lastName: "",
            phoneNumber: defaultPhoneNumber,
            subscriptionCode: "",
            gender: "",
        },
    });

    useEffect(() => {
        if (open) {
            reset({
                firstName: "",
                lastName: "",
                phoneNumber: defaultPhoneNumber,
                subscriptionCode: "",
                gender: "",
            });
        }
    }, [open, defaultPhoneNumber, reset]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.post("/customer", data);
            toast.success("مشتری با موفقیت ایجاد شد.");
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontFamily: "BYekan",
                }}
            >
                <span/>
                <Typography variant="h6" fontWeight="bold">
                    ثبت مشتری جدید
                </Typography>
                <IconButton onClick={onClose} sx={{backgroundColor: "lightcoral", padding: 1}}>
                    <XMarkIcon className="w-5 h-5" style={{color: "white"}}/>
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{display: "flex", flexDirection: "column", gap: 2, mt: 2}}>
                <form id="add-customer-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="firstName"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field} label="نام" variant="outlined" fullWidth
                                               error={!!errors.firstName} helperText={errors.firstName?.message}/>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="lastName"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field}
                                               label={<>نام خانوادگی<span className="text-Red mr-2">*</span></>}
                                               variant="outlined" fullWidth error={!!errors.lastName}
                                               helperText={errors.lastName?.message}/>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                render={({field}) => (
                                    <TextField {...field}
                                               label={<>شماره همراه<span className="text-Red mr-2">*</span></>}
                                               variant="outlined" fullWidth error={!!errors.phoneNumber}
                                               helperText={errors.phoneNumber?.message}/>
                                )}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Controller
                                name="subscriptionCode"
                                control={control}
                                render={({field}) => <TextField {...field} label="شماره اشتراک" variant="outlined"
                                                                fullWidth/>}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl>
                                <FormLabel>جنسیت</FormLabel>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({field}) => (
                                        <RadioGroup {...field} row>
                                            <FormControlLabel value="male" control={<Radio/>} label="مرد"/>
                                            <FormControlLabel value="female" control={<Radio/>} label="زن"/>
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>

            <DialogActions sx={{justifyContent: "center", gap: 2, p: 2}}>
                <Button variant="outlined" onClick={onClose}
                        sx={{fontWeight: "bold", color: "gray", borderColor: "gray"}}>
                    انصراف
                </Button>
                <Button
                    type="submit"
                    form="add-customer-form"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    startIcon={
                        loading ? <CircularProgress size={20} color="inherit"/> : null
                    }
                    sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {loading ? "در حال ثبت..." : "ثبت کاربر جدید"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}