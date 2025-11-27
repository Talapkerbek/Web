import { queryOptions } from '@tanstack/react-query'
import {createApi} from "@/lib/axios";
import {InstitutionDto} from "@/Data/models/InstitutionDto";
import {InstitutionAdminDto} from "@/Data/models/InstitutionAdminDto";

export const institutionForAdminQueryOptions = (id: string) =>
    queryOptions({
        queryKey: ['institution', 'institutionForAdmin', id],
        queryFn: async (): Promise<InstitutionAdminDto> => {
            const api = createApi()
            const res = await api.get(`/institutions/admin/${id}`);

            return res.data;
        },
});