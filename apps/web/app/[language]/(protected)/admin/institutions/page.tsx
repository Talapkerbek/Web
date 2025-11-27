import React from 'react';
import {getQueryClient} from "@/lib/tanstackQuery/getQueryClient";
import InstitutionsList from "@/app/[language]/(protected)/admin/institutions/_components/InstitutionsList";
import {getTranslations} from "next-intl/server";
import CreateInstitutionForm from "@/app/[language]/(protected)/admin/institutions/_components/createInstitutionForm";

const Page = async () => {
    const t = await getTranslations("AdminDashBoard")

    return (
        <>
            <div className={"flex items-center justify-between"}>
                <h1 className={"text-2xl font-bold"}>{t("Institutions")}</h1>

                <CreateInstitutionForm/>
            </div>
            <InstitutionsList/>
        </>
    );
};

export default Page;