import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { SignupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.types';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateUserDto, LoginUserDto } from './dto/rest';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService,//? debemos colocarlo en el constructor para usarlo
        private readonly jwtService: JwtService,
    ) {}

    private getJwtToken( userId: string ) {
        //! firmamos los jwt
        return this.jwtService.sign({ id: userId });
    }


    // async signup( signupInput: SignupInput ): Promise<AuthResponse> { 
        
    //     //! usamos un metodo de UsersService:
    //     const user = await this.usersService.create( signupInput )//*No es de TypeORM, es del mismo UsersService. Por eso no importamos el TypeORM en los modulos ni inyectamos el respositorio en el constructor

    //     const token = this.getJwtToken( user.id );
    
    //     return {token, user}
    // }

    // async login( loginInput: LoginInput ): Promise<AuthResponse>{
        
    //     const { email, password } = loginInput;
        
    //     const user = await this.usersService.findOneByEmail( email );//! usamos un metodo de UsersService

    //     if( !bcrypt.compareSync( password, user.password) ){
    //         throw new BadRequestException('Email / Password do not match');
    //     }
        
    //     const token = this.getJwtToken( user.id );
        
    //     return {
    //         token,
    //         user
    //     }
    // }

    async create( createUserDto: CreateUserDto) {

        const user = await this.usersService.create( createUserDto )//*No es de TypeORM, es del mismo UsersService. Por eso no importamos el TypeORM en los modulos ni inyectamos el respositorio en el constructor

        const token = this.getJwtToken( user.id );
    
        return {token, user}

    }

    async login( loginUserDto: LoginUserDto ) {

        const { email, password } = loginUserDto;

        console.log({email,password})
        
        const user = await this.usersService.findOneByEmail( email );//! usamos un metodo de UsersService

        console.log(bcrypt.compareSync( password, user.password))

        if( !bcrypt.compareSync( password, user.password) ){
            throw new BadRequestException('Email / Password do not match');
        }
        
        const token = this.getJwtToken( user.id );

        delete user.password;//*para no mostrar el password

        return {
            token,
            user
        }
    }

    async validateUser( id: string ): Promise<User> {

        const user = await this.usersService.findOneById( id );

        if( !user.isActive ){
            throw new UnauthorizedException(`User is inactive, talk with an admin`);
        }

        delete user.password;

        return user;
    }
    //? revalidamos los jwt
    revalidateToken( user: User ): AuthResponse {

        const token = this.getJwtToken( user.id );

        return { token, user }

    }
}
