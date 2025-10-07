import {useEffect, useRef, useState} from "react";
import {Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField} from "@mui/material";
import {PlusCircleIcon} from "@heroicons/react/24/outline";
import "../../../../public/css/stylesheet.css";
import api from "../../../Components/auth/axiosConfig.js"
import {toast} from "react-toastify";

function AddCustomerByCard() {
    const [open, setOpen] = useState(false);
    const [cardNumber, setCardNumber] = useState("");
    const [isInputActive, setIsInputActive] = useState(false);
    const [isCardValid, setIsCardValid] = useState(false);
    const [isInputDisabled, setIsInputDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const cardInput = useRef(null);
    const cardImage = useRef(null);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
        setIsInputActive(false);
        setIsInputDisabled(false);
        setIsCardValid(false);
        setCardNumber("");
    };

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                cardImage.current.click();
            }, 100);
        }
    }, [open]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        if (value.length <= 10 && /^[0-9]*$/.test(value)) {
            setCardNumber(value);
            if (value.length === 10) {
                setIsCardValid(true);
            } else {
                setIsCardValid(false);
            }
        }
    };

    const handleImageClick = () => {
        setIsInputActive(true);
        setTimeout(() => {
            cardInput.current.focus();
        }, 100);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await api.post("/customer/add", {cardNumber});
            toast.success("مشتری با موفقیت اضافه شد.");
            handleModalClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="outlined" startIcon={<PlusCircleIcon className="w-5 h-5"/>} onClick={handleOpen}>
                افزودن مشتری با کارت
            </Button>
            <Dialog
                open={open}
                onClose={handleModalClose}
                maxWidth="sm"
                fullWidth
                className="pt-2.5 rounded-2xl overflow-hidden"
            >
                <div className="bg-white relative">
          <span
              className="p-2 rounded-xl bg-[#FF564420] absolute top-2 right-3 cursor-pointer"
              onClick={handleModalClose}
          >
            <span style={{fontSize: "18px", color: "#FF5644"}}>×</span>
          </span>
                    <DialogTitle className="text-center">
                        <h3 className="mx-auto text-[#212121] text-xl font-bold">
                            افزودن بخش جدید
                        </h3>
                    </DialogTitle>
                    <DialogContent>
                        <div className="relative">
                            {isCardValid ? (
                                <img className="w-full z-10" src="./assets/images/RFID-Green.svg" alt=""/>
                            ) : (
                                <img
                                    onClick={handleImageClick}
                                    ref={cardImage}
                                    className="w-full z-10"
                                    src="./assets/images/RFID-Red.svg"
                                    alt=""
                                />
                            )}
                            <div className={`absolute inset-0 -z-10 ${isInputActive ? "" : "hidden"}`}>
                                <TextField
                                    variant="outlined"
                                    color="error"
                                    fullWidth
                                    className="min-h-[198px]"
                                    inputRef={cardInput}
                                    value={cardNumber}
                                    onInput={(e) => handleInputChange(e)}
                                    disabled={isInputDisabled}
                                />
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions className="flex gap-2 justify-center">
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleSubmit}
                            disabled={!isCardValid || loading}
                        >
                            {loading ? "در حال ارسال..." : "ثبت مشتری"}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleModalClose}
                            color="primary"
                        >
                            انصراف
                        </Button>
                    </DialogActions>
                </div>
            </Dialog>
        </>
    );
}

export default AddCustomerByCard;
