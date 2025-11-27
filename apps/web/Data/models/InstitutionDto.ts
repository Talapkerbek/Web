import {CityShortDto} from "@/Data/models/CityShortDto";
import {InstitutionAdvantageDto} from "@/Data/models/InstitutionAdvantageDto";
import {InstitutionType} from "@/Data/models/InstitutionType";

export interface InstitutionDto {
    id: string;

    nationalCode: number;
    name: string;
    description: string;
    type: InstitutionType;

    studentsCount: number;
    minCostPerYear: number;

    hasHousing: boolean | null;
    hasMilitaryDepartment: boolean | null;

    logoKey: string;
    webSiteUrl: string;
    coordinates: string;
    address: string;

    advantages: InstitutionAdvantageDto[];

    cityId: string | null;
    city: CityShortDto | null;
}
