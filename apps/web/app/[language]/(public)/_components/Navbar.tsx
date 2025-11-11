"use client"

import React from 'react';
import Link from "next/link";
import Logo from "@/public/logo.svg"
import Image from "next/image";
import {Loader2} from "lucide-react";
import {ThemeToggle} from "@workspace/ui/components/ThemeToggle";
import {buttonVariants} from "@workspace/ui/components/button";
import {ChangeLangButton} from "@/components/ChangeLangButton";

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
    // const {data: session, isPending} = authClient.useSession()

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
                    <p>
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

                        {/*{isPending && (
                            <Loader2 className={"size-6 animate-spin mx-6"}/>
                        )}

                        {!isPending && session && (
                            <UserDropdown email={session.user.email} name={session.user.name} image={session.user.image!} />
                        )}

                        {!isPending && !session && (
                            <>
                                <Link href={"/login"}
                                      className={buttonVariants({variant: "secondary"})}
                                >
                                    Login
                                </Link>
                                <Link href={"/login"}
                                      className={buttonVariants()}
                                >
                                    Get started
                                </Link>

                            </>
                        )}*/}

                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Navbar;