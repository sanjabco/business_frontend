import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";

const CustomerDetails = ({open, onClose, customer}) => {
    if (!customer) return null;

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog open={open && !!customer} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle align="center" sx={{fontWeight: "bold"}}>
                جزئیات مشتری
            </DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2}>
                    {[
                        {label: "نام", value: customer.firstName},
                        {label: "نام خانوادگی", value: customer.lastName},
                        {label: "شماره همراه", value: customer.phoneNumber},
                        {label: "کدملی", value: customer.nationalCode},
                        {label: "تاریخ تولد", value: customer.birthDate},
                        {label: "وضعیت تاهل", value: customer.isMarried ? "متاهل" : "مجرد"},
                        {label: "شغل", value: customer.job},
                    ].map((item, index) => (
                        <Typography key={index}>
                            <strong>{item.label}:</strong> {item.value || "—"}
                        </Typography>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions sx={{justifyContent: "center"}}>
                <Button onClick={onClose} color="primary" variant="contained" sx={{px: 4}}>
                    بستن
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CustomerDetails;