import { Link, NavLink } from "react-router-dom"
import { ChevronLeftIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Input } from "@material-tailwind/react";


function Profile() {

  return (
    <>
      <div className="bg-lightWhite min-h-screen w-full">
        <div className="p-2 mx-10 mr-10 lg:mr-20 flex items-center justify-between">
          <Link to="/" className="text-[14px]">بازگشت</Link>
          <div className="flex text-[14px] items-center">
            <div className="mr-2 text-Gray"> پروفایل</div>
            <ChevronLeftIcon className="text-Red w-4 h-4 mr-2"></ChevronLeftIcon>
            <Link to="/">داشبورد</Link>
          </div>
        </div>
        <div dir="rtl" className="border-t border-Gray mx-10">
          <div className="flex items-center mt-5">
            <UserCircleIcon className="w-7 h-7 ml-2 text-Gray"></UserCircleIcon>
            <h1 className="font-bold text-xl"> ویرایش پروفایل</h1>
          </div>
          <div className="flex flex-wrap flex-row mt-5 pb-5 gap-5 mx-0 md:mx-32 zl:mx-52">
            <Input
              color="red"
              label="نام و نام خانوادگی"
              className="text-Gra sm:min-w-[25rem] xl:min-w-[30rem]"
              dir="rtl"
            />
            <Input
              color="red"
              label="شماره همراه"
              className="text-Gray sm:min-w-[25rem] xl:min-w-[30rem]"
              dir="rtl"
            />
          </div>
        </div>
        <div className="flex justify-between items-center pt-5 border-t-2 mx-10">
          <NavLink to={"/store-manager"}>
            <button className="bg-Purple py-2 px-5 rounded-lg text-white text-sm font-bold hover:bg-opacity-95 duration-200">
              انتقال به صفحه مدیریت فروشگاه
            </button>
          </NavLink>
          <div className="flex gap-2">
            <button className="font-bold text-sm p-2 px-4 rounded-lg bg-primaryGray hover:bg-lightGray duration-200">
              انصراف
            </button>
            <button className="py-2 px-4 bg-grassGreen text-white text-sm f rounded-lg font-bold hover:bg-opacity-95 duration-200">
              ثبت تغییرات
            </button>
          </div>
        </div>
      </div>

    </>
  )
}

export default Profile