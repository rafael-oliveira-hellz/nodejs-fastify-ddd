import fs from 'fs';
import YAML from 'yaml';

const file = fs.readFileSync('./openapi/api.yaml', 'utf8');
const swaggerDocument = YAML.parse(file);

/**
 * Set up Swagger documentation for the Fastify server.
 * @param {string} baseUrl - The base URL for the Swagger documentation.
 */
export function setUpSwagger(baseUrl: string) {
  const securitySchemes = swaggerDocument.components?.securitySchemes;
  const clientCredentials = securitySchemes?.oAuth2?.flows?.clientCredentials;

  if (!clientCredentials) {
    throw new Error('Token url not found in swagger document');
  }

  clientCredentials.tokenUrl = 'url';

  const servers = swaggerDocument.servers ?? [];
  servers[0] = servers[0] || {};
  servers[0].url = baseUrl;
}
