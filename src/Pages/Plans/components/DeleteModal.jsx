import {useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogFooter,
    Tooltip,
} from "@material-tailwind/react";
import {toast} from "react-toastify";
import {MdDelete} from "react-icons/md";
import api from "../../../Components/auth/axiosConfig.js"


const DeleteModal = ({type, id, onActionComplete}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDelete = async () => {
        setLoading(true);
        try {
            if (type === "cashback") {
                await api.delete(`/cash-back/${id}`);
            } else if (type === "creditplan") {
                await api.delete(`/credit-event/${id}`);
            }
            toast.success("عملیات با موفقیت انجام شد.");
            if (onActionComplete) {
                onActionComplete();
            }
        } finally {
            setLoading(false);
            handleOpen();
        }
    };

    return (
        <>
            <Tooltip
                className="bg-[#ED4C67] text-white"
                content={type === "cashback" ? "حذف طرح" : "حذف کشبک"}
                animate={{
                    mount: {scale: 1, y: 0},
                    unmount: {scale: 0, y: 25},
                }}
            >
                <span
                    className={`cursor-pointer p-2 bg-[#FBD3D9] rounded-xl`}
                    onClick={handleOpen}
                >
                    <MdDelete size={20} color="#ED4C67"/>
                </span>
            </Tooltip>

            <Dialog
                size="xs"
                open={open}
                handler={handleOpen}
                className="pt-2.5 rounded-2xl overflow-hidden bg-[#FF5644]"
                animate={{
                    mount: {scale: 1, y: 0},
                    unmount: {scale: 0.9, y: -100},
                }}
            >
                <div className="bg-white relative">
                    <DialogHeader>
                        <div className="text-[#6C7175] text-base">
                            آیا از حذف {type === "cashback" ? "کشبک" : "طرح تخفیفی"} اطمینان دارید؟
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleDelete}
                            className="ml-1"
                            disabled={loading}
                        >
                            {loading ? (
                                <div
                                    className="animate-spin h-5 w-5 border-4 border-t-4 border-[#ED4C67] rounded-full"
                                ></div>
                            ) : (
                                <span className="text-[#ED4C67]">بله</span>
                            )}
                        </Button>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleOpen}
                            className="ml-1"
                        >
                            <span className="text-[#6C7175]">خیر</span>
                        </Button>
                    </DialogFooter>
                </div>
            </Dialog>
        </>
    );
};

export default DeleteModal;
