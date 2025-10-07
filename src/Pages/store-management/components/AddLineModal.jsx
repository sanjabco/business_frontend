import {useState} from "react";
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Tooltip,
    CircularProgress
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import {FaPlus, FaTimes} from 'react-icons/fa';
import PriceInput from "../../../Components/common/PriceInput.jsx";
import api from "../../../Components/auth/axiosConfig.js"

const schema = yup.object().shape({
    title: yup.string().required('نام بخش الزامی است'),
    description: yup.string(),
    maxPayAmountByCashBack: yup.string().required('حداکثر مبلغ پرداخت از اعتبار الزامی است'),
    branchSharePercentage: yup.string().required('درصد مشارکت شعبه الزامی است')
});

const AddLineModal = ({id, onActionComplete}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
    });

    const handleOpen = () => {
        setOpen(!open);
        reset({
            title: '',
            description: '',
            maxPayAmountByCashBack: '',
            branchSharePercentage: ''
        });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        data.branchId = id;
        try {
            await api.post("/Line", data);
            toast.success('بخش با موفقیت ایجاد شد.');
            if (onActionComplete) {
                onActionComplete();
            }
            handleOpen();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Tooltip title="افزودن بخش جدید" arrow>
                <span className="cursor-pointer p-2 bg-[#BDEEE4] rounded-xl" onClick={handleOpen}>
                    <FaPlus size={20} color="#1ABC9C"/>
                </span>
            </Tooltip>
            <Dialog open={open} onClose={handleOpen} maxWidth="xs" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white relative">
                    <span
                        className="p-2 rounded-xl bg-[#FF564420] absolute top-2 right-3 cursor-pointer"
                        onClick={handleOpen}
                    >
                        <FaTimes size={15} color="#FF5644"/>
                    </span>
                    <DialogTitle className="text-center">
                        <h3 className="mx-auto text-[#212121] text-xl font-bold">افزودن بخش جدید</h3>
                    </DialogTitle>
                    <DialogContent>
                        <div className="grid grid-cols-2 gap-10 mt-5">
                            <div>
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
                                            sx={{height: 40}}
                                        />
                                    )}
                                />
                            </div>
                            <div>
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
                                            sx={{height: 40}}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="maxPayAmountByCashBack"
                                    control={control}
                                    render={({field}) => (
                                        <PriceInput
                                            value={field.value}
                                            onChange={field.onChange}
                                            label="حداکثر مبلغ پرداخت از اعتبار"
                                            error={!!errors.maxPayAmountByCashBack}
                                            helperText={errors.maxPayAmountByCashBack?.message}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="branchSharePercentage"
                                    control={control}
                                    render={({field}) => (
                                        <TextField
                                            {...field}
                                            type="number"
                                            label="درصد مشارکت شعبه"
                                            variant="outlined"
                                            fullWidth
                                            error={!!errors.branchSharePercentage}
                                            helperText={errors.branchSharePercentage?.message}
                                            sx={{height: 40}}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="flex gap-2 justify-center mt-3">
                        <Button
                            variant="contained"
                            color="error"
                            type="submit"
                            sx={{px: 4, py: 2, height: 40}}
                            disabled={loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{color: 'white'}}/>
                            ) : (
                                'ایجاد'
                            )}
                        </Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={handleOpen}
                            sx={{px: 4, py: 2, height: 40}}
                        >
                            لغو
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddLineModal;
