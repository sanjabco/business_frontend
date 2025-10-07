import {ChevronLeftIcon} from '@heroicons/react/24/outline';
import {Link, useNavigate} from 'react-router-dom';

const PageHeaders = ({paths = [], current}) => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="p-2 flex items-center justify-between">
            <div className="flex gap-3 text-sm">
                <div className='flex items-center gap-3'>
                    <Link to="/">داشبورد</Link>
                    <ChevronLeftIcon className="text-Red w-4 h-4"></ChevronLeftIcon>
                </div>
                {paths.map((path, index) => {
                    return (
                        <div key={index} className='flex items-center gap-3'>
                            <Link to={path.link}>{path.title}</Link>
                            <ChevronLeftIcon className="text-Red w-4 h-4"></ChevronLeftIcon>
                        </div>
                    )
                })}
                <p className="text-Gray">{current}</p>
            </div>
            <button onClick={handleGoBack} className="text-[14px]">
                بازگشت
            </button>
        </div>
    );
};

export default PageHeaders;
