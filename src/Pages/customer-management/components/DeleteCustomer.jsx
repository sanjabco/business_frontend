import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    CircularProgress,
} from "@mui/material";
import {toast} from "react-toastify";
import api from "../../../Components/auth/axiosConfig.js";
import {useState} from "react";

const DeleteCustomer = ({open, onClose, customer, onDeleteSuccess}) => {
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setLoading(false);
        onClose();
    };

    const handleDelete = async () => {
        if (!customer?.id) return;
        setLoading(true);

        try {
            await api.delete(`/Customer/delete/${customer.id}`);
            toast.success("مشتری با موفقیت حذف شد");
            onDeleteSuccess();
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open && !!customer} onClose={handleClose}>
            <DialogTitle>حذف مشتری</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{color: "gray"}}>
                    آیا مطمئن هستید که می‌خواهید مشتری{" "}
                    <span style={{color: "red", fontWeight: "bold"}}>
                        {customer?.firstName} {customer?.lastName}
                    </span>{" "}
                    را حذف کنید؟
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary" disabled={loading}>
                    انصراف
                </Button>
                <Button
                    onClick={handleDelete}
                    color="error"
                    autoFocus
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={16}/> : null}
                >
                    حذف
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteCustomer;
