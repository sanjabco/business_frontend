import {useEffect, useState} from "react";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Tooltip,
    Box,
} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {toast} from "react-toastify";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../../Components/auth/axiosConfig.js"
import {MdEdit} from "react-icons/md";

const schema = yup.object().shape({
    title: yup.string().required("نام شعبه الزامی است"),
    description: yup.string(),
});

const EditBranchModal = ({id, onActionComplete}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(null);

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
            const fetchBranch = async () => {
                setFetching(true);
                try {
                    const {data} = await api.get(`/Branch/${id}`);
                    setSelectedBranch(data.Data.branch);
                } finally {
                    setFetching(false);
                }
            };
            fetchBranch();
        }
    }, [open, id]);

    useEffect(() => {
        if (selectedBranch) {
            Object.keys(selectedBranch).forEach((key) => {
                setValue(key, selectedBranch[key]);
            });
        }
    }, [selectedBranch, setValue]);

    const handleOpen = () => {
        setOpen(!open);
        reset({
            title: "",
            description: "",
        });
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await api.put(`/Branch/${id}`, data);
            toast.success("شعبه با موفقیت بروزرسانی شد.");
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
            <Tooltip title="ویرایش شعبه" arrow>
                <span
                    className="cursor-pointer p-2 bg-[#DBDBE7] rounded-xl"
                    onClick={handleOpen}
                >
                    <MdEdit size={20} color={"Gray"}/>
                </span>
            </Tooltip>
            <Dialog open={open} onClose={handleOpen} maxWidth="xs" fullWidth>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white relative">
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleOpen}
                        sx={{position: "absolute", top: 8, right: 20}}
                    >
                        <CloseIcon/>
                    </IconButton>
                    <DialogTitle>
                        <h3 className="mx-auto text-[#212121] text-xl font-bold">
                            ویرایش شعبه
                        </h3>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{position: "relative"}}>
                            {fetching && (
                                <Box
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: "100%",
                                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                                        zIndex: 10,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <CircularProgress/>
                                </Box>
                            )}
                            <div className="grid grid-cols-1 gap-5 mt-5">
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
                                                error={Boolean(errors.title)}
                                                helperText={errors.title?.message}
                                                sx={{
                                                    marginBottom: 2,
                                                    "& .MuiInputBase-root": {
                                                        padding: "4px 8px",
                                                    },
                                                }}
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
                                                error={Boolean(errors.description)}
                                                helperText={errors.description?.message}
                                                sx={{
                                                    marginBottom: 2,
                                                    "& .MuiInputBase-root": {
                                                        padding: "4px 8px",
                                                    },
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            disabled={loading}
                            sx={{
                                minWidth: "100px",
                                height: "36px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {loading ? (
                                <CircularProgress size={20} color="inherit"/>
                            ) : (
                                "ویرایش"
                            )}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleOpen}
                            disabled={loading}
                            sx={{
                                minWidth: "100px",
                                height: "36px",
                            }}
                        >
                            انصراف
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default EditBranchModal;
