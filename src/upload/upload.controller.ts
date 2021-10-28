import { Controller, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { multerOptions } from '../lib/multerOption';
import { AuthGuard } from 'src/middleware/authMiddleware';

@Controller('upload')
export class UploadController {
	constructor(
		private readonly uploadService: UploadService,
	) { }

	@UseInterceptors(FilesInterceptor('images', null, multerOptions))
	@Post('/')
	public uploadFiles(
		@UploadedFiles() files: File[],
	) {
		const uploadedFiles: string[] = this.uploadService.uploadFiles(files);

		return {
			status: 200,
			message: '파일 업로드를 성공하였습니다.',
			data: {
				files: uploadedFiles,
			},
		};
	}
}