"use client"

import {
    IconCreditCard, IconDashboard,
    IconDotsVertical,
    IconLogout,
    IconNotification,
    IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@workspace/ui/components/sidebar"
import Link from "next/link";
import {HomeIcon, Tv2Icon} from "lucide-react";
import {signIn, signOut, useSession} from "next-auth/react";
import {useTranslations} from "next-intl";
import {Button} from "@workspace/ui/components/button";
import {env} from "@/lib/env";
import LocalizationKeys from "@/i18n/messages/LocalizationKeys";

export function NavUser() {
    const { isMobile } = useSidebar()

    const {data: session, status} = useSession()
    const t = useTranslations()

    if (status != "authenticated") {
        return null
    }

    const user = {
        name: session.user.name,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
        avatar: session.user.image ?? `https://avatar.vercel.sh/${session.user.email}`
    }

    const handleSignOut =  async () => {
        const endSessionUrl = `${env.NEXT_PUBLIC_BACKEND_URL}/connect/endsession?post_logout_redirect_uri=${encodeURIComponent(env.NEXT_PUBLIC_NEXTAUTH_URL)}/`;

        await signOut({ redirect: false });

        window.location.href = endSessionUrl;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback className="rounded-lg">
                                    {user.firstName[0]}
                                    {user.lastName[0]}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {user.name && user.name}
                                {!user.name && user.email.split("@")[0]}
                            </span>
                            <span className="text-muted-foreground truncate text-xs">
                              {user.email}
                            </span>
                            </div>
                            <IconDotsVertical className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                    <AvatarFallback className="rounded-lg">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    {user.name && user.name}
                                    {!user.name && user.email.split("@")[0]}
                                    <span className="text-muted-foreground truncate text-xs">
                    {user.email}
                  </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem  className={"cursor-pointer"} asChild>
                                <Link
                                    href={"/"}
                                >
                                    <HomeIcon />
                                    {t(LocalizationKeys.AdminDashBoard.HomePage)}
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className={"cursor-pointer"} asChild>
                                <Link
                                    href={"/admin"}
                                >
                                    <IconDashboard />
                                    {t(LocalizationKeys.AdminDashBoard.Dashboard)}
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem className={"cursor-pointer"} asChild>
                                <Link
                                    href={"/admin/courses"}
                                >
                                    <Tv2Icon />
                                    {t(LocalizationKeys.AdminDashBoard.Institutions)}
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleSignOut}>
                            <IconLogout />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

