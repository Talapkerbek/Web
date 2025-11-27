"use client"

import React from 'react';
import InstitutionForAdminHeader
    from "@/app/[language]/(protected)/admin/institutions/[institutionId]/_components/InstitutionForAdminHeader";
import InstitutionPrimaryAdmin
    from "@/app/[language]/(protected)/admin/institutions/[institutionId]/_components/InstitutionPrimaryAdmin";

const Page = () => {

    return (
        <>
            <InstitutionForAdminHeader/>
            <InstitutionPrimaryAdmin/>
        </>
    );
};

export default Page;