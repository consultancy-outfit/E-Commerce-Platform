import { BadRequestException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto';

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? 'uploads';
const ALLOWED = /\.(jpe?g|png|webp|gif|avif)$/i;

/** Multer options for product image uploads → local /uploads, served statically. */
export const imageUploadOptions = {
  storage: diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => {
      const name = randomBytes(12).toString('hex') + extname(file.originalname).toLowerCase();
      cb(null, name);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (
    _req: unknown,
    file: { originalname: string; mimetype: string },
    cb: (error: Error | null, accept: boolean) => void,
  ) => {
    if (!ALLOWED.test(file.originalname) || !file.mimetype.startsWith('image/')) {
      return cb(new BadRequestException('Only image files are allowed'), false);
    }
    cb(null, true);
  },
};

/** Public URL path for an uploaded file. */
export const uploadedFileUrl = (filename: string) => `/uploads/${filename}`;
