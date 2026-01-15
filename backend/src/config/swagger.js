// src/config/swagger.js
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger le fichier YAML de documentation
const swaggerDocument = YAML.load(join(__dirname, '../../docs/swagger.yml'));

// Configuration de l'interface Swagger UI
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Task Manager - Documentation'
};

export { swaggerDocument, swaggerUi, swaggerUiOptions };