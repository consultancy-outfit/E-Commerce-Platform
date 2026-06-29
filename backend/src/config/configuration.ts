/** Centralised typed access to environment configuration. */
export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://127.0.0.1:27017/maison',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY ?? '',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  uploadDir: process.env.UPLOAD_DIR ?? 'uploads',
});
