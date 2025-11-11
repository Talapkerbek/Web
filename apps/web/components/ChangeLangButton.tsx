"use client";

import * as React from "react";
import {Button} from "@workspace/ui/components/button";
import {useLang} from "@/hooks/useLang";
import {LanguageType} from "@/lib/lang/LanguageType";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";

export function ChangeLangButton() {
    const [currentLang, changeLang] = useLang();
    const [selected, setSelected] = React.useState<LanguageType>(currentLang ?? "kk");


    React.useEffect(() => {
        setSelected(currentLang ?? "kk");
    }, [currentLang]);

    const handleChange = (lang: LanguageType) => {
        changeLang(lang)
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <span className="text-sm font-semibold uppercase">{selected}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center">
                <DropdownMenuItem onClick={() => handleChange("kk")}>
                    Қазақша
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChange("ru")}>
                    Русский
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleChange("en")}>
                    English
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
