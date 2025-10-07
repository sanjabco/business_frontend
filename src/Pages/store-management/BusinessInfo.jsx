import {useEffect, useState} from 'react';
import {useForm, Controller, useWatch} from 'react-hook-form';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import api from "../../Components/auth/axiosConfig.js"
import {
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    Switch,
    FormControlLabel,
    FormHelperText,
    Button,
    CircularProgress,
} from '@mui/material';
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
    businessCategoryId: yup.string().required('دسته بندی کسب و کار الزامی است'),
    title: yup.string().required('نام کسب و کار الزامی است'),
    phone: yup.string(),
    email: yup.string().email('پست الکترونیک معتبر نیست'),
    description: yup.string(),
    isVisible: yup.boolean(),
});

const BusinessInfo = () => {
    const [loading, setLoading] = useState('idle');
    const [store, setStore] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [switchLabel, setSwitchLabel] = useState('خیر');

    const {
        control,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            businessCategoryId: '',
            title: '',
            phone: '',
            email: '',
            description: '',
            isVisible: true,
        },
    });

    const isVisible = useWatch({control, name: 'isVisible'});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading('loading');
                const categoryResponse = await api.get('/Category/dropdown');
                setCategories(categoryResponse.data.Data.categories);

                const businessResponse = await api.get('/Business');
                setStore(businessResponse.data.Data);
                setLoading('idle');
            } catch (error) {
                setLoading('error');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (store) {
            Object.keys(store).forEach((key) => setValue(key, store[key]));
            setSwitchLabel(store.isVisible ? 'بله' : 'خیر');
        }
    }, [store, setValue]);

    const handleSwitchChange = (checked) => {
        setSwitchLabel(checked ? 'بله' : 'خیر');
        setValue('isVisible', checked);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await api.put('/Business', data);
            toast.success('تغییرات با موفقیت ذخیره شد.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading === 'loading') {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <CircularProgress/>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col mx-10 mt-5">
            {/* Business Category */}
            <FormControl fullWidth error={!!errors.businessCategoryId} margin="normal">
                <InputLabel sx={{color: 'gray', '&.Mui-focused': {color: 'red'}}}>
                    دسته بندی کسب و کار
                </InputLabel>
                <Controller
                    name="businessCategoryId"
                    control={control}
                    render={({field}) => (
                        <Select {...field} value={field.value || ''}>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </Select>
                    )}
                />
                {errors.businessCategoryId && (
                    <FormHelperText>{errors.businessCategoryId.message}</FormHelperText>
                )}
            </FormControl>

            <TextField
                label="نام کسب و کار"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.title}
                helperText={errors.title?.message}
                {...control.register('title')}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: 'gray',
                        '&.Mui-focused': {color: 'red'},
                    },
                    '& .MuiOutlinedInput-root fieldset': {
                        borderColor: 'gray',
                        '&:hover': {borderColor: 'red'},
                        '&.Mui-focused': {borderColor: 'red'},
                    },
                }}
            />

            <TextField
                label="شماره تماس"
                variant="outlined"
                fullWidth
                margin="normal"
                {...control.register('phone')}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: 'gray',
                        '&.Mui-focused': {color: 'red'},
                    },
                    '& .MuiOutlinedInput-root fieldset': {
                        borderColor: 'gray',
                        '&:hover': {borderColor: 'red'},
                        '&.Mui-focused': {borderColor: 'red'},
                    },
                }}
            />

            <TextField
                label="پست الکترونیک"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                {...control.register('email')}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: 'gray',
                        '&.Mui-focused': {color: 'red'},
                    },
                    '& .MuiOutlinedInput-root fieldset': {
                        borderColor: 'gray',
                        '&:hover': {borderColor: 'red'},
                        '&.Mui-focused': {borderColor: 'red'},
                    },
                }}
            />

            <TextField
                label="توضیحات"
                variant="outlined"
                fullWidth
                margin="normal"
                multiline
                rows={4}
                {...control.register('description')}
                sx={{
                    '& .MuiInputLabel-root': {
                        color: 'gray',
                        '&.Mui-focused': {color: 'red'},
                    },
                    '& .MuiOutlinedInput-root fieldset': {
                        borderColor: 'gray',
                        '&:hover': {borderColor: 'red'},
                        '&.Mui-focused': {borderColor: 'red'},
                    },
                }}
            />

            <FormControlLabel
                control={
                    <Switch
                        checked={isVisible}
                        onChange={(e) => handleSwitchChange(e.target.checked)}
                        color="error"
                    />
                }
                label={`مایل به اشتراک گذاری باشکاه مشتریان هستم : ${switchLabel}`}
            />

            <Button
                type="submit"
                variant="contained"
                color="error"
                sx={{
                    mt: 3,
                    backgroundColor: 'red',
                    '&:hover': {backgroundColor: 'darkred'},
                }}
                fullWidth
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <CircularProgress size={24} sx={{color: 'white'}}/>
                ) : (
                    'ذخیره تغییرات'
                )}
            </Button>
        </form>
    );
};

export default BusinessInfo;
