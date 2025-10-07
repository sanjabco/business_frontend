import {Box, Typography} from "@mui/material";
import DeleteModal from "./DeleteModal.jsx";
import {useState} from "react";
import EditCashBack from "./EditCashBack.jsx";

const CashbackCard = ({
                          id,
                          section,
                          branch,
                          percentage,
                          branchSharePercentage,
                          maxAmount,
                          startDate,
                          ExpirationInDays,
                          endDate,
                          onActionComplete,
                      }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const toggleDeleteModal = () => setIsDeleteModalOpen((prev) => !prev);
    const toggleEditModal = () => setIsEditModalOpen((prev) => !prev);

    return (
        <Box
            sx={{
                backgroundColor: "white",
                borderRadius: "12px",
                display: "flex",
                flexDirection: "row",
                padding: 3,
                alignItems: "center",
                gap: {xs: 2, sm: 4},
                position: "relative",
                boxShadow: 3,
                width: "100%",
                maxWidth: "600px",
                border: "1px solid #e0e0e0",
                marginBottom: 2,
                overflow: "hidden",
                "&:hover": {
                    boxShadow: 6,
                },
            }}
        >
            <Box sx={{flex: 3, display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 4}}>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">شعبه :</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {branch}
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">بخش :</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {section}
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">درصد کش بک :</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {percentage} درصد
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">درصد مشارکت شعبه :</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {branchSharePercentage} درصد
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">سقف مبلغ کش بک :</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {maxAmount} ریال
                    </Typography>
                </Box>
            </Box>

            <Box sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: 2,
                marginRight: 2
            }}>
                <Box>
                    <Typography variant="body2" sx={{display: "flex", alignItems: "center"}}>
                        از تاریخ:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">{startDate}</Typography>
                </Box>
                <Box>
                    <Typography variant="body2" sx={{display: "flex", alignItems: "center"}}>
                        تا تاریخ:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">{endDate}</Typography>
                </Box>
                <Box>
                    <Typography variant="body2" sx={{display: "flex", alignItems: "center"}}>
                        انقضا:
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">{ExpirationInDays} روز</Typography>
                </Box>
            </Box>

            <Box
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <EditCashBack
                    open={isEditModalOpen}
                    onClose={toggleEditModal}
                    onActionComplete={onActionComplete}
                    id={id}
                />
                <DeleteModal
                    type="cashback"
                    id={id}
                    open={isDeleteModalOpen}
                    onClose={toggleDeleteModal}
                    onActionComplete={onActionComplete}
                />
            </Box>
        </Box>
    );
};

export default CashbackCard;
