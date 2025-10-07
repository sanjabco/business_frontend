import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
} from "@mui/material";
import api from "../../../Components/auth/axiosConfig.js"
import { toast } from "react-toastify";

const AssignCardModal = forwardRef(({ customerId }, ref) => {
    const [open, setOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [isInputActive, setIsInputActive] = useState(false);
    const [isCardValid, setIsCardValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const cardInput = useRef(null);
    const cardImage = useRef(null);

    useImperativeHandle(ref, () => ({
        handleOpen() {
            setOpen(true);
        },
    }));

    const handleClose = () => {
        setOpen(false);
        setIsInputActive(false);
        setIsCardValid(false);
        setCardNumber("");
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                cardImage.current?.click();
            }, 100);
        }
    }, [open]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
            setCardNumber(value);
            setIsCardValid(value.length === 10);
        }
    };

    const handleImageClick = () => {
        setIsInputActive(true);
        setTimeout(() => {
            cardInput.current?.focus();
        }, 100);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.put("/Business/AssignCardToCustomer", { customerId, cardNumber });
            toast.success("کارت با موفقیت اختصاص یافت.");
            handleClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 3, overflow: "hidden" },
            }}
        >
            <DialogTitle
                sx={{ textAlign: "center", fontWeight: "bold", fontSize: "1.25rem" }}
            >
                افزودن کارت مشتری
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: "center", mb: 3 }}>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 2, fontSize: "1rem" }}
                    >
                        شماره کارت را وارد کنید:
                    </Typography>
                    <Box
                        sx={{
                            position: "relative",
                            display: "inline-block",
                            width: 150,
                            height: 150,
                            mb: 3,
                        }}
                    >
                        <img
                            src={
                                isCardValid
                                    ? "./assets/images/RFID-Green.svg"
                                    : "./assets/images/RFID-Red.svg"
                            }
                            alt="Card Status"
                            ref={cardImage}
                            style={{ width: "100%", height: "100%" }}
                            onClick={handleImageClick}
                        />
                        {isInputActive && (
                            <TextField
                                inputRef={cardInput}
                                value={cardNumber}
                                onChange={handleInputChange}
                                variant="outlined"
                                placeholder="شماره کارت"
                                fullWidth
                                inputProps={{
                                    maxLength: 10,
                                    style: { textAlign: "center", direction: "rtl" },
                                }}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    opacity: 0,
                                }}
                            />
                        )}
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions sx={{ justifyContent: "center" }}>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="error"
                    disabled={!isCardValid || loading}
                    sx={{ px: 5, borderRadius: 20 }}
                >
                    {loading ? "در حال ارسال..." : "ثبت مشتری"}
                </Button>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="secondary"
                    sx={{ px: 5, borderRadius: 20 }}
                >
                    انصراف
                </Button>
            </DialogActions>
        </Dialog>
    );
});

AssignCardModal.displayName = "AssignCardModal";

export default AssignCardModal;
