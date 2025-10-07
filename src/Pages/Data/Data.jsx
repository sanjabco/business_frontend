import {Square3Stack3DIcon} from "@heroicons/react/24/outline";
import {IoIosSearch} from "react-icons/io";
import {Select, Option} from "@material-tailwind/react";
import PageHeaders from '../../Components/common/PageHeaders';
import {NavLink} from "react-router-dom";
import PropTypes from "prop-types";
import {useEffect, useState} from "react";
import api from "../../Components/auth/axiosConfig.js"
import {CircularProgress} from "@mui/material";

const SmartDataCard = ({title, count, id}) => {
    return (
        <NavLink to={`smartData/${id}`}
                 className="h-[13rem] bg-white p-2.5 shadow-2 rounded-2xl cursor-pointer">
            <div className="w-full h-20 bg-gray-200 rounded-2xl"></div>
            <div
                className="z-10 w-[85px] h-[85px] bg-white rounded-full p-2.5 mx-auto -mt-10">
                <div
                    className="z-20 shadow-3-strong w-full h-full bg-white rounded-full"></div>
            </div>
            <div className="z-10 text-center">
                <h2 className="text-lg text-gray-900">{title}</h2>
                <div
                    className='flex items-center justify-center gap-1 text-Gray font-bold'>
                    <p>عضو</p>
                    <p>{count}</p>
                </div>
            </div>
        </NavLink>
    );
};

SmartDataCard.propTypes = {
    title: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

function Data() {

    const [smartData, setSmartData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchSmartData = async () => {
        setLoading(true);
        try {
            const {data} = await api.get("/SmartData/data");
            setSmartData(data.Data.smartDataList);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSmartData();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredSmartData = smartData.filter((data) =>
        data.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className='bg-lightWhite min-w-full min-h-screen'>
                <PageHeaders current="دیتای هوشمند"/>
                <div className='border-t border-Gray'>
                    <div className="flex items-center my-5">
                        <Square3Stack3DIcon className="w-7 h-7 ml-2 text-Gray"></Square3Stack3DIcon>
                        <h1 className="font-bold text-xl">دیتای هوشمند</h1>
                    </div>
                </div>
                <div className="mt-5">
                    <div>
                        <div
                            className='w-full sm:max-w-96 flex flex-row items-center border-b border-Gray hover:border-black duration-300 pb-5 relative'>
                            <input
                                id='Search'
                                type="search"
                                placeholder='جستجو'
                                className='w-full px-5 bg-lightWhite outline-none'
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                            <button
                                className='w-10 h-10 bg-Red rounded-full absolute left-0 flex items-center justify-center text-xl text-white'>
                                <IoIosSearch/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='mt-20'>
                    <div className="pb-52">
                        <div className="p-5 mt-5 bg-white rounded-2xl w-full">
                            <div className="mt-5 bg-lightWhite border-b w-full">
                                <div className="border-b border-lightGray rounded-b-2xl p-2">
                                    <div dir='ltr' className="items-center justify-between text-Gray flex md:hidden">
                                        <Select label=" مرتب سازی بر اساس">
                                            <Option>ردیف</Option>
                                            <Option>طرح های تخفیفی/تشویقی </Option>
                                            <Option>ارسال به </Option>
                                            <Option> تعداد ارسالی</Option>
                                            <Option> تاریخ</Option>
                                            <Option>ساعت</Option>
                                            <Option>وصعیت</Option>
                                            <Option>متن پیام</Option>
                                        </Select>
                                    </div>
                                    <div className="items-center justify-between mx-10 text-Gray hidden md:flex">
                                        <div className="cursor-pointer">
                                            متن پیام
                                        </div>
                                        <div className="cursor-pointer">
                                            وضعیت
                                        </div>
                                        <div className="cursor-pointer">
                                            ساعت
                                        </div>
                                        <div className="cursor-pointer">
                                            تاریخ
                                        </div>
                                        <div className="cursor-pointer">
                                            تعداد ارسالی
                                        </div>
                                        <div className="cursor-pointer">
                                            ارسال به
                                        </div>
                                        <div className="cursor-pointer">
                                            طرح های تخفیفی/تشویقی
                                        </div>
                                        <div className="cursor-pointer">
                                            ردیف
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center mt-5 mb-10">
                                {loading && (
                                    <CircularProgress size={50}/>
                                )}
                            </div>
                        </div>
                        <div
                            className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 mt-10'>
                            {
                                filteredSmartData.length > 0 ? (
                                    filteredSmartData.map(d => (
                                        <SmartDataCard
                                            key={d.id}
                                            id={d.id}
                                            title={d.title}
                                            count={d.count}
                                        />
                                    ))
                                ) : (
                                    !loading && <div className="col-span-5 text-center">داده ای پیدا نشد</div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Data;
