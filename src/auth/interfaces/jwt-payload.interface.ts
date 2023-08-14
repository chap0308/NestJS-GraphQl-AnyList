//*es una interfaz porque no se van a crear instancias, solo es para que se vea como va a lucir una variable

export interface JwtPayload {
    id: string;
    iat: number;
    exp: number;
}