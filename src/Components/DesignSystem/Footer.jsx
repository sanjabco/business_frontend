import {ChevronLeftIcon} from "@heroicons/react/24/outline";
import {Select, Option} from "@material-tailwind/react";

function Footer() {
    return (
        <>
            <div className="mx-10 pb-52">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-extrabold">تراکنش ها</h1>
                    <div className="flex text-Red font-bold text-sm">مشاهده همه <ChevronLeftIcon
                        className="w-4 h-4 mr-1"></ChevronLeftIcon></div>
                </div>
                <div className="p-5 mt-5 bg-white rounded-2xl shadow-lg w-full">
                    <div className="mt-[-1rem] bg-lightWhite border-b w-full">
                        <div className="border-b border-lightGray rounded-b-2xl p-2">
                            <div dir='ltr' className="items-center justify-between sm:mx-10 text-Gray flex md:hidden">
                                <Select label=" مرتب سازی بر اساس">
                                    <Option>ردیف</Option>
                                    <Option>نام مشتری</Option>
                                    <Option>شماره تماس</Option>
                                    <Option>مبلغ</Option>
                                    <Option>تاریخ</Option>
                                    <Option>ساعت</Option>
                                    <Option>شرح تراکنش</Option>
                                    <Option>شعبه تراکنش</Option>
                                    <Option>بخش تراکنش</Option>
                                </Select>
                            </div>
                            <div className="items-center justify-between mx-10 gap-5 text-Gray hidden md:flex">
                                <div className="cursor-pointer">
                                    ردیف
                                </div>
                                <div className="cursor-pointer">
                                    نام مشتری
                                </div>
                                <div className="cursor-pointer">
                                    شماره تماس
                                </div>
                                <div className="cursor-pointer">
                                    مبلغ
                                </div>
                                <div className="cursor-pointer">
                                    تاریخ
                                </div>
                                <div className="cursor-pointer">
                                    ساعت
                                </div>
                                <div className="cursor-pointer">
                                    شرح تراکنش
                                </div>
                                <div className="cursor-pointer">
                                    شعبه تراکنش
                                </div>
                                <div className="cursor-pointer">
                                    بخض تراکنش
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-5">
                        <p className="text-sm">داده ای موجود نیست</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Footer