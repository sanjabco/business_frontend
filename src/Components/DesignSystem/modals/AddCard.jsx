import React from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
} from "@material-tailwind/react";
import {XMarkIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import "../../../../public/css/stylesheet.css";

function AddCard() {
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => setOpen(!open);

    return (
        <>
            <button onClick={handleOpen}
                    className='flex items-center justify-center px-10 py-2 rounded-full border border-Red text-Red hover:bg-Pink font-bold'>
                <PlusCircleIcon className='w-5 h-5'/>
                <p>افزودن مشتری با کارت </p>
            </button>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader className="flex justify-between font-BYekan">
                    <span></span>
                    <p className="font-bold">
                        ثبت کارت جدید
                    </p>
                    <Button className="bg-lightRed p-1" onClick={handleOpen}><XMarkIcon
                        className="text-Red w-5 h-5"></XMarkIcon></Button>
                </DialogHeader>
                <DialogBody className="p-20">
                    <img src="RFID-Red.fd600519.svg" alt="show card"/>
                </DialogBody>
                <DialogFooter className="flex justify-center">
                    <button
                        variant="text"
                        className="py-2 px-16 rounded-full bg-lightGreen hover:bg-opacity-90"
                    >
                        <span className="text-white font-bold font-BYekan">ثبت کارت</span>
                    </button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default AddCard