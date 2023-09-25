/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {
  'POST /api/generate/data': {
    controller: 'RandomDataController',
    action: 'generateRandomData',
    swagger: {
      summary:
        'Generates random data based on the provided structure and array length.',
      tags: ['generation'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully generated data',
          schema: {
            type: 'object',
            example: [
              // Example of generated random data (array of objects)
              {
                id: '19034998-e60a-4b02-bf3f-570c364d5fd4',
                name: 'nS,+T|-J!^',
                age: 82,
                address: {
                  routes: '%Chv;fyK6o',
                  number: '905.690.2220 x749',
                },
                subject: [
                  // Nested array of objects (subject)
                  {
                    name: '$6u%KX3YBa',
                    marks: 29,
                    grade: [
                      // Nested array of objects (grade)
                      {
                        name: 'P0p+T$j2P7',
                        marks: 90,
                        grade: '?MIZiVS@U/',
                      },
                      {
                        name: '$*M6-Uzrc&',
                        marks: 3,
                        grade: '6ZAZIgvG<^',
                      },
                    ],
                  },
                  // ... (more objects in subject array)
                ],
              },
              // ... (more generated data objects)
            ],
          },
        },
      },
      parameters: [
        {
          in: 'body',
          required: true,
          schema: {
            type: 'object',
            example: {
              // Example structure for generating random data
              structure: {
                id: 'uuid',
                name: 'string',
                age: 'number',
                // Nested object (address)
                address: {
                  routes: 'string',
                  number: 'contact',
                },
                subject: [
                  {
                    name: 'string',
                    marks: 'number',
                    grade: [
                      {
                        name: 'string',
                        marks: 'number',
                        grade: 'string',
                      },
                      {
                        arrayLength: 2,
                      },
                    ],
                  },
                  {
                    arrayLength: 3,
                  },
                ],
                arrayOfObjects: [
                  {
                    property1: 'string',
                    property2: 'number',
                  },
                  {
                    arrayLength: 2,
                  },
                ],
                arrayOfStrings: [
                  'string',
                  {
                    arrayLength: 3,
                  },
                ],
                arrayOfNumbers: [
                  'number',
                  {
                    arrayLength: 3,
                  },
                ],
                arrayOfArrays: [
                  'arrayOfArray',
                  {
                    arrayLength: 2,
                  },
                ],
              },
              arrayLength: 2,
            },
            properties: {
              structure: {
                type: 'object',
              },
              arrayLength: {
                type: 'number',
              },
            },
          },
        },
      ],
      security: [
        {
          Authorization: ['api-key'],
        },
      ],
    },
  },
  'POST /user/api-key': {
    controller: 'AuthController',
    action: 'getApiKey',
    swagger: {
      summary: 'this endpoint help user to generate api key',
      tags: ['api-key'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully generated api key',
          schema: {
            type: 'object',
            example: {
              apikey: 'hbGciOiJIUzI1Ni****ssw5c',
            },
          },
        },
      },
      parameters: [
        {
          in: 'body',
          name: 'email',
          required: true,
          schema: {
            type: 'object',
            example: {
              email: 'your@email.com',
            },
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      ],
    },
  },
  'POST /user/forgot-api-key': {
    controller: 'AuthController',
    action: 'forgotKey',
    swagger: {
      summary: 'this endpoint help user to get forgot api key',
      tags: ['api-key'],
      consumes: ['application/json'],
      produces: ['application/json'],
      responses: {
        200: {
          description: 'Successfully sent api key on mail',
        },
      },
      parameters: [
        {
          in: 'body',
          name: 'email',
          required: true,
          schema: {
            type: 'object',
            example: {
              email: 'your@email.com',
            },
            properties: {
              email: {
                type: 'string',
              },
            },
          },
        },
      ],
    },
  },
};
