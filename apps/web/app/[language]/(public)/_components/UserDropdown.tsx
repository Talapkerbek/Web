"use client"

import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@workspace/ui/components/dropdown-menu";
import {
     BookOpen,
    ChevronDownIcon, HomeIcon,
    LayoutDashboardIcon,
    LogOutIcon,
} from "lucide-react"

import Link from "next/link";
import {Button} from "@workspace/ui/components/button";
import {Avatar, AvatarFallback, AvatarImage} from "@workspace/ui/components/avatar";
import {signOut, useSession} from "next-auth/react";
import {env} from "@/lib/env";

interface IUserDropdownProps  {
    email: string;
    name: string;
    image: string;
}

export default function UserDropdown({email, name, image}: IUserDropdownProps) {

    const handleSignOut =  async () => {
        const endSessionUrl = `${env.NEXT_PUBLIC_IDENTITY_URL}/connect/endsession?post_logout_redirect_uri=${encodeURIComponent(env.NEXT_PUBLIC_NEXTAUTH_URL)}/`;

        await signOut({ redirect: false });

        window.location.href = endSessionUrl;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
                    <Avatar>
                        <AvatarImage src={image} alt="Profile image" />
                        <AvatarFallback>KK</AvatarFallback>
                    </Avatar>
                    <ChevronDownIcon
                        size={16}
                        className="opacity-60"
                        aria-hidden="true"
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={"end"} className="max-w-64">
                <DropdownMenuLabel className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium text-foreground">
                        {name}
                    </span>
                    <span className="truncate text-xs font-normal text-muted-foreground">
                        {email}
                    </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/">
                            <HomeIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/course">
                            <BookOpen size={16} className="opacity-60" aria-hidden="true" />
                            <span>Courses</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                        <Link href="/admin">
                            <LayoutDashboardIcon size={16} className="opacity-60" aria-hidden="true" />
                            <span>Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
