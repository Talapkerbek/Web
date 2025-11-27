"use client"

import React from 'react';
import {useTheme} from "next-themes";
import {Toaster} from "sonner";

type ToasterTheme = "light" | "dark" | "system" | undefined;

const ToasterProvider = () => {
    const {theme} = useTheme()

    return (
        <Toaster position={"bottom-center"} theme={theme as ToasterTheme} />
    );
};

export default ToasterProvider;