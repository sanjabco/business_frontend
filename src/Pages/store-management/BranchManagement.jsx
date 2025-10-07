import {useState, useEffect} from 'react';
import api from "../../Components/auth/axiosConfig.js"
import {useForm, useFieldArray} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
    Box,
    TextField,
    Card,
    Button,
    Typography,
    Grid,
    Paper,
    IconButton,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    CircularProgress, CardContent, CardActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {toast} from 'react-toastify';
import DeleteModal from './components/DeleteModal.jsx';
import EditBranchModal from './components/EditBranchModal.jsx';
import AddLineModal from './components/AddLineModal.jsx';
import EditLineModal from './components/EditLineModal.jsx';
import PriceInput from "../../Components/common/PriceInput.jsx";

const schema = yup.object({
    title: yup.string().required('عنوان الزامی است'),
    description: yup.string().required('توضیحات الزامی است'),
    lines: yup
        .array()
        .of(
            yup.object({
                title: yup.string().required('عنوان بخش الزامی است'),
                description: yup.string().required('توضیحات بخش الزامی است'),
                maxPayAmountByCashBack: yup.number().required('حداکثر مبلغ الزامی است'),
                branchSharePercentage: yup
                    .number()
                    .typeError('فقط عدد وارد کنید')
                    .required('درصد مشارکت الزامی است')
                    .min(0, 'درصد مشارکت نمی‌تواند کمتر از 0 باشد')
                    .max(100, 'درصد مشارکت نمی‌تواند بیشتر از 100 باشد'),
            })
        )
        .min(1, 'حداقل یک بخش باید وارد شود')
});

const BranchManagement = () => {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);


    const fetchBranches = async () => {
        try {
            setLoading(true);
            const response = await api.get("/Branch");
            setBranches(response.data.Data.branches);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches()
    }, []);

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {title: '', description: '', lines: []}
    });

    const {fields, append, remove} = useFieldArray({control, name: 'lines'});

    const [sectionData, setSectionData] = useState({
        title: '',
        description: '',
        maxPayAmountByCashBack: '',
        branchSharePercentage: ''
    });

    const handleSectionChange = (e) => {
        const {name, value} = e.target;
        setSectionData((prev) => ({...prev, [name]: value}));
    };

    const addSection = () => {
        if (
            sectionData.title &&
            sectionData.description &&
            sectionData.maxPayAmountByCashBack &&
            sectionData.branchSharePercentage
        ) {
            append(sectionData);
            setSectionData({title: '', description: '', maxPayAmountByCashBack: '', branchSharePercentage: ''});
        } else {
            toast.error('تمام فیلد های بخش را وارد کنید.');
        }
    };

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            await api.post('/Branch', data);
            setOpenModal(false);
            toast.success('شعبه با موفقیت ایجاد شد.');
            reset({title: '', description: '', lines: []});
            const response = await api.get('/Branch');
            setBranches(response.data.Data.branches);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{padding: 4}}>
            <Typography variant="h5" gutterBottom>
                مدیریت شعبه
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenModal(true)}
                startIcon={<AddIcon/>}
            >
                افزودن شعبه
            </Button>

            <Dialog
                open={openModal}
                onClose={() => setOpenModal(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>افزودن شعبه</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={2} marginTop={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="عنوان شعبه"
                                    {...control.register('title')}
                                    error={!!errors.title}
                                    helperText={errors.title?.message}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="توضیحات شعبه"
                                    {...control.register('description')}
                                    error={!!errors.description}
                                    helperText={errors.description?.message}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{marginY: 2}}/>
                                <Typography variant="h6" sx={{marginBottom: 2}}>
                                    افزودن بخش جدید
                                </Typography>

                                <Grid>
                                    <Grid container spacing={2} gap={2} justifyContent={'center'}>
                                        <Grid item xs={12} sm={2}>
                                            <TextField
                                                fullWidth
                                                label="عنوان بخش"
                                                name="title"
                                                value={sectionData.title}
                                                onChange={handleSectionChange}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField
                                                fullWidth
                                                label="توضیحات بخش"
                                                name="description"
                                                value={sectionData.description}
                                                onChange={handleSectionChange}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <PriceInput
                                                label="حداکثر مبلغ"
                                                value={sectionData.maxPayAmountByCashBack}
                                                onChange={(value) => handleSectionChange({
                                                    target: {
                                                        name: 'maxPayAmountByCashBack',
                                                        value
                                                    }
                                                })}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <TextField
                                                fullWidth
                                                label="درصد مشارکت"
                                                name="branchSharePercentage"
                                                value={sectionData.branchSharePercentage}
                                                onChange={handleSectionChange}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2}>
                                            <Button variant="contained" startIcon={<AddIcon/>} onClick={addSection}
                                                    fullWidth>
                                                افزودن بخش
                                            </Button>
                                        </Grid>
                                    </Grid>

                                    <Grid item xs={12} marginY={5}>
                                        <Typography variant="h6">بخش‌ها</Typography>
                                        {fields.map((item, index) => (
                                            <Paper key={item.id} sx={{padding: 2, marginBottom: 2}}>
                                                <Grid container spacing={2} alignItems="center"
                                                      justifyContent="space-between">
                                                    <Grid item xs={12} sm={8} display="flex" alignItems="center">
                                                        <Typography>{item.title}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4} display="flex" alignItems="center"
                                                          justifyContent="flex-end">
                                                        <IconButton color="error" onClick={() => remove(index)}>
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                            </Paper>
                                        ))}
                                    </Grid>

                                    <Grid item xs={12}
                                          className={'flex sm:flex-row flex-col items-center justify-center gap-4'}>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            type="submit"
                                            fullWidth
                                            disabled={loading}
                                            startIcon={loading &&
                                                <CircularProgress size={20} color="inherit"/>}
                                        >
                                            {loading ? 'در حال ثبت...' : 'ثبت شعبه'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary" disabled={loading}>
                        بستن
                    </Button>
                </DialogActions>
            </Dialog>
            <Divider sx={{marginY: 4}}/>

            <Typography variant="h5" gutterBottom>
                لیست شعب
            </Typography>
            <Grid container spacing={3}>
                {loading ? (
                    <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
                        <CircularProgress/>
                    </Grid>
                ) : (
                    branches.map((branch) => (
                        <Grid item xs={12} sm={6} md={4} key={branch.id}>
                            <Card sx={{boxShadow: 3, width: '100%', borderRadius: 3, p: 2, position: 'relative'}}>
                                <CardContent>
                                    <Box>
                                        <Typography variant="h6" fontWeight="bold" color="#212121">
                                            {branch.title}
                                        </Typography>
                                    </Box>
                                </CardContent>

                                <CardContent className={'mb-10'}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="body2" color="#6F6F9D">بخش ها</Typography>
                                    </Box>
                                    <Box pl={3} mt={2} display="flex" flexDirection="column" gap={2}>
                                        {branch.lines.map((lines) => (
                                            <Box key={lines.id} display="flex" justifyContent="space-between"
                                                 alignItems="center">
                                                <Typography variant="body2" color="#212121" fontWeight="medium">
                                                    {lines.title}
                                                </Typography>
                                                <Box display="flex" gap={2}>
                                                    <IconButton size="small" color="primary">
                                                        <EditLineModal id={lines.id} onActionComplete={fetchBranches}/>
                                                    </IconButton>
                                                    <IconButton size="small" color="error">
                                                        <DeleteModal type="line" id={lines.id}
                                                                     onActionComplete={fetchBranches}/>
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>
                                </CardContent>

                                <CardActions
                                    sx={{
                                        position: 'absolute',
                                        bottom: -10,
                                        left: '50%',
                                        transform: 'translateX(-50%)'
                                    }}>
                                    <IconButton size="small" color="primary">
                                        <AddLineModal id={branch.id} onActionComplete={fetchBranches}/>
                                    </IconButton>
                                    <IconButton size="small" color="secondary">
                                        <EditBranchModal id={branch.id} onActionComplete={fetchBranches}/>
                                    </IconButton>
                                    <IconButton size="small" color="error">
                                        <DeleteModal type="branch" id={branch.id} onActionComplete={fetchBranches}/>
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                )}
            < /Grid>
        </Box>
    );
};

export default BranchManagement;
