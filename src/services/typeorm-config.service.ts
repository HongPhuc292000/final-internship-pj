import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { IRootConfig } from 'src/types/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<IRootConfig>) {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    const typeOrmConfig = this.configService.getOrThrow('typeorm', {
      infer: true,
    });
    const backupTypeOrmConfig = {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'helen020920',
      database: 'final_internship_db',
      synchronize: false,
    };
    return {
      ...backupTypeOrmConfig,
      ...typeOrmConfig,
      entities: [__dirname + '../**/modules/**/*.entity.{ts,js}'],
    } as TypeOrmModuleOptions;
  }
}
