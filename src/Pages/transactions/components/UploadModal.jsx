import {useState, useEffect, useRef} from "react";
import {
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    ButtonGroup,
    ClickAwayListener,
    Grow,
    Paper,
    Popper,
    MenuItem,
    MenuList,
    FormControl,
    InputLabel,
    Select,
    Box,
    CircularProgress,
} from "@mui/material";
import {RiFileExcel2Fill} from "react-icons/ri";
import api from "../../../Components/auth/axiosConfig.js";
import {Controller, useForm} from "react-hook-form";
import {toast} from "react-toastify";

const UploadModal = ({open, onClose, onSubmit, refreshTable}) => {
    const [branches, setBranches] = useState([]);
    const [lines, setLines] = useState([]);
    const {control, watch, setValue, reset} = useForm();
    const [loading, setLoading] = useState(false);
    const selectedBranchId = watch("branchId");
    const selectedLineId = watch("lineId");
    const [selectedFile, setSelectedFile] = useState(null);

    const options = [
        {label: "بارگذاری", action: () => handleFileUpload(false)},
        {
            label: "بارگذاری با پیامک", action: () => {
                handleFileUpload(true)
            }
        },
    ];
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [openSplit, setOpenSplit] = useState(false);
    const anchorRef = useRef(null);

    useEffect(() => {
        if (!open) {
            setValue("branchId", "");
            setValue("lineId", "");
            setSelectedFile(null);
            setLines([]);
            reset();
        }
    }, [open, reset, setValue]);

    useEffect(() => {
        const fetchBranches = async () => {
            const {data} = await api.get("/Branch");
            setBranches(data.Data.branches || []);
        };
        fetchBranches();
    }, []);

    const handleBranchChange = (e) => {
        const branchId = e.target.value;
        setValue("branchId", branchId);
        const selectedBranch = branches.find((branch) => branch.id === branchId);
        setLines(selectedBranch?.lines || []);
        setValue("lineId", "");
    };

    const handleFileChange = (file) => {
        setSelectedFile(file);
    };

    const handleFileUpload = async (ShouldSendMessage) => {
        if (!selectedFile) {
            toast.error("لطفاً یک فایل برای بارگذاری انتخاب کنید.");
            return;
        }
        const formData = new FormData();
        formData.append("ExcelFile", selectedFile);
        formData.append("BranchId", selectedBranchId);
        formData.append("LineId", selectedLineId);
        formData.append("ShouldSendMessage", ShouldSendMessage);

        setLoading(true);
        try {
            await api.post("/Transaction/upload", formData, {
                headers: {"Content-Type": "multipart/form-data"},
            });
            toast.success("فایل با موفقیت بارگذاری شد.");
            onSubmit(selectedBranchId, selectedLineId, selectedFile);
            refreshTable();
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = () => {
        const fileUrl = "/assets/SampleImportTransaction.xlsx";
        const link = document.createElement("a");
        link.href = fileUrl;
        link.setAttribute("download", "SampleImportTransaction.xlsx");
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpenSplit(false);
    };

    const handleToggle = () => {
        setOpenSplit((prevOpen) => !prevOpen);
    };

    const handleCloseSplit = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpenSplit(false);
    };

    const handleMainButtonClick = () => {
        options[selectedIndex].action();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    آپلود فایل
                </Typography>
                <Typography variant="body1" mb={2}>
                    لطفاً شعبه و بخش مورد نظر را انتخاب کنید و فایل مربوطه را بارگذاری نمایید.
                </Typography>

                <Box flex={1} mb={2}>
                    <FormControl fullWidth>
                        <InputLabel>شعبه</InputLabel>
                        <Select
                            value={selectedBranchId || ""}
                            onChange={handleBranchChange}
                            label="شعبه"
                        >
                            {branches.map((branch) => (
                                <MenuItem key={branch.id} value={branch.id}>
                                    {branch.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box flex={1} mb={2}>
                    <Controller
                        name="lineId"
                        control={control}
                        render={({field}) => (
                            <FormControl fullWidth disabled={lines.length === 0}>
                                <InputLabel>بخش</InputLabel>
                                <Select {...field} label="بخش" value={field.value || ""}>
                                    {lines.length > 0 ? (
                                        lines.map((line) => (
                                            <MenuItem key={line.id} value={line.id}>
                                                {line.title}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled value="">
                                            هیچ بخشی وجود ندارد
                                        </MenuItem>
                                    )}
                                </Select>
                            </FormControl>
                        )}
                    />
                </Box>

                <Box flex={1} mb={2} className="flex items-center justify-center gap-5">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleDownloadTemplate}
                        className="w-1/2 gap-2"
                    >
                        <RiFileExcel2Fill/>
                        دانلود قالب
                    </Button>
                    <Button
                        variant="outlined"
                        component="label"
                        disabled={!selectedBranchId || !selectedLineId || loading}
                        className="w-1/2"
                    >
                        انتخاب فایل
                        <input
                            type="file"
                            hidden
                            accept=".xlsx, .xls"
                            onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                    </Button>
                    {selectedFile && (
                        <Typography variant="body2" mt={1} color="primary">
                            فایل انتخاب شده: {selectedFile.name}
                        </Typography>
                    )}
                </Box>

                {loading && (
                    <Box display="flex" justifyContent="center" mt={2}>
                        <CircularProgress size={24}/>
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    لغو
                </Button>
                <ButtonGroup variant="contained" ref={anchorRef} color="primary">
                    <Button onClick={handleMainButtonClick} disabled={!selectedFile || loading}>
                        {options[selectedIndex].label}
                    </Button>
                    <Button
                        color="primary"
                        size="small"
                        onClick={handleToggle}
                        disabled={!selectedFile || loading}
                    >
                        ▼
                    </Button>
                </ButtonGroup>
                <Popper open={openSplit} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({TransitionProps, placement}) => (
                        <Grow
                            {...TransitionProps}
                            style={{
                                transformOrigin:
                                    placement === "bottom" ? "center top" : "center bottom",
                            }}
                        >
                            <Paper>
                                <ClickAwayListener onClickAway={handleCloseSplit}>
                                    <MenuList id="split-button-menu">
                                        {options.map((option, index) => (
                                            <MenuItem
                                                key={option.label}
                                                selected={index === selectedIndex}
                                                onClick={(event) => handleMenuItemClick(event, index)}
                                            >
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper>
            </DialogActions>
        </Dialog>
    );
};

export default UploadModal;
