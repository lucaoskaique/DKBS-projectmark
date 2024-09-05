import { Global, Module } from '@nestjs/common';
import {
  ConfigurableDatabaseModule,
  CONNECTION_POOL,
  DATABASE_OPTIONS,
} from './database.module-definition';
import { DrizzleService } from './drizzle.service';
import { Pool } from 'pg';
import { DatabaseOptions } from './database-options';

@Global()
@Module({
  providers: [
    DrizzleService,
    {
      provide: CONNECTION_POOL,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        return new Pool({
          host: databaseOptions.host,
          port: databaseOptions.port,
          user: databaseOptions.user,
          password: databaseOptions.password,
          database: databaseOptions.database,
          ssl: false,
        });
      },
    },
  ],
  exports: [DrizzleService],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
