import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TopicsModule } from './topics/topics.module';
import { DatabaseModule } from './database/database.module';
import { z } from 'zod';
import { UsersModule } from './users/users.module';
import { ResourcesModule } from './resources/resources.module';

const envSchema = z.object({
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config: Record<string, unknown>) => {
        const result = envSchema.safeParse(config);
        if (result.success === false) {
          throw new Error(
            `Config validation error: ${result.error.toString()}`,
          );
        }
        return result.data;
      },
    }),
    DatabaseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('POSTGRES_HOST', 'localhost'),
        port: configService.get<number>('POSTGRES_PORT', 5432),
        user: configService.get<string>('POSTGRES_USER', 'defaultUser'),
        password: configService.get<string>(
          'POSTGRES_PASSWORD',
          'defaultPassword',
        ),
        database: configService.get<string>('POSTGRES_DB', 'defaultDatabase'),
      }),
    }),
    TopicsModule,
    UsersModule,
    ResourcesModule,
  ],
  providers: [AppService],
})
export class AppModule {}
