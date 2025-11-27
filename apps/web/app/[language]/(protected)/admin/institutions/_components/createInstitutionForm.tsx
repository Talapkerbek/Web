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

export const CreateInstitutionForm = () => {
    const t = useTranslations();
    const lang = useLang()
    const [isPending, startPending] = useTransition();
    const {data: session} = useSession()
    const queryClient = getQueryClient()
    const [open, setOpen] = React.useState(false);

    const form = useForm<InstitutionGeneralInfoSchemaInputType, InstitutionGeneralInfoSchemaOutputType>({
        resolver: zodResolver(InstitutionGeneralInfoSchema),
        defaultValues: {
            name: { en: "", kk: "", ru: "" },
            nationalCode: 0,
            type: institutionTypes[0],
            fileKey: ""
        },
    });

    const LANGUAGES = [
        { code: "en", label: "Name in English", placeholder: "Al-Farabi Kazakh National University" },
        { code: "kk", label: "Қазақша атауы", placeholder: "Әл-Фараби атындағы Қазақ ұлттық университеті"},
        { code: "ru", label: "Название на русском", placeholder: "Казахский Национальный Университет имени Аль-Фараби" },
    ];

    const onSubmit = async (values: InstitutionGeneralInfoSchemaOutputType) => {
        try {
            const api = createApi()

            const headers = {
                headers: {
                    Authorization: `Bearer ${session?.accessToken}`,
                }
            }

            await api.post<BaseApiResponse>("/institutions/create", values, headers)

            toast.success(t(LocalizationKeys.AdminDashBoard.UniversityCreated));
            form.reset()
            setOpen(false);

            await queryClient.invalidateQueries({queryKey: allInstitutionsShortOptions.queryKey})
        }
        catch (error : any) {
            handleApiError(error, t, LocalizationKeys.Prefixes.AdminDashBoard)
        }
    }


    return (
        <DrawerForm
            open={open}
            setOpen={setOpen}
            trigger={<Button>{t(LocalizationKeys.AdminDashBoard.CreateInstitution)}</Button>}
            title={t(LocalizationKeys.AdminDashBoard.CreateInstitution)}
            description={t(LocalizationKeys.AdminDashBoard.CreateInstitutionFormDescription)}
        >
            <form
                className="space-y-6"
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FieldGroup>
                    {LANGUAGES.map((lang) => (
                    <Controller
                            key={lang.code}
                            name={`name.${lang.code}` as Path<InstitutionGeneralInfoSchemaInputType>}
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={!!fieldState.error}>
                                    <FieldLabel>{lang.label}</FieldLabel>
                                     { /* @ts-ignore */ }
                                    <Input {...field} placeholder={lang.placeholder} />
                                    {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                                </Field>
                            )}
                        />
                    ))}

                    <Controller
                        name={"nationalCode"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel>{t(LocalizationKeys.AdminDashBoard.NationalCode)}</FieldLabel>
                                { /* @ts-ignore */ }
                                <Input
                                    {...field}
                                    placeholder={"0"}
                                    type={"number"}
                                    aria-invalid={fieldState.invalid}
                                />
                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                        )}
                    />

                    <Controller
                        name={"type"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel>Type</FieldLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <SelectTrigger className={"w-full"}>
                                        <SelectValue placeholder={"Select type"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {institutionTypes.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                        )}
                    />


                    <Controller
                        name={"fileKey"}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={!!fieldState.error}>
                                <FieldLabel>Institution logo</FieldLabel>
                                <Uploader value={field.value} onChange={field.onChange}
                                          fileTypeAccepted={'image'}
                                />
                                {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                            </Field>
                        )}
                    />

                </FieldGroup>

                <Button type="submit">{t(LocalizationKeys.AdminDashBoard.CreateInstitution)}</Button>
            </form>
        </DrawerForm>
    );
};

export default CreateInstitutionForm;