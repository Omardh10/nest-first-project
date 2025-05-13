import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { Express, Response } from "express";
@Controller('/api/upload')
export class UploadController {
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './images',
            filename: (req, file, cb) => {
                const prefix = `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
                const filename = `${prefix}-${file.originalname}`;
                cb(null, filename);
            }
        }),
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true)
            } else {
                cb(new BadRequestException("uploaded images just"), false)
            }
        },
        limits: {
            fileSize: 1024 * 1024 * 2
        }
    }))
    public uploadfile(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException("no file provided")
        console.log("file uploaded", { file });
        return { message: "file uploaded successfully" }

    }

    @Get('/:image')
    public showimage(@Param('image') image: string, @Res() res: Response) {
        return res.sendFile(image, { root: 'images' })
    }
}