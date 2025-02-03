import { OpenAPIV3 } from 'openapi-types';

export const apiSpec: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: {
    title: 'Fangemeinschaft API',
    version: '1.0.0',
    description: 'API for managing the Fangemeinschaft application'
  },
  servers: [
    {
      url: 'https://api.fangemeinschaft.de/v1',
      description: 'Production server'
    },
    {
      url: 'http://localhost:3000/api/v1',
      description: 'Development server'
    }
  ],
  paths: {
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
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 }
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
    },
    '/auth/logout': {
      post: {
        summary: 'Logout current user',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Logout successful'
          }
        }
      }
    },
    '/news': {
      get: {
        summary: 'Get all news',
        responses: {
          '200': {
            description: 'List of news articles',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/News'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create news article',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NewsInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'News article created',
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
    },
    '/matches': {
      get: {
        summary: 'Get all matches',
        responses: {
          '200': {
            description: 'List of matches',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Match'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create match',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MatchInput'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Match created',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Match'
                }
              }
            }
          }
        }
      }
    },
    '/formations': {
      get: {
        summary: 'Get all formations',
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
    },
    '/formations/{id}/activate': {
      post: {
        summary: 'Activate formation',
        security: [{ bearerAuth: [] }],
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
            description: 'Formation activated'
          }
        }
      }
    },
    '/next-match': {
      get: {
        summary: 'Get active next match',
        responses: {
          '200': {
            description: 'Next match information',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NextMatch'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update next match',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/NextMatchInput'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Next match updated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/NextMatch'
                }
              }
            }
          }
        }
      }
    },
    '/assets': {
      get: {
        summary: 'Get all assets',
        responses: {
          '200': {
            description: 'List of assets',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Asset'
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Upload asset',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  file: {
                    type: 'string',
                    format: 'binary'
                  },
                  name: {
                    type: 'string'
                  }
                },
                required: ['file', 'name']
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Asset uploaded',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Asset'
                }
              }
            }
          }
        }
      }
    },
    '/settings': {
      get: {
        summary: 'Get application settings',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Application settings',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Settings'
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update settings',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SettingsInput'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Settings updated',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Settings'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      News: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string' },
          content: { type: 'string' },
          image: { type: 'string', format: 'uri' },
          category: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        },
        required: ['title', 'content', 'image', 'category', 'date']
      },
      NewsInput: {
        type: 'object',
        properties: {
          title: { type: 'string', minLength: 5, maxLength: 255 },
          content: { type: 'string', minLength: 10 },
          image: { type: 'string', format: 'uri' },
          category: { 
            type: 'string',
            enum: ['Team News', 'Match Report', 'Club News', 'Press Release']
          }
        },
        required: ['title', 'content', 'image', 'category']
      },
      Match: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          date: { type: 'string', format: 'date-time' },
          competition: { type: 'string' },
          homeTeam: { type: 'string' },
          awayTeam: { type: 'string' },
          homeScore: { type: 'integer', nullable: true },
          awayScore: { type: 'integer', nullable: true },
          venue: { type: 'string' },
          played: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      MatchInput: {
        type: 'object',
        properties: {
          date: { type: 'string', format: 'date-time' },
          competition: { type: 'string', minLength: 3 },
          homeTeam: { type: 'string', minLength: 3 },
          awayTeam: { type: 'string', minLength: 3 },
          venue: { type: 'string', minLength: 3 }
        },
        required: ['date', 'competition', 'homeTeam', 'awayTeam', 'venue']
      },
      Formation: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          matchId: { type: 'string', format: 'uuid' },
          active: { type: 'boolean' },
          players: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                playerId: { type: 'string', format: 'uuid' },
                positionX: { type: 'number', minimum: 0, maximum: 100 },
                positionY: { type: 'number', minimum: 0, maximum: 100 }
              }
            }
          },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      FormationInput: {
        type: 'object',
        properties: {
          matchId: { type: 'string', format: 'uuid' },
          players: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                playerId: { type: 'string', format: 'uuid' },
                positionX: { type: 'number', minimum: 0, maximum: 100 },
                positionY: { type: 'number', minimum: 0, maximum: 100 }
              },
              required: ['playerId', 'positionX', 'positionY']
            }
          }
        },
        required: ['matchId', 'players']
      },
      NextMatch: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          matchId: { type: 'string', format: 'uuid' },
          ticketLink: { type: 'string', format: 'uri' },
          moreInfoContent: { type: 'string' },
          active: { type: 'boolean' },
          match: { $ref: '#/components/schemas/Match' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      NextMatchInput: {
        type: 'object',
        properties: {
          ticketLink: { type: 'string', format: 'uri' },
          moreInfoContent: { type: 'string' }
        }
      },
      Asset: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          mimeType: { type: 'string' },
          size: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      Settings: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          logoUrl: { type: 'string', format: 'uri' },
          chatEnabled: { type: 'boolean' },
          buildLabelEnabled: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      SettingsInput: {
        type: 'object',
        properties: {
          logoUrl: { type: 'string', format: 'uri' },
          chatEnabled: { type: 'boolean' },
          buildLabelEnabled: { type: 'boolean' }
        }
      }
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};