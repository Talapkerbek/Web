import React from 'react';
import {useQuery} from "@tanstack/react-query";
import {
    institutionForAdminQueryOptions
} from "@/lib/tanstackQuery/options/institutionForAdminQueryOptions";
import {useParams} from "next/navigation";
import {useTranslations} from "next-intl";
import LocalizationKeys from "@/i18n/messages/LocalizationKeys";
import {useLang} from "@/hooks/useLang";
import {ImageWithFallback} from "@/components/ImageWithFallback";
import {generateS3UrlFromKey} from "@/lib/generateS3UrlFromKey";
import {Badge} from "@workspace/ui/components/badge";
import ChangeInstitutionGeneralInfoForm
    from "@/app/[language]/(protected)/admin/institutions/[institutionId]/_components/changeInstitutionGeneralInfoForm";
import {Skeleton} from "@workspace/ui/components/skeleton";
import {Card, CardContent} from "@workspace/ui/components/card";
import {Building2, Hash} from "lucide-react";

const InstitutionForAdminHeader = () => {
    const {institutionId} = useParams() as {institutionId: string};
    const t = useTranslations()
    const { data: institution, error, refetch, status } = useQuery(institutionForAdminQueryOptions(institutionId))
    const [lang] = useLang()

    console.log(institution)

    if (status == "success") {
        return (
            <Card className="w-full overflow-hidden border-border/50 bg-gradient-to-br from-card to-card/80">
                <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row items-center gap-8">
                        <div className="relative group">
                            <div className="w-full h-full xl:max-w-[300px] rounded-2xl bg-card shadow-lg overflow-hidden transition-all duration-300 group-hover:shadow-xl">
                                <ImageWithFallback
                                    src={generateS3UrlFromKey(institution.logoKey)}
                                    alt={`${institution.name} logo`}
                                    width={160}
                                    height={160}
                                    imageClassName="w-full h-full object-cover aspect-square transition-transform duration-300"
                                    skeletonClassName="w-full h-full"
                                />
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-6 text-center lg:text-left">
                            <div className="space-y-2">
                                <h1 className="text-3xl sm:text-4xl xl:text-5xl font-bold text-foreground leading-tight">
                                    {institution.name[lang]}
                                </h1>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap justify-center lg:justify-start">
                                <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold gap-2">
                                    <Building2 className="w-4 h-4" />
                                    {institution.type}
                                </Badge>

                                {institution.nationalCode != null && (
                                    <Badge variant="outline" className="px-4 py-2 text-sm font-semibold gap-2">
                                        <Hash className="w-4 h-4" />
                                        {t(LocalizationKeys.AdminDashBoard.NationalCode)}: {institution.nationalCode}
                                    </Badge>
                                )}

                                <div className="lg:ml-auto">
                                    <ChangeInstitutionGeneralInfoForm data={institution} />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return <InstitutionForAdminHeaderSkeleton />;
};

const InstitutionForAdminHeaderSkeleton = () => {
    return (
        <Card className="w-full overflow-hidden border-border/50">
            <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Logo skeleton */}
                    <div className="w-32 h-32 xl:w-40 xl:h-40 rounded-2xl border-4 border-border/20 bg-card shadow-lg overflow-hidden">
                        <Skeleton className="w-full h-full rounded-xl" />
                    </div>

                    {/* Content skeleton */}
                    <div className="flex-1 flex flex-col gap-6">
                        {/* Title skeleton */}
                        <div className="space-y-3">
                            <Skeleton className="h-12 w-3/4 mx-auto lg:mx-0" />
                        </div>

                        {/* Badges skeleton */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 flex-wrap justify-center lg:justify-start">
                            <Skeleton className="h-8 w-32 rounded-full" />
                            <Skeleton className="h-8 w-48 rounded-full" />
                            <Skeleton className="h-10 w-24 rounded-lg ml-auto" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default InstitutionForAdminHeader;