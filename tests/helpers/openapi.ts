import { OpenAPIV3 } from 'openapi-types';
import { apiSpec } from '../../src/lib/openapi';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ strict: false });
addFormats(ajv);

export function validateResponse(path: string, method: string, statusCode: number, response: any) {
  const operation = apiSpec.paths[path]?.[method.toLowerCase()];
  if (!operation) {
    throw new Error(`No OpenAPI spec found for ${method} ${path}`);
  }

  const responseSpec = operation.responses[statusCode.toString()];
  if (!responseSpec) {
    throw new Error(`No response spec found for ${method} ${path} ${statusCode}`);
  }

  const schema = (responseSpec.content?.['application/json'].schema as OpenAPIV3.SchemaObject);
  const validate = ajv.compile(schema);
  
  const valid = validate(response);
  if (!valid) {
    throw new Error(`Response validation failed: ${JSON.stringify(validate.errors)}`);
  }

  return true;
}

export function validateRequest(path: string, method: string, request: any) {
  const operation = apiSpec.paths[path]?.[method.toLowerCase()];
  if (!operation) {
    throw new Error(`No OpenAPI spec found for ${method} ${path}`);
  }

  const requestSpec = operation.requestBody?.content?.['application/json'].schema as OpenAPIV3.SchemaObject;
  if (!requestSpec) {
    throw new Error(`No request spec found for ${method} ${path}`);
  }

  const validate = ajv.compile(requestSpec);
  
  const valid = validate(request);
  if (!valid) {
    throw new Error(`Request validation failed: ${JSON.stringify(validate.errors)}`);
  }

  return true;
}