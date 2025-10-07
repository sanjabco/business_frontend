import {TextField, Button, CircularProgress} from "@mui/material";
import OtpInput from "react-otp-input";
import {useState, useEffect} from "react";
import {toast} from "react-toastify";
import {useNavigate} from "react-router-dom";
import api from "../../Components/auth/axiosConfig.js";
import {getCookie, isTimePassed, setCookie} from "../../helper";

function Login() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [canResend, setCanResend] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [expireDate] = useState(getCookie("expireDate"));
    const [isCountdownActive, setIsCountdownActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isCodeSend, setIsCodeSend] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (isCountdownActive && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setCanResend(true);
                        return 0;
                    }
                    return prevTime - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isCountdownActive, timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secondsLeft = seconds % 60;
        return `${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
    };

    const sendCode = async () => {
        if (phoneNumber.length !== 11) {
            toast.error("شماره موبایل باید 11 رقم باشد.");
            return;
        }

        if (expireDate && !isTimePassed()) {
            toast.info("دریافت کد هر دو دقیقه یکبار ممکن است.");
            return;
        }

        const data = {phoneNumber};

        try {
            setLoading(true);
            const response = await api.post("/otp", data);
            setCookie("expireDate", response.data.Data.expireDate.split(" ")[1], 0.5);
            setIsCodeSend(true);
            setIsCountdownActive(true);
            setTimeLeft(120);
            setCanResend(false);
        } finally {
            setLoading(false);
        }
    };

    const resendCode = async () => {
        if (!isTimePassed()) {
            toast.info("دریافت کد هر دو دقیقه یکبار ممکن است.");
            return;
        }

        const data = {phoneNumber};
        try {
            setLoading(true);
            await api.post("/otp", data);
            setIsCountdownActive(true);
            setTimeLeft(120);
            setCanResend(false);
        } finally {
            setLoading(false);
        }
    };

    const loginUser = async () => {
        const data = {phoneNumber, code: otpCode};
        try {
            setLoading(true);
            const response = await api.post("/otp/check", data);

            setCookie("jwt", response.data.Data.token, 1);
            api.defaults.headers.common["authorization"] = "Bearer " + response.data.Data.token;

            navigate("/");
            toast.success("به سامانه سنجاب خوشامدید!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f5f5f5",
                padding: "2.7rem",
                height: "100vh",
            }}
        >
            <div style={{
                backgroundColor: "#fff",
                borderRadius: "2rem",
                padding: "2rem",
            }}>
                <div style={{position: "relative", border: "5px solid white", borderRadius: "2rem"}}>
                    <img src="login2.svg" alt="Login Background" style={{borderRadius: "2rem", width: "100%"}}/>
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            backgroundColor: "#fff",
                            border: "8px solid white",
                            borderRadius: "2rem",
                            padding: "1rem",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "1rem",
                        }}
                    >
                        <div className={"flex flex-row gap-3 sm:gap-0 sm:flex-col "}>
                            <h1 style={{fontSize: "1.25rem", fontWeight: "bold"}}>سامانه سنجاب</h1>
                            <p>سامانه اعتبار خرید</p>
                        </div>
                        <img src="sanjab.png" alt="Logo" style={{width: "3rem"}}/>
                    </div>
                </div>

                <div style={{textAlign: "center", marginTop: "1.5rem", marginBottom: "3rem"}}>
                    <h2 style={{fontSize: "1.5rem", fontWeight: "700"}}>ورود به برنامه</h2>
                    <p>شماره همراه خودتون رو وارد کنید تا کد تایید براتون ارسال بشه</p>
                </div>

                <div className={"flex flex-col items-center justify-center w-full"}>
                    <div className={"w-[16.5rem]"}>
                        <div style={{display: "flex", justifyContent: "center", marginBottom: "1.5rem"}}>
                            <TextField
                                sx={{label: {color: "Gray"}}}
                                className="w-full"
                                label="شماره تلفن"
                                placeholder="09123456789"
                                variant="outlined"
                                color="error"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                disabled={isCodeSend}
                            />
                        </div>

                        {isCodeSend && (
                            <div style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "1.5rem",
                                direction: "ltr"
                            }}>
                                <OtpInput
                                    value={otpCode}
                                    onChange={setOtpCode}
                                    numInputs={5}
                                    isInputNum={true}
                                    renderInput={(props) => <input {...props} />}
                                    inputStyle={{
                                        width: "2.5rem",
                                        height: "3rem",
                                        margin: "0.5rem",
                                        fontSize: "1.5rem",
                                        textAlign: "center",
                                        borderRadius: "0.25rem",
                                        border: "1px solid #ccc",
                                    }}
                                    focusStyle={{
                                        border: "1px solid #1abc9c",
                                    }}
                                    separator={<span style={{margin: "0 5px"}}>-</span>}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center", gap: "1rem"}}>
                    {isCodeSend && (
                        <Button
                            sx={{color: "white", width: "30%"}}
                            variant="contained"
                            color="success"
                            onClick={loginUser}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit"/> : "ورود به سامانه"}
                        </Button>
                    )}
                    {isCodeSend ? (
                        <Button
                            sx={{color: "white", width: "30%"}}
                            variant="contained"
                            color="error"
                            onClick={resendCode}
                            disabled={!canResend}
                        >
                            {canResend ? "ارسال مجدد کد" : formatTime(timeLeft)}
                        </Button>
                    ) : (
                        <Button
                            sx={{color: "white", width: "30%"}}
                            variant="contained"
                            color="success"
                            onClick={sendCode}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : "ارسال تایید"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;
