import { queryOptions } from '@tanstack/react-query'
import {env} from "@/lib/env";
import {InstitutionShortDto} from "@/Data/models/InstitutionShortDto";
import getAccessToken from "@/lib/auth/getAccessToken";
import {createApi} from "@/lib/axios";

export const allInstitutionsShortOptions = queryOptions({
    queryKey: ['institution'],
    queryFn: async () : Promise<InstitutionShortDto[]> => {
        let token = await getAccessToken()

        const api = createApi(token ?? "")
        const res = await api.get(`/institutions/all`);

        return res.data
    }
});