import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../products/products.repository';
import { ProductDocument } from '../products/schemas/product.schema';

const MAX = 4;

/**
 * "Relevant product suggestions" (open-ended requirement).
 * Interpretation: items the shopper is most likely to consider next — same
 * category as the viewed product, ranked by price proximity, then back-filled
 * from the rest of the catalog so the rail is never empty. Reasoning in NOTES.md.
 */
@Injectable()
export class RecommendationsService {
  constructor(private readonly products: ProductsRepository) {}

  async forProduct(id: string): Promise<ProductDocument[]> {
    const base = await this.products.findById(id);
    if (!base) throw new NotFoundException('Product not found');

    const byPriceProximity = (a: ProductDocument, b: ProductDocument) =>
      Math.abs(a.price - base.price) - Math.abs(b.price - base.price);

    const sameCategory = (await this.products.findRelated(base.category, id)).sort(
      byPriceProximity,
    );

    const picks = sameCategory.slice(0, MAX);

    // Back-fill from the wider catalog if the category is thin.
    if (picks.length < MAX) {
      const chosen = new Set(picks.map((p) => String(p._id)));
      chosen.add(id);
      const rest = (await this.products.findAll())
        .filter((p) => !chosen.has(String(p._id)))
        .sort(byPriceProximity);
      picks.push(...rest.slice(0, MAX - picks.length));
    }

    return picks;
  }
}
