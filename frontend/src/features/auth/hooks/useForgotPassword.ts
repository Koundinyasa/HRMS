import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAppDispatch } from "../../../hooks/useAppDispatch";

import {
    setForgotPasswordData,
} from "../authSlice";

import {
    useForgotPasswordMutation,
} from "../api/authApi";

export const useForgotPassword = () => {
    const navigate = useNavigate();

    const dispatch = useAppDispatch();

    const [forgotPassword] =
        useForgotPasswordMutation();

    const handleForgotPassword =
        async (
            userId: string,
            mobileNumber: string
        ) => {
            try {
                await forgotPassword({
                    userId,
                }).unwrap();

                dispatch(
                    setForgotPasswordData({
                        userId,
                        mobileNumber,
                    })
                );

                console.log("Redux Saved:", {
                    userId,
                    mobileNumber,
                });

                toast.success(
                    "OTP sent successfully"
                );

                navigate("/verify-otp");
            } catch (error: unknown) {
                toast.error(
                    "Failed to send OTP"
                );
            }
        };

    return {
        handleForgotPassword,
    };
};