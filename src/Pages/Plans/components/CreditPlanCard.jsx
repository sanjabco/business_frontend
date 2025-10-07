import {Box, Typography} from "@mui/material";
import {useState} from "react";
import DeleteModal from "./DeleteModal.jsx";
import EditCreditPlan from "./EditCreditPlan.jsx";

const CreditPlanCard = ({
                            id, section, credit, title, branchSharePercentage, startDate, endDate, onActionComplete
                        }) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const toggleDeleteModal = () => setIsDeleteModalOpen(!isDeleteModalOpen);
    const toggleEditModal = () => setIsEditModalOpen(!isEditModalOpen);

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
                        {section}
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">عنوان:</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {title}
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">مبلغ اعتبار :</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {credit} ریال
                    </Typography>
                </Box>
                <Box sx={{display: "flex", flexDirection: "column", gap: 1}}>
                    <Typography variant="body2">درصد مشارکت شعبه :</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary">
                        {branchSharePercentage} درصد
                    </Typography>
                </Box>
            </Box>

            <Box sx={{flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 2}}>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{display: "flex", alignItems: "center"}}>
                        از تاریخ
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">{startDate}</Typography>
                </Box>
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{display: "flex", alignItems: "center"}}>
                        تا تاریخ
                    </Typography>
                    <Typography variant="body2" fontWeight="bold">{endDate}</Typography>
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

                <EditCreditPlan
                    open={isEditModalOpen}
                    onClose={toggleEditModal}
                    type="creditplan"
                    id={id}
                    onActionComplete={onActionComplete}
                />
                <DeleteModal
                    type={"creditplan"}
                    open={isDeleteModalOpen}
                    onClose={toggleDeleteModal}
                    id={id}
                    onActionComplete={onActionComplete}
                />

            </Box>

        </Box>
    );
};

export default CreditPlanCard;
