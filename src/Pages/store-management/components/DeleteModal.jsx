import {useState} from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogFooter,
    Tooltip,
} from "@material-tailwind/react";
import api from "../../../Components/auth/axiosConfig.js"
import {toast} from "react-toastify";
import {MdDelete} from "react-icons/md";

const DeleteModal = ({type, id, onActionComplete}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDelete = async () => {
        setLoading(true);

        try {
            const endpoint = type === "branch" ? `/Branch/${id}` : `/Line/${id}`;
            await api.delete(endpoint);
            toast.success("عملیات با موفقیت انجام شد.");
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
            <Tooltip
                className="bg-[#ED4C67] text-white"
                content={type === "branch" ? "حذف شعبه" : "حذف بخش"}
                animate={{
                    mount: {scale: 1, y: 0},
                    unmount: {scale: 0, y: 25},
                }}
            >
                <span
                    className={`cursor-pointer ${type === "branch" ? "p-2 bg-[#FBD3D9] rounded-xl" : ""}`}
                    onClick={handleOpen}
                >
                    <MdDelete size={20} color="primary"/>
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
                            آیا از حذف {type === "branch" ? "شعبه" : "بخش"} اطمینان دارید؟
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="text"
                            color="red"
                            onClick={handleDelete}
                            className="ml-1 flex items-center justify-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="animate-spin h-4 w-4 border-2 border-t-2 border-[#ED4C67] rounded-full mr-2"
                                    ></div>
                                </>
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
