import {BuildingStorefrontIcon, PlusCircleIcon, FolderMinusIcon} from "@heroicons/react/24/outline";
import {Select, Option} from "@material-tailwind/react";
import PageHeaders from "../../Components/common/PageHeaders";
import {NavLink} from "react-router-dom";

const Plans = () => {

    return (
        <div className="bg-lightWhite min-h-screen min-w-full">
            <PageHeaders current="طرح های تخفیف/تشویقی"/>
            <div className="border-t border-Gray">
                <div className="flex items-center mt-5">
                    <BuildingStorefrontIcon className="w-7 h-7 ml-2 text-Gray"></BuildingStorefrontIcon>
                    <h1 className="font-bold text-xl">طرح های تخفیفی/تشویقی</h1>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-10 mt-10">
                    <div className="flex items-center bg-white rounded-3xl shadow-md justify-center">
                        <div className="p-5 flex flex-col">
                            <div className="flex justify-between mb-3">
                                <img src="credit.svg" alt="creditLogo" className="w-7 h-7"/>
                                <p className="text-Gray rounded-full bg-lightWhite w-8 h-8 flex items-center justify-center">0</p>
                            </div>
                            <h2 className="font-bold">طرح کش بک
                            </h2>
                            <p className="text-sm mt-2 border-b-2 pb-5">به کاربران هر بخشی که می خواهید کش بک ه...</p>
                            <NavLink to={"cashback"} className="flex text-Red text-sm cursor-pointer mt-5">
                                <PlusCircleIcon className="w-5 h-5"/>
                                <p className="font-bold">افزودن آیتم جدید</p>
                            </NavLink>
                        </div>
                    </div>
                    <div className="flex items-center bg-white rounded-3xl shadow-md justify-center">
                        <div className="p-5 flex flex-col">
                            <div className="flex justify-between mb-3">
                                <img src="credit.svg" alt="creditLogo" className="w-7 h-7"/>
                                <p className="text-Gray rounded-full bg-lightWhite w-8 h-8 flex items-center justify-center">0</p>
                            </div>
                            <h2 className="font-bold">طرح اعتباری
                            </h2>
                            <p className="text-sm mt-2 border-b-2 pb-5">به کاربران هر بخشی که می خواهید اعتبار...</p>
                            <NavLink to={"credit-plan"} className="flex text-Red text-sm cursor-pointer mt-5">
                                <PlusCircleIcon className="w-5 h-5"/>
                                <p className="font-bold">افزودن آیتم جدید</p>
                            </NavLink>
                        </div>
                    </div>

                </div>
                <div className="mt-10 mb-20 bg-white w-full rounded-3xl">
                    <div className="p-5 mt-5 bg-white rounded-2xl w-full">
                        <div className="mt-5 bg-lightWhite border-b w-full">
                            <div className="border-b border-lightGray rounded-b-2xl p-2">
                                <div dir='ltr' className="items-center justify-between text-Gray flex md:hidden">
                                    <Select label=" مرتب سازی بر اساس">
                                        <Option>نوع هدیه</Option>
                                        <Option>مقدار هدیه</Option>
                                        <Option>نوع تخفیف</Option>
                                        <Option>سطح</Option>
                                        <Option>عنوان</Option>
                                        <Option>ردیف</Option>
                                    </Select>
                                </div>
                                <div className="items-center justify-between mx-10 text-Gray hidden md:flex ّ">
                                    <div className="cursor-pointer">
                                        نوع هدیه
                                    </div>
                                    <div className="cursor-pointer">
                                        مقدار هدیه
                                    </div>
                                    <div className="cursor-pointer">
                                        نوع تخفیف
                                    </div>
                                    <div className="cursor-pointer">
                                        سطح
                                    </div>
                                    <div className="cursor-pointer">
                                        عنوان
                                    </div>
                                    <div className="cursor-pointer">
                                        ردیف
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center text-Gray my-20">
                            <FolderMinusIcon className="w-12 h-12"/>
                            <p className="text-sm">موردی برای نمایش یافت نشد</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Plans