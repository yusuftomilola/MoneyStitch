// audit-log.module.ts
import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogService } from './providers/audit-log.service';
import { AuditLogController } from './controllers/audit-log.controller';
import { PaginationModule } from 'src/common/pagination/pagination.module';
import { AuditLogInterceptor } from './interceptors/audit-log.interceptor';

@Global() // Make it global so AuditLogService is available everywhere
@Module({
  imports: [TypeOrmModule.forFeature([AuditLog]), PaginationModule],
  controllers: [AuditLogController],
  providers: [AuditLogService, AuditLogInterceptor],
  exports: [AuditLogService, AuditLogInterceptor],
})
export class AuditLogModule {}
