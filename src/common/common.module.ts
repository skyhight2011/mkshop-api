import { Module } from '@nestjs/common';
import { ErrorParserService } from './error-parser.service';

@Module({
  providers: [ErrorParserService],
  exports: [ErrorParserService],
})
export class CommonModule {}
