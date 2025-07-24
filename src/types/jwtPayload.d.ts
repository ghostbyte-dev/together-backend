export interface JwtPayload {
    version: number;
    user: {
        id: number;
        email: string;
        name: string;
        communities: number[]
    }
} 