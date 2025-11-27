"use client";

import React, {useTransition} from 'react';
import { Button } from "@workspace/ui/components/button";
import { useTranslations } from "next-intl";
import {useForm, Controller, Path} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { DrawerForm } from "@/components/DrawerForm";
import {
    InstitutionGeneralInfoSchemaInputType,
    InstitutionGeneralInfoSchemaOutputType,
    InstitutionGeneralInfoSchema, institutionTypes,
} from "@/app/[language]/(protected)/admin/institutions/_components/createInstitutionSchema";

import {
    Field,
    FieldLabel,
    FieldDescription,
    FieldError,
    FieldGroup,
} from "@workspace/ui/components/field";

import { Input } from "@workspace/ui/components/input";
import {createApi} from "@/lib/axios";
import {useLang} from "@/hooks/useLang";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@workspace/ui/components/select";
import axios from "axios";
import {useSession} from "next-auth/react";
import {toast} from "sonner";
import {getQueryClient} from "@/lib/tanstackQuery/getQueryClient";
import {allInstitutionsShortOptions} from "@/lib/tanstackQuery/options/allInstitutionsShortOptions";
import Uploader from "@/components/fileUploader/Uploader";
import {AxiosApiError, BaseApiResponse} from "@/Data/models/ApiResponse";
import {handleApiError} from "@/lib/handleApiError";
import LocalizationKeys from "@/i18n/messages/LocalizationKeys";
import {
    assignPrimeAdminSchema, AssignPrimeAdminSchemaInput, AssignPrimeAdminSchemaOutput
} from "@/app/[language]/(protected)/admin/institutions/[institutionId]/_components/assignPrimeAdminSchema";
import {institutionPrimaryAdminOptions} from "@/lib/tanstackQuery/options/institutionPrimaryAdminOptions";

export const AssignPrimeAdminForm = ({institutionId} : {institutionId: string}) => {
    const t = useTranslations();
    const lang = useLang()
    const [isPending, startPending] = useTransition();
    const {data: session} = useSession()
    const queryClient = getQueryClient()
    const [open, setOpen] = React.useState(false);

    const form = useForm<AssignPrimeAdminSchemaInput, AssignPrimeAdminSchemaOutput>({
        resolver: zodResolver(assignPrimeAdminSchema),
        defaultValues: {
            email: ""
        },
    });

    const onSubmit = async (values: AssignPrimeAdminSchemaOutput) => {
        const apiCall = async () => {
            try {
                const api = createApi()

                const headers = {
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                    }
                }

                await api.post<BaseApiResponse>("/institutions/assign/primary-admin", {institutionId, ...values}, headers)

                toast.success(t(LocalizationKeys.AdminDashBoard.PrimeAdminAssigned));
                form.reset()
                setOpen(false);

                await queryClient.invalidateQueries({queryKey: institutionPrimaryAdminOptions(institutionId).queryKey})
            }
            catch (error : any) {
                handleApiError(error, t, LocalizationKeys.Prefixes.AdminDashBoard)
            }
        }

        startPending(apiCall)
    }


    return (
        <DrawerForm
            open={open}
            setOpen={setOpen}
            trigger={<Button>{t(LocalizationKeys.AdminDashBoard.AssignPrimeAdmin)}</Button>}
            title={t(LocalizationKeys.AdminDashBoard.AssignPrimeAdmin)}
            description={t(LocalizationKeys.AdminDashBoard.AssignPrimeAdminDescription)}
        >
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FieldGroup>
                    <Controller
                        name={"email"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel>Email</FieldLabel>
                                { /* @ts-ignore */ }
                                <Input
                                    {...field}
                                    placeholder={"email@email"}
                                    type={"email"}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Button type="submit">{t(LocalizationKeys.AdminDashBoard.Assign)}</Button>
            </form>
        </DrawerForm>
    );
};

export default AssignPrimeAdminForm;