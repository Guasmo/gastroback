import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    if (!body.email || !body.password) {
      throw new UnauthorizedException('Email y contraseña son requeridos');
    }
    const user = await this.authService.validateUser(body.email, body.password);
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    if (!body.name || !body.email || !body.password) {
      throw new UnauthorizedException('Nombre, email y contraseña son requeridos');
    }
    if (body.password.length < 6) {
      throw new UnauthorizedException('La contraseña debe tener al menos 6 caracteres');
    }
    return this.authService.register(body);
  }
}
