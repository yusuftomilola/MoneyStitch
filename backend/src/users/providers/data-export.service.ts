import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { DataExportResponse } from '../interfaces/responses';
import * as ExcelJS from 'exceljs';
import { EmailService } from 'src/email/email.service';
import { ErrorCatch } from 'src/common/helpers/errorCatch.util';

@Injectable()
export class DataExportService {
  private readonly logger = new Logger(DataExportService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  public async exportUserData(userId: string): Promise<DataExportResponse> {
    this.logger.log(`Starting data export for user: ${userId}`);
    const startTime = Date.now();

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.error(`User ${userId} was not found in the database`);
        throw new NotFoundException('User not found');
      }

      this.logger.log(`User ${userId} found, generating Excel file...`);

      // Create Excel workbook
      const workbook = new ExcelJS.Workbook();
      const userProfileSheet = workbook.addWorksheet('Profile Information');

      // configure columns
      userProfileSheet.columns = [
        { header: 'Field', key: 'field', width: 20 },
        { header: 'Value', key: 'value', width: 50 },
      ];

      // style header row
      userProfileSheet.getRow(1).font = { bold: true, size: 12 };
      userProfileSheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FF2ECC71',
        },
      };
      userProfileSheet.getRow(1).alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };

      // Add user data
      const profileData = [
        { field: 'User ID', value: user.id },
        { field: 'First Name', value: user.firstname },
        { field: 'Last Name', value: user.lastname },
        { field: 'Username', value: user.username },
        { field: 'Bio', value: user.bio },
        { field: 'Email', value: user.email },
        { field: 'Phone', value: user.phone },
        { field: 'Email Verified', value: user.isEmailVerified ? 'Yes' : 'No' },
        { field: 'Account Created', value: user.createdAt.toISOString() },
        {
          field: 'Last Updated',
          value: user.updatedAt?.toISOString() || 'N/A',
        },
      ];

      userProfileSheet.addRows(profileData);

      // Add some styling to data rows
      userProfileSheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          row.alignment = { vertical: 'middle' };
          row.getCell('field').font = { bold: true };
        }
      });

      // generate excel buffer
      const buffer = await workbook.xlsx.writeBuffer();
      const fileSizeKB = (buffer.byteLength / 1024).toFixed(2);

      this.logger.log(
        `Excel file generated successfully. Size: ${fileSizeKB} KB`,
      );

      // Prepare attachment
      const attachments = [
        {
          filename: `moneystitch-data-export-${Date.now()}.xlsx`,
          content: buffer,
          contentType:
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ];

      // send email
      this.logger.log(`Sending data export email to ${user.email}...`);
      await this.emailService.sendDataExport(user, attachments);

      const duration = Date.now() - startTime;
      this.logger.log(
        `Data export for user ${user.id} completed successfully in ${duration}ms`,
      );

      return {
        status: 'success',
        message: 'Data export has been sent to your email address',
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error(
        `Data export failed for user ${userId} after ${duration}ms:`,
        error.stack,
      );

      ErrorCatch(
        error,
        'Failed to generate data export. Please try again later.',
      );
    }
  }
}
