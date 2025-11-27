import {InstitutionType} from "@/Data/models/InstitutionType";
import {LocalizedText} from "@/Data/models/LocalizedText";
import {CityShortDto} from "@/Data/models/CityShortDto";
import {InstitutionAdvantageAdminDto} from "@/Data/models/InstitutionAdvantageAdminDto";

export type InstitutionAdminDto = {
    id: string;
    nationalCode?: number;
    name: LocalizedText;
    description: LocalizedText;
    type: InstitutionType,
    studentsCount: number;
    minCostPerYear: number;
    hasHousing?: boolean;
    hasMilitaryDepartment?: boolean;
    logoKey: string;
    webSiteUrl: string;
    coordinates: string;
    address: string;
    advantages: InstitutionAdvantageAdminDto[];
    cityId?: string;
    city?: CityShortDto;
};