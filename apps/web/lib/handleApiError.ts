import {toast} from "sonner";
import {ApiResponse, AxiosApiError} from "@/Data/models/ApiResponse";
import LocalizationKeys from "@/i18n/messages/LocalizationKeys";

export function handleApiError(
    error: unknown,
    t: (key: string, params?: any) => string,
    localizationKeyPrefix?: string,
    fallbackMessage?: string
): void {
    const apiError = error as AxiosApiError<ApiResponse>;

    // Network error or no response
    if (!apiError.response) {
        toast.error(t('Network error occurred'))
        return;
    }

    const errorData = apiError.response.data;

    // Use localization key if available

    let prefix = localizationKeyPrefix ? `${localizationKeyPrefix}.` : ""
    if (errorData.localizationKey) {
        toast.error(t(prefix + errorData.localizationKey));
        return;
    }

    // Fallback to error message
    if (errorData.error) {
        toast.error(errorData.error);
        return;
    }

    if (apiError.response.status === 403) {
        toast.error('Forbidden request');
        return;
    }

    toast.error(fallbackMessage || t(LocalizationKeys.Errors.UnknownError));
}