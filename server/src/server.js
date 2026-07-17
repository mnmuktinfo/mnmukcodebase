'use strict';

const { app } = require('./app');
const { connectDB } = require('./config/db'); // adjust path to match your project
const { env } = require('./config/env');       // adjust path to match your project
const { logger } = require('./utils/logger');

const PORT = env.PORT || 3000;

// Start HTTP server immediately — don't gate it on DB connectivity.
// This ensures Render's port scan succeeds even if Mongo is slow/down.
const server = app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

// Connect to Mongo in parallel; log clearly if it fails.
connectDB().catch((err) => {
  logger.error({ err: err.message }, 'Failed to connect to MongoDB on startup');
  // If your app genuinely cannot function without the DB, uncomment:
  // process.exit(1);
});

// Safety nets so nothing crashes silently again
process.on('unhandledRejection', (err) => {
  logger.error({ err }, 'Unhandled promise rejection');
});

process.on('uncaughtException', (err) => {
  logger.error({ err }, 'Uncaught exception');
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});