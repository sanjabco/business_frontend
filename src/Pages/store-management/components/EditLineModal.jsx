import {useEffect, useState} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Tooltip,
    CircularProgress,
} from "@mui/material";
import {useForm, Controller} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import api from "../../../Components/auth/axiosConfig.js"
import PriceInput from "../../../Components/common/PriceInput.jsx";
import EditIcon from "@mui/icons-material/Edit";
import {toast} from "react-toastify";

const schema = yup.object().shape({
    title: yup.string().required("نام بخش الزامی است"),
    description: yup.string(),
    maxPayAmountByCashBack: yup.number().required("حداکثر مبلغ پرداخت از اعتبار الزامی است"),
    branchSharePercentage: yup.number().required("درصد مشارکت شعبه الزامی است"),
});

const EditLineModal = ({id, onActionComplete}) => {
    const [open, setOpen] = useState(false);
    const [selectedLine, setSelectedLine] = useState(null);
    const [loading, setLoading] = useState(false);
    const [inputLoading, setInputLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        if (open) {
            const fetchLine = async () => {
                try {
                    setInputLoading(true);
                    const response = await api.get(`/Line/${id}`);
                    setSelectedLine(response.data.Data);
                    Object.keys(response.data.Data).forEach((key) => {
                        setValue(key, response.data.Data[key]);
                    });
                } finally {
                    setInputLoading(false);
                }
            };
            fetchLine();
        }
    }, [open, id, setValue]);

    const handleOpen = () => {
        setOpen(!open);
        reset({
            title: "",
            description: "",
            maxPayAmountByCashBack: "",
            branchSharePercentage: "",
        });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.put(`/Line/${id}`, data);
            toast.success('بخش با موفقیت بروزرسانی شد.');
            if (onActionComplete) {
                onActionComplete();
            }
        } finally {
            setLoading(false);
        }
        reset({
            title: "",
            description: "",
            maxPayAmountByCashBack: "",
            branchSharePercentage: "",
        });
        handleOpen();
    };

    return (
        <>
            <Tooltip title="ویرایش بخش">
                <span className="cursor-pointer" onClick={handleOpen}>
                    <EditIcon style={{fontSize: 20, color: '#6F6F9D'}}/>
                </span>
            </Tooltip>

            <Dialog open={open} onClose={handleOpen}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>ویرایش بخش</DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-5 mt-5">
                            {inputLoading ? (
                                <div className="col-span-2 flex justify-center">
                                    <CircularProgress size={40} color="primary"/>
                                </div>
                            ) : (
                                <>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({field}) => (
                                            <TextField
                                                {...field}
                                                label="نام بخش"
                                                variant="outlined"
                                                fullWidth
                                                error={!!errors.title}
                                                helperText={errors.title?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({field}) => (
                                            <TextField
                                                {...field}
                                                label="توضیحات بخش"
                                                variant="outlined"
                                                fullWidth
                                                error={!!errors.description}
                                                helperText={errors.description?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="maxPayAmountByCashBack"
                                        control={control}
                                        render={({field}) => (
                                            <PriceInput
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                                label="حداکثر مبلغ پرداخت از اعتبار"
                                                error={!!errors.maxPayAmountByCashBack}
                                                helperText={errors.maxPayAmountByCashBack?.message}
                                            />
                                        )}
                                    />
                                    <Controller
                                        name="branchSharePercentage"
                                        control={control}
                                        render={({field}) => (
                                            <TextField
                                                {...field}
                                                label="درصد مشارکت شعبه"
                                                type="number"
                                                variant="outlined"
                                                fullWidth
                                                error={!!errors.branchSharePercentage}
                                                helperText={errors.branchSharePercentage?.message}
                                            />
                                        )}
                                    />
                                </>
                            )}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleOpen} color="secondary">
                            لغو
                        </Button>
                        <Button type="submit" color="primary" disabled={loading}>
                            {loading ? (
                                <CircularProgress size={24} color="inherit"/>
                            ) : (
                                "ویرایش"
                            )}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default EditLineModal;
