import React from 'react';
import {Ban, PlusCircle} from "lucide-react";
import {buttonVariants} from "@workspace/ui/components/button";

// The destination app must provide next lib.
// @ts-ignore
import Link from "next/link";

interface IEmptyStateProps {
    title: string;
    description: string;
    buttonText: string;
    href: string;
}

const EmptyState = ({title, description, buttonText, href} : IEmptyStateProps) => {
    return (
        <div className={"flex flex-col h-full items-center justify-center rounded-md border-dashed border p-8 text-center animate-in fade-in-50"}>
            <div>
                <Ban className={"size-10 text-primary"}/>
            </div>
            <h2 className={"mt-6 text-2xl font-semibold"}>{title}</h2>
            <p className={"mb-8 mt-2 text-center text-sm leading-tight text-muted-foreground"}>{description}</p>
            <Link href={href} className={buttonVariants()}>
                <PlusCircle className={"size-4 mr-2"}/>
                {buttonText}
            </Link>
        </div>
    );
};

export default EmptyState;