import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  private supabase;
  
  constructor(private jwtService: JwtService) {
    const supabaseUrl: string = process.env.SUPABASE_URL!;
    const supabaseKey: string = process.env.SUPABASE_KEY!;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('SUPABASE_URL or SUPABASE_KEY is not defined in environment variables.');
    }
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async register(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      throw new UnauthorizedException(error.message);
    }
    return data?.user;
  }

  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error || !data?.session) {
      throw new UnauthorizedException(error?.message || 'Login failed');
    }
    const payload = { email: data.session.user.email, id: data.session.user.id };
    const access_token = this.jwtService.sign(payload, { expiresIn: '3600s' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    return { access_token, refresh_token };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const newAccessToken = this.jwtService.sign({ email: payload.email, id: payload.id }, { expiresIn: '3600s' });
      return { access_token: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(payload: any) {
    return { id: payload.id, email: payload.email };
  }
}
