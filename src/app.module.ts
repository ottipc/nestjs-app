import { Module, CacheModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CacheModule.register({
      ttl: 5, // Sekunden
      max: 100,
    }),
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
