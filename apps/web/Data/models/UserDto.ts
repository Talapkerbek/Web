export interface UserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    image: string;
    tenantId: string | null;
}