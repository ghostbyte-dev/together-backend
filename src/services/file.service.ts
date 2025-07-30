import { injectable } from 'tsyringe';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

@injectable()
export class FileService {
  async saveAvatar(file: Express.Multer.File, folder: string): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', folder);
    fs.mkdirSync(uploadDir, { recursive: true });

    const compressedBuffer = await this.compressImage(file.buffer, 80);
    const resizedBuffer = await this.resizeImage(compressedBuffer, 200, 200);
    const fileName = `${Date.now()}-avatar.webp`;
    const filePath = path.join(uploadDir, fileName);

    await fs.promises.writeFile(filePath, resizedBuffer);
    const relativePath = `/uploads/${folder}/${fileName}`;
    return relativePath;
  }

  async compressImage(buffer: Buffer, quality: number): Promise<Buffer> {
    return await sharp(buffer).webp({ quality: quality }).toBuffer();
  }

  async resizeImage(buffer: Buffer, height: number, width: number): Promise<Buffer> {
    return await sharp(buffer).resize(width, height).toBuffer();
  }
}
