import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';

@ApiTags('products')
@Controller('products')
export class RecommendationsController {
  constructor(private readonly recommendations: RecommendationsService) {}

  @Get(':id/recommendations')
  @ApiOperation({ summary: 'Relevant product suggestions for a product (≤4)' })
  forProduct(@Param('id') id: string) {
    return this.recommendations.forProduct(id);
  }
}
