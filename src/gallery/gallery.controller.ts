import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { CreateGalleryDto } from './dto/create-gallery.dto';
import { UpdateGalleryDto } from './dto/update-gallery.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { isArray } from 'class-validator';

@Controller('gallery')
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createGalleryDto: CreateGalleryDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    return this.galleryService.create(createGalleryDto, file);
  }

  @Post('many')
  @UseInterceptors(FileInterceptor('files'))
  createMany(
    @Body() createGalleryDto: CreateGalleryDto[],
    @UploadedFile('files') files: Express.Multer.File[],
  ) {
    return this.galleryService.createMany(createGalleryDto, files);
  }

  @Get()
  findAll() {
    return this.galleryService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const _id = +id;
    if (!isNaN(_id)) {
      return this.galleryService.findOne(_id);
    } else throw new HttpException('id must be a number', 400);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @Param('id') id: string,
    @Body() updateGalleryDto: UpdateGalleryDto,
    @UploadedFile('file') file: Express.Multer.File,
  ) {
    const _id = +id;
    if (!isNaN(_id)) {
    return this.galleryService.update(+id, updateGalleryDto, file);
    } else throw new HttpException('id must be a number', 400);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    const _id = +id;
    if (!isNaN(_id)) {
      return this.galleryService.remove(+id);
    } else throw new HttpException('id must be a number', 400);
  }
}
