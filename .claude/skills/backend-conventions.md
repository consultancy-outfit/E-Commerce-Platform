# Skill: backend-conventions

Reusable conventions for the Maison NestJS backend.

## Repository pattern
- One Mongoose model per domain, wrapped in `<domain>.repository.ts`:
  ```ts
  @Injectable()
  export class ProductsRepository {
    constructor(@InjectModel(Product.name) private readonly model: Model<ProductDocument>) {}
    findById(id: string) { return this.model.findById(id).exec(); }
    // ...query helpers; no business logic here
  }
  ```
- Services contain business logic and depend only on repositories (+ other
  services). Controllers depend only on services and never import a Model.

## DTO validation
- Every body/query is a class with `class-validator` decorators
  (`@IsString`, `@IsEmail`, `@Min`, `@IsEnum`, `@IsOptional`, `@Type` for
  transforms). Global pipe in `main.ts`:
  ```ts
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  ```

## Errors
- Global `AllExceptionsFilter` maps thrown errors to
  `{ statusCode, message, error, path, timestamp }`. Throw Nest `HttpException`
  subclasses (`BadRequestException`, `NotFoundException`, `ForbiddenException`,
  `ConflictException`). Never return a raw stack trace.

## Auth & roles
- `JwtStrategy` validates the bearer token → `req.user = { userId, email, role }`.
- `@UseGuards(JwtAuthGuard)` for authenticated routes.
- `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles('admin')` for admin routes.
- A `@CurrentUser()` param decorator extracts `req.user`. Scope cart/order
  queries by `user: req.user.userId`.

## Stripe (test mode)
- Initialize Stripe with `STRIPE_SECRET_KEY` from config. In checkout, create a
  PaymentIntent (test) or, if no key configured, fall back to a clearly-labelled
  mock payment ref. Store the ref on the order. Document the choice in NOTES.md.

## Local image upload
- `@nestjs/platform-express` `FileInterceptor('image')` with `diskStorage` →
  `./uploads`, randomized filename. Serve statically via
  `ServeStaticModule`/`app.useStaticAssets('uploads', { prefix: '/uploads' })`.
  Store `/uploads/<file>` on the product. Validate mimetype + size.

## Server-side integrity
- Checkout recomputes line totals from the DB product price (not client),
  computes tax = 20%, validates each line `quantity <= stock`, decrements stock,
  then clears the cart — atomically where possible.
