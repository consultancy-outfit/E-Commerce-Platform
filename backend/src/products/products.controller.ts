import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/roles';
import { imageUploadOptions, uploadedFileUrl } from '../common/upload.config';

type UploadedImage = { filename: string };

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Browse catalog: search, filter, sort, paginate' })
  list(@Query() query: QueryProductsDto) {
    return this.products.query(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single product' })
  findOne(@Param('id') id: string) {
    return this.products.findOne(id);
  }

  // ---- Admin-only write operations ----

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @ApiOperation({ summary: 'Create a product (admin). Accepts an image file or URL.' })
  create(@Body() dto: CreateProductDto, @UploadedFile() file?: UploadedImage) {
    if (file) dto.image = uploadedFileUrl(file.filename);
    return this.products.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data', 'application/json')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @ApiOperation({ summary: 'Update a product (admin)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @UploadedFile() file?: UploadedImage,
  ) {
    if (file) dto.image = uploadedFileUrl(file.filename);
    return this.products.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a product (admin)' })
  remove(@Param('id') id: string) {
    return this.products.remove(id);
  }

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  @ApiOperation({ summary: 'Upload a product image, returns its URL (admin)' })
  upload(@UploadedFile() file?: UploadedImage) {
    return { url: file ? uploadedFileUrl(file.filename) : '' };
  }
}
