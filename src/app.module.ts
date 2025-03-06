import { Module, CacheModule } from '@nestjs/common';
import { DummyModule } from './dummy/dummy.module';

@Module({
  imports: [
    CacheModule.register({ ttl: 60, max: 100, isGlobal: true }), // Cache global machen
    DummyModule,
  ],
})
export class AppModule {}
