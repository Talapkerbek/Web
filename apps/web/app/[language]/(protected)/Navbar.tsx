"use client"

import React from 'react';
import Link from "next/link";
import Logo from "@/public/logo.svg"
import Image from "next/image";
import {Loader2} from "lucide-react";
import {ThemeToggle} from "@workspace/ui/components/ThemeToggle";
import {ChangeLangButton} from "@/components/ChangeLangButton";
import {signIn, useSession} from "next-auth/react";
import {Button, buttonVariants} from "@workspace/ui/components/button";
import UserDropdown from "@/app/[language]/(public)/_components/UserDropdown";
import {useLang} from "@/hooks/useLang";
import {useIsMobile} from "@workspace/ui/hooks/use-mobile";

type NavigationItem = {
    name: string;
    href: string;
}

const navigationItems : NavigationItem[] = [
    {
        name: "Home",
        href: "/"
    },
    {
        name: "Courses",
        href: "/courses"
    },
    {
        name: "Dashboard",
        href: "/admin"
    }
]

const Navbar = () => {
    const {data: session, status} = useSession()
    const [lang] = useLang()
    const handleLogin = () => {
        signIn("pharosIdentityServer", {
            callbackUrl: "/", // куда редиректить после логина
        });
    };

    const isMobile = useIsMobile()

    return (
        <header className={"container mx-auto px-4 md:px-6 lg:px-8 sticky top-0 z-50 w-full"}>
            <div className={"flex min-h-16 items-center mx-auto border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60"}>
                <Link href={"/"} className={"flex items-center space-x-2 mr-4"}>
                    <Image
                        width={48}
                        height={48}
                        src={Logo}
                        alt={"logo"}
                        className={"size-9"}
                    />
                    <p className={"hover:text-primary"}>
                        Talapker
                    </p>
                </Link>

                {/* Desktop */}
                <nav className={"hidden md:flex md:flex-1 items-center justify-between "}>
                    <div className={"flex items-center space-x-2"}>
                        {navigationItems.map((item: NavigationItem, index) => (
                            <Link
                                key={index}
                                href={`${item.href}`}
                                className={"text-sm font-medium transition-colors hover:text-primary"}>
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    <div className={"flex space-x-2 items-center"}>
                        <ThemeToggle/>
                        <ChangeLangButton />

                        {status === "loading" && (
                            <Loader2 className={"size-6 animate-spin mx-6"}/>
                        )}

                        {status === "authenticated" && session && (
                            <UserDropdown email={session.user.email ?? ""} name={session.user.firstName ?? "" + session.user.lastName ?? ""} image={session.user.image ?? ""} />
                        )}

                        {status === "unauthenticated" && (
                            <>
                                <Button onClick={handleLogin} variant="secondary">
                                    {lang == "en" && "Log In"}
                                    {lang == "kk" && "Кіру"}
                                    {lang == "ru" && "Войти"}
                                </Button>

                                <Button onClick={handleLogin}>
                                   {lang == "en" && "Get Started"}
                                   {lang == "kk" && "Бастау"}
                                   {lang == "ru" && "Начать"}
                                </Button>
                            </>
                        )}

                    </div>
                </nav>
            </div>
        </header>
    );
};

