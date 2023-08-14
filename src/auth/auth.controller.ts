import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/rest';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ) {}

    @Post('register')
    createUser(@Body() createUserDto: CreateUserDto ) {
        return this.authService.create( createUserDto );
    }

    @Post('login')
    loginUser(@Body() loginUserDto: LoginUserDto ) {
        return this.authService.login( loginUserDto );
    }
}