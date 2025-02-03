# API Documentation

## Overview

The Fangemeinschaft API provides endpoints for managing all aspects of the application. The API is documented using OpenAPI/Swagger specifications and implements various middleware for security, validation, and performance.

## OpenAPI Specification

The API specification is defined in `src/lib/openapi.ts` and serves multiple purposes:

1. API Documentation
2. Request/Response Type Generation
3. API Testing Contract
4. Client SDK Generation
5. Swagger UI Documentation

### Specification Structure

```typescript
export const apiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Fangemeinschaft API',
    version: '1.0.0'
  },
  paths: {
    '/news': {
      // News endpoints
    },
    '/matches': {
      // Match endpoints
    },
    '/team': {
      // Team endpoints
    }
    // ... other endpoints
  }
};
```

## Authentication

All admin endpoints require JWT authentication:

```typescript
// Example authentication check
const isAuthenticated = await isAuthenticated(request);
if (!isAuthenticated) {
  return new Response('Unauthorized', { status: 401 });
}
```

## Endpoints

### Authentication
- `POST /api/auth/login` - Login with credentials
- `POST /api/auth/logout` - End session

### News
- `GET /api/news` - List all news
- `POST /api/news` - Create news article
- `PUT /api/news/:id` - Update news article
- `DELETE /api/news/:id` - Delete news article

### Matches
- `GET /api/matches` - List all matches
- `POST /api/matches` - Create match
- `PUT /api/matches/:id` - Update match
- `DELETE /api/matches/:id` - Delete match

### Team
- `GET /api/team` - List all players
- `POST /api/team` - Create player
- `PUT /api/team/:id` - Update player
- `DELETE /api/team/:id` - Delete player

### Fanclubs
- `GET /api/fanclubs` - List all fanclubs
- `POST /api/fanclubs` - Create fanclub
- `PUT /api/fanclubs/:id` - Update fanclub
- `DELETE /api/fanclubs/:id` - Delete fanclub

### Settings
- `GET /api/settings` - Get application settings
- `POST /api/settings` - Update settings

## Request Validation

All requests are validated using Zod schemas:

```typescript
const newsSchema = z.object({
  title: z.string().min(5).max(255),
  content: z.string().min(10),
  image: z.string().url(),
  category: z.enum(['Team News', 'Match Report', 'Club News', 'Press Release']),
  date: z.date()
});
```

## Response Format

### Success Response
```json
{
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "error": "Error Type",
  "message": "Error description",
  "details": [
    {
      "path": "field.name",
      "message": "Validation error message"
    }
  ]
}
```

## Middleware

The API uses several middleware functions for security and functionality:

### 1. Authentication Middleware
```typescript
export function withAuth(handler: APIRoute): APIRoute {
  return async (context) => {
    if (!await isAuthenticated(context.request)) {
      return new Response('Unauthorized', { status: 401 });
    }
    return handler(context);
  };
}
```

### 2. Validation Middleware
```typescript
export function validateRequest<T>(schema: z.ZodSchema<T>) {
  return (handler: APIRoute): APIRoute => {
    return async (context) => {
      try {
        const data = await context.request.formData();
        const validatedData = await schema.parseAsync(Object.fromEntries(data));
        context.locals.validatedData = validatedData;
        return handler(context);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return new Response(JSON.stringify({
            error: 'Validation failed',
            issues: error.issues
          }), { status: 400 });
        }
        throw error;
      }
    };
  };
}
```

### 3. Rate Limiting Middleware
```typescript
export function withRateLimit(limit: number, window: number) {
  return (handler: APIRoute): APIRoute => {
    return async (context) => {
      const ip = context.request.headers.get('x-forwarded-for');
      // Rate limiting logic
      return handler(context);
    };
  };
}
```

## Security Features

1. Authentication
   - JWT tokens
   - Secure session handling
   - Password hashing
   - CSRF protection

2. Request Validation
   - Input sanitization
   - Schema validation
   - Type checking
   - Error handling

3. Rate Limiting
   - Request throttling
   - IP-based limits
   - Custom window sizes
   - Burst allowance

4. Error Handling
   - Standardized errors
   - Detailed messages
   - Security considerations
   - Audit logging

## Testing

The API includes comprehensive testing:

```typescript
describe('News API', () => {
  test('should create news', async () => {
    const news = await createNews({
      title: 'Test News',
      content: 'Test content'
    });
    expect(news).toHaveProperty('id');
  });
});
```

## OpenAPI Usage

The OpenAPI specification in `src/lib/openapi.ts` describes all API endpoints implemented in `pages/api/*`. To add new endpoints:

1. Add path specification
2. Define request/response schemas
3. Document security requirements
4. Add example responses
5. Update TypeScript types

Example:
```typescript
'/news/{id}': {
  get: {
    summary: 'Get news article by ID',
    parameters: [
      {
        name: 'id',
        in: 'path',
        required: true,
        schema: {
          type: 'string',
          format: 'uuid'
        }
      }
    ],
    responses: {
      '200': {
        description: 'News article',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/News'
            }
          }
        }
      }
    }
  }
}
```

## Expanding the OpenAPI Specification

### Adding New Endpoints

To add new endpoints to the OpenAPI specification in `src/lib/openapi.ts`, follow these steps:

1. **Add Path Object**
```typescript
paths: {
  '/new-endpoint': {
    get: {
      summary: 'Description of the endpoint',
      parameters: [], // If needed
      security: [], // If authentication required
      responses: {
        '200': {
          description: 'Success response description',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ResponseSchema'
              }
            }
          }
        }
      }
    }
  }
}
```

2. **Define Schemas**
```typescript
components: {
  schemas: {
    ResponseSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        name: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' }
      },
      required: ['id', 'name']
    }
  }
}
```

3. **Add Security Requirements** (if needed)
```typescript
security: [
  { bearerAuth: [] }
],
securitySchemes: {
  bearerAuth: {
    type: 'http',
    scheme: 'bearer',
    bearerFormat: 'JWT'
  }
}
```

### Required Attributes

Each endpoint should specify:

1. **HTTP Method**
   ```typescript
   '/endpoint': {
     get: {}, // GET method
     post: {}, // POST method
     put: {}, // PUT method
     delete: {} // DELETE method
   }
   ```

2. **Parameters** (if any)
   ```typescript
   parameters: [
     {
       name: 'id',
       in: 'path', // path, query, header, cookie
       required: true,
       schema: {
         type: 'string',
         format: 'uuid'
       }
     }
   ]
   ```

3. **Request Body** (for POST/PUT)
   ```typescript
   requestBody: {
     required: true,
     content: {
       'application/json': {
         schema: {
           $ref: '#/components/schemas/RequestSchema'
         }
       }
     }
   }
   ```

4. **Responses**
   ```typescript
   responses: {
     '200': {
       description: 'Success response',
       content: {
         'application/json': {
           schema: {
             $ref: '#/components/schemas/ResponseSchema'
           }
         }
       }
     },
     '400': {
       description: 'Bad request'
     },
     '401': {
       description: 'Unauthorized'
     }
   }
   ```

5. **Security Requirements**
   ```typescript
   security: [
     {
       bearerAuth: []
     }
   ]
   ```

### Example: Adding Authentication Endpoint

```typescript
// Adding login endpoint
'/auth/login': {
  post: {
    summary: 'Login with credentials',
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              email: { 
                type: 'string', 
                format: 'email' 
              },
              password: { 
                type: 'string',
                minLength: 8 
              }
            },
            required: ['email', 'password']
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Login successful',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: { type: 'string' }
              }
            }
          }
        }
      },
      '401': {
        description: 'Invalid credentials'
      }
    }
  }
}
```

### Example: Adding Formation Management

```typescript
// Adding formation endpoints
'/formations': {
  get: {
    summary: 'Get all formations',
    security: [{ bearerAuth: [] }],
    responses: {
      '200': {
        description: 'List of formations',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Formation'
              }
            }
          }
        }
      }
    }
  },
  post: {
    summary: 'Create formation',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/FormationInput'
          }
        }
      }
    },
    responses: {
      '201': {
        description: 'Formation created',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Formation'
            }
          }
        }
      }
    }
  }
}
```

### Best Practices

1. **Documentation**
   - Write clear summaries and descriptions
   - Document all parameters
   - Include example responses
   - Describe error cases

2. **Schema Organization**
   - Use reusable components
   - Define common patterns
   - Version schemas appropriately
   - Document schema changes

3. **Security**
   - Document authentication requirements
   - Specify authorization scopes
   - Include rate limiting info
   - Document security considerations

4. **Response Codes**
   - Use standard HTTP status codes
   - Document all possible responses
   - Include error response formats
   - Provide example error messages

5. **Testing**
   - Validate schema compliance
   - Test all endpoints
   - Verify security requirements
   - Check response formats
