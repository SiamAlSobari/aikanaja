import { Elysia } from 'elysia'

export const erdExampleController = new Elysia({ prefix: '/erd' })
  .get('/', () => ({
    data: [
      { id: '1', name: 'Project Alpha', description: 'ERD for e-commerce', tables: 5, relations: 8 },
      { id: '2', name: 'Project Beta', description: 'ERD for inventory', tables: 3, relations: 4 },
    ],
  }))
  .get('/:id', () => ({
    data: {
      id: '1',
      name: 'Project Alpha',
      description: 'ERD for e-commerce',
      tables: 5,
      relations: 8,
      createdAt: '2024-01-01',
    },
  }))
  .post('/', () => ({
    message: 'ERD project created',
    data: { id: '3', name: 'New Project', description: '', tables: 0, relations: 0 },
  }))
  .delete('/:id', () => ({ message: 'ERD project deleted' }))
