"use client"
import React from 'react';
import {useParams} from "next/navigation";

const Page = () => {
    const {institutionId} = useParams() as {institutionId: string}

    return (
        <div>
            {institutionId}
        </div>
    );
};

export default Page;