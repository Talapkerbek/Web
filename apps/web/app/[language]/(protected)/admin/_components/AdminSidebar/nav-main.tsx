"use client"

import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"

import { Button } from "@workspace/ui/components/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import Link from "next/link";
import {cn} from "@workspace/ui/lib/utils";
import {usePathname} from "next/navigation";
import {LucideIcon} from "lucide-react";
import {useTranslations} from "next-intl";

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon | LucideIcon
    localizationKey: string
  }[]
}) {

    const pathName = usePathname() ?? ""
    const pathWithoutLang = "/" + pathName.split("/").slice(2).join("/")

    const t = useTranslations()
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton tooltip={item.title} asChild className={cn(pathWithoutLang === item.url && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground")}>
                                <Link href={item.url}>
                                    {item.icon && <item.icon />}
                                    <span>{t(item.localizationKey)}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )
}