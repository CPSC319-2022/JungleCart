import { Router } from 'express';
const router = Router();
import { resolve } from 'path';

import { serve, setup } from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';
dotenv.config();
const PORT = process.env.PORT || 10010;
const options = {
  swaggerDefinition: {
    info: {
      title: 'Swagger API Docs',
      version: '1.0.0',
      description: ' Swagger test document ',
    },
    host: `localhost:${PORT}`,
    basePath: '/',
  },
  apis: [resolve(__dirname, '../../src/routes/*.ts')],
};

const specs = swaggerJsdoc(options);
router.use('/api-docs', serve, setup(specs));

export default router;
