import { Elysia } from 'elysia'

export const prdExampleController = new Elysia({ prefix: '/prd' })
  .get('/:id/example', () => ({
    data: [
      { id: '1', name: 'Project Alpha', description: 'Example for e-commerce', examples: 5 },
      { id: '2', name: 'Project Beta', description: 'Example for inventory', examples: 3 },
    ],
  }))
  .get('/:id/example/:exampleId', () => ({
    data: {
      id: '1',
      name: 'Project Alpha',
      description: 'Example for e-commerce',
      examples: 5,
      createdAt: '2024-01-01',
    },
  }))
  .post('/', () => ({
    message: 'Example project created',
    data: { id: '3', name: 'New Project', description: '', examples: 0 },
  }))
  .delete('/:id/example/:exampleId', () => ({ message: 'Example project deleted' }))
