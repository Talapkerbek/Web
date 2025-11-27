import {CityShortDto} from "@/Data/models/CityShortDto";
import {InstitutionType} from "@/Data/models/InstitutionType";

export interface InstitutionShortDto {
    id: string;
    nationalCode?: number | null;
    name: string;
    description: string;
    city?: CityShortDto | null;
    type: InstitutionType;
    logoKey: string;
}