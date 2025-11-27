import { queryOptions } from '@tanstack/react-query'
import {createApi} from "@/lib/axios";
import {InstitutionDto} from "@/Data/models/InstitutionDto";
import {InstitutionAdminDto} from "@/Data/models/InstitutionAdminDto";
import {UserDto} from "@/Data/models/UserDto";
import {getToken} from "next-auth/jwt";
import getAccessToken from "@/lib/auth/getAccessToken";

export const institutionPrimaryAdminOptions = (institutionId: string) =>
    queryOptions({
        queryKey: ['primaryAdmin', institutionId],
        queryFn: async (): Promise<UserDto> => {
            const token = await getAccessToken();

            const api = createApi(token ?? "")
            const res = await api.get(`/institutions/${institutionId}/primary-admin`);

            return res.data;
        },
    });