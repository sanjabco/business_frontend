import {createBrowserRouter} from "react-router-dom";
import App from '../App'
import Dashboard from "../Pages/Dashboard/Dashboard";
import Data from "../Pages/Data/Data";
import Plans from "../Pages/Plans/Plans";
import CustomerSupport from "../Pages/CustomerClub/CustomerClub.jsx";
import Profile from "../Pages/Profile/Profile";
import Login from "../Pages/Login/Login";
import ProtectedRoute from "../Components/auth/ProtectedRoute";
import StoreManagement from "../Pages/store-management/StoreManagement";
import CustomerManagement from "../Pages/customer-management/CustomerManagement";
import AddCustomer from "../Pages/customer-management/components/AddCustomer";
import Transactions from "../Pages/transactions/Transactions";
import CashBack from "../Pages/Plans/CashBack.jsx";
import CreditPlan from "../Pages/Plans/CreditPlan.jsx";
import SmartData from "../Pages/Data/components/SmartData.jsx";
import SMSSystem from "../Pages/sms-system/SMSSystem.jsx";
import CashbackBox from "../Pages/cashback-box/CashbackBox.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute>
            <App/>
        </ProtectedRoute>,
        children: [
            {
                path: "",
                element: <Dashboard/>
            }, {
                path: "store-manager",
                element: <StoreManagement/>
            },
            {
                path: "/customers",
                element: <CustomerManagement/>,
            },
            {
                path: "/customers/add",
                element: <AddCustomer/>
            },
            {
                path: "/transaction",
                element: <Transactions/>
            },
            {
                path: "/data",
                element: <Data/>
            },
            {
                path: "/data/smartdata/:id",
                element: <SmartData/>
            },
            {
                path: "/plans",
                element: <Plans/>
            },
            {
                path: "/plans/cashback",
                element: <CashBack/>
            },
            {
                path: "/plans/credit-plan",
                element: <CreditPlan/>
            },
            {
                path: "/customer-support",
                element: <CustomerSupport/>
            },
            {
                path: "/sms-system",
                element: <SMSSystem/>
            }, {
                path: "/cashback-box",
                element: <CashbackBox/>
            }, {
                path: "/Profile",
                element: <Profile/>
            },
        ]
    },
    {
        path: "/login",
        element: <Login/>
    },
])