export interface LoginUser {
    email:string;
    password:string;
}

export interface RefreshResponse {
    accessToken: string;
}