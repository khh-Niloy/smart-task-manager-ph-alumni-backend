import { Response } from "express";

const setCookie = (res: Response, accessToken: string, refreshToken: string)=>{
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
}

const clearCookie = (res: Response)=>{
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
}

export const cookiesService = {
    setCookie,
    clearCookie
}