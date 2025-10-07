import {useState} from "react";
import {Button, Modal, Box, Typography, CircularProgress} from "@mui/material";
import {AddCircle} from "@mui/icons-material";
import PriceInput from "../../../Components/common/PriceInput.jsx";
import {useNavigate} from "react-router-dom";
import api from "../../../Components/auth/axiosConfig.js"

const AddCreditModal = ({refreshTable}) => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [creditAmount, setCreditAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (e) => {
        setCreditAmount(e);
        setError("");
    };

    const handleSubmit = async () => {
        if (creditAmount === "") {
            setError("مقدار اعتبار نمی‌تواند خالی باشد");
            return;
        }

        const amount = creditAmount;
        setLoading(true);

        try {
            const {data} = await api.post("/Payment", {amount});
            setCreditAmount("");
            const url = data.Data.url;
            await window.location.replace(url);
            refreshTable();
            handleClose();
            navigate(url);

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                sx={{
                    color: "red",
                    fontSize: "small",
                    mt: 3,
                    display: "flex",
                    alignItems: "center"
                }}
                onClick={handleOpen}
                disabled={loading}
            >
                <AddCircle sx={{width: 18, height: 18, mr: 1}}/>
                اعتبار جدید
            </Button>

            <Modal open={open} onClose={handleClose}>
                <Box sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    width: 300
                }}>
                    <Typography variant="h6" sx={{mb: 2}}>افزودن اعتبار جدید</Typography>
                    <PriceInput
                        value={creditAmount}
                        onChange={e => handleChange(e)}
                        label="مقدار اعتبار"
                        error={!!error}
                        helperText={error}
                        type="text"
                    />
                    <Box sx={{display: "flex", justifyContent: "flex-end"}}>
                        <Button
                            onClick={handleSubmit}
                            sx={{color: "red"}}
                            disabled={!creditAmount.trim() || loading}
                        >
                            {loading ? (
                                <CircularProgress size={24} sx={{color: "red", marginRight: 1}}/>
                            ) : (
                                "افزودن"
                            )}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default AddCreditModal;
