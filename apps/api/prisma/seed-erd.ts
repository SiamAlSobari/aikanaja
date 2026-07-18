import { PrismaClient } from '../generated/prisma/client'
import { PrismaBunSqlite } from 'prisma-adapter-bun-sqlite'

const adapter = new PrismaBunSqlite({
  url: process.env.DATABASE_URL || 'file:../data/dev.db',
})

const prisma = new PrismaClient({ adapter })

const templates = [
  {
    name: 'E-Commerce',
    description: 'Sistem e-commerce dengan user, product, order, order item, dan payment',
    category: 'e-commerce',
    schema: JSON.stringify({
      tables: [
        {
          id: '1',
          name: 'users',
          position: { x: 0, y: 0 },
          columns: [
            { id: '1-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-2', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-3', name: 'email', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-4', name: 'password', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-5', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '2',
          name: 'products',
          position: { x: 400, y: 0 },
          columns: [
            { id: '2-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-2', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-3', name: 'description', type: 'TEXT', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-4', name: 'price', type: 'DECIMAL(10,2)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-5', name: 'stock', type: 'INTEGER', primaryKey: false, nullable: false, unique: false, defaultValue: '0', foreignKey: null },
            { id: '2-6', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '3',
          name: 'orders',
          position: { x: 200, y: 300 },
          columns: [
            { id: '3-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '3-2', name: 'user_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '3-3', name: 'total', type: 'DECIMAL(10,2)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '3-4', name: 'status', type: 'VARCHAR(50)', primaryKey: false, nullable: false, unique: false, defaultValue: "'pending'", foreignKey: null },
            { id: '3-5', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '4',
          name: 'order_items',
          position: { x: 500, y: 300 },
          columns: [
            { id: '4-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '4-2', name: 'order_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'orders', column: 'id' } },
            { id: '4-3', name: 'product_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'products', column: 'id' } },
            { id: '4-4', name: 'quantity', type: 'INTEGER', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '4-5', name: 'price', type: 'DECIMAL(10,2)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
          ],
        },
        {
          id: '5',
          name: 'payments',
          position: { x: 200, y: 600 },
          columns: [
            { id: '5-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '5-2', name: 'order_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'orders', column: 'id' } },
            { id: '5-3', name: 'amount', type: 'DECIMAL(10,2)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '5-4', name: 'method', type: 'VARCHAR(50)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '5-5', name: 'status', type: 'VARCHAR(50)', primaryKey: false, nullable: false, unique: false, defaultValue: "'pending'", foreignKey: null },
            { id: '5-6', name: 'paid_at', type: 'TIMESTAMP', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
          ],
        },
      ],
      relations: [
        { id: 'r1', sourceTableId: '3', targetTableId: '1', sourceColumn: 'user_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r2', sourceTableId: '4', targetTableId: '3', sourceColumn: 'order_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r3', sourceTableId: '4', targetTableId: '2', sourceColumn: 'product_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r4', sourceTableId: '5', targetTableId: '3', sourceColumn: 'order_id', targetColumn: 'id', type: 'one-to-one' },
      ],
    }),
  },
  {
    name: 'Blog',
    description: 'Sistem blog dengan user, post, comment, category, dan tag',
    category: 'blog',
    schema: JSON.stringify({
      tables: [
        {
          id: '1',
          name: 'users',
          position: { x: 0, y: 0 },
          columns: [
            { id: '1-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-2', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-3', name: 'email', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-4', name: 'avatar', type: 'VARCHAR(500)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-5', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '2',
          name: 'categories',
          position: { x: 400, y: 0 },
          columns: [
            { id: '2-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-2', name: 'name', type: 'VARCHAR(100)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-3', name: 'slug', type: 'VARCHAR(100)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
          ],
        },
        {
          id: '3',
          name: 'posts',
          position: { x: 200, y: 200 },
          columns: [
            { id: '3-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '3-2', name: 'title', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '3-3', name: 'slug', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '3-4', name: 'content', type: 'TEXT', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '3-5', name: 'author_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '3-6', name: 'category_id', type: 'UUID', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: { table: 'categories', column: 'id' } },
            { id: '3-7', name: 'published', type: 'BOOLEAN', primaryKey: false, nullable: false, unique: false, defaultValue: 'false', foreignKey: null },
            { id: '3-8', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '4',
          name: 'comments',
          position: { x: 200, y: 500 },
          columns: [
            { id: '4-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '4-2', name: 'post_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'posts', column: 'id' } },
            { id: '4-3', name: 'user_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '4-4', name: 'content', type: 'TEXT', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '4-5', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '5',
          name: 'tags',
          position: { x: 600, y: 200 },
          columns: [
            { id: '5-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '5-2', name: 'name', type: 'VARCHAR(50)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
          ],
        },
        {
          id: '6',
          name: 'post_tags',
          position: { x: 500, y: 400 },
          columns: [
            { id: '6-1', name: 'post_id', type: 'UUID', primaryKey: true, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'posts', column: 'id' } },
            { id: '6-2', name: 'tag_id', type: 'UUID', primaryKey: true, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'tags', column: 'id' } },
          ],
        },
      ],
      relations: [
        { id: 'r1', sourceTableId: '3', targetTableId: '1', sourceColumn: 'author_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r2', sourceTableId: '3', targetTableId: '2', sourceColumn: 'category_id', targetColumn: 'id', type: 'many-to-one' },
        { id: 'r3', sourceTableId: '4', targetTableId: '3', sourceColumn: 'post_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r4', sourceTableId: '4', targetTableId: '1', sourceColumn: 'user_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r5', sourceTableId: '6', targetTableId: '3', sourceColumn: 'post_id', targetColumn: 'id', type: 'many-to-many' },
        { id: 'r6', sourceTableId: '6', targetTableId: '5', sourceColumn: 'tag_id', targetColumn: 'id', type: 'many-to-many' },
      ],
    }),
  },
  {
    name: 'Inventory Management',
    description: 'Sistem inventory dengan product, warehouse, stock movement, dan supplier',
    category: 'inventory',
    schema: JSON.stringify({
      tables: [
        {
          id: '1',
          name: 'products',
          position: { x: 0, y: 0 },
          columns: [
            { id: '1-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-2', name: 'sku', type: 'VARCHAR(50)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-3', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-4', name: 'description', type: 'TEXT', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-5', name: 'unit', type: 'VARCHAR(20)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-6', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '2',
          name: 'suppliers',
          position: { x: 400, y: 0 },
          columns: [
            { id: '2-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-2', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-3', name: 'contact', type: 'VARCHAR(100)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-4', name: 'email', type: 'VARCHAR(255)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-5', name: 'phone', type: 'VARCHAR(20)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
          ],
        },
        {
          id: '3',
          name: 'warehouses',
          position: { x: 0, y: 300 },
          columns: [
            { id: '3-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '3-2', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '3-3', name: 'location', type: 'VARCHAR(255)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
          ],
        },
        {
          id: '4',
          name: 'stock',
          position: { x: 200, y: 150 },
          columns: [
            { id: '4-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '4-2', name: 'product_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'products', column: 'id' } },
            { id: '4-3', name: 'warehouse_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'warehouses', column: 'id' } },
            { id: '4-4', name: 'quantity', type: 'INTEGER', primaryKey: false, nullable: false, unique: false, defaultValue: '0', foreignKey: null },
          ],
        },
        {
          id: '5',
          name: 'stock_movements',
          position: { x: 200, y: 450 },
          columns: [
            { id: '5-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '5-2', name: 'product_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'products', column: 'id' } },
            { id: '5-3', name: 'warehouse_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'warehouses', column: 'id' } },
            { id: '5-4', name: 'type', type: 'VARCHAR(20)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '5-5', name: 'quantity', type: 'INTEGER', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '5-6', name: 'reference', type: 'VARCHAR(100)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '5-7', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
      ],
      relations: [
        { id: 'r1', sourceTableId: '4', targetTableId: '1', sourceColumn: 'product_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r2', sourceTableId: '4', targetTableId: '3', sourceColumn: 'warehouse_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r3', sourceTableId: '5', targetTableId: '1', sourceColumn: 'product_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r4', sourceTableId: '5', targetTableId: '3', sourceColumn: 'warehouse_id', targetColumn: 'id', type: 'one-to-many' },
      ],
    }),
  },
  {
    name: 'Social Media',
    description: 'Sistem social media dengan user, post, like, follow, dan comment',
    category: 'social',
    schema: JSON.stringify({
      tables: [
        {
          id: '1',
          name: 'users',
          position: { x: 0, y: 0 },
          columns: [
            { id: '1-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-2', name: 'username', type: 'VARCHAR(50)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-3', name: 'email', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-4', name: 'bio', type: 'TEXT', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-5', name: 'avatar', type: 'VARCHAR(500)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-6', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '2',
          name: 'posts',
          position: { x: 400, y: 0 },
          columns: [
            { id: '2-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-2', name: 'user_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '2-3', name: 'content', type: 'TEXT', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-4', name: 'image', type: 'VARCHAR(500)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-5', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '3',
          name: 'comments',
          position: { x: 400, y: 300 },
          columns: [
            { id: '3-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '3-2', name: 'post_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'posts', column: 'id' } },
            { id: '3-3', name: 'user_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '3-4', name: 'content', type: 'TEXT', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '3-5', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '4',
          name: 'likes',
          position: { x: 700, y: 0 },
          columns: [
            { id: '4-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '4-2', name: 'post_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'posts', column: 'id' } },
            { id: '4-3', name: 'user_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '4-4', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '5',
          name: 'follows',
          position: { x: 0, y: 300 },
          columns: [
            { id: '5-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '5-2', name: 'follower_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '5-3', name: 'following_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'users', column: 'id' } },
            { id: '5-4', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
      ],
      relations: [
        { id: 'r1', sourceTableId: '2', targetTableId: '1', sourceColumn: 'user_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r2', sourceTableId: '3', targetTableId: '2', sourceColumn: 'post_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r3', sourceTableId: '3', targetTableId: '1', sourceColumn: 'user_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r4', sourceTableId: '4', targetTableId: '2', sourceColumn: 'post_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r5', sourceTableId: '4', targetTableId: '1', sourceColumn: 'user_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r6', sourceTableId: '5', targetTableId: '1', sourceColumn: 'follower_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r7', sourceTableId: '5', targetTableId: '1', sourceColumn: 'following_id', targetColumn: 'id', type: 'one-to-many' },
      ],
    }),
  },
  {
    name: 'School Management',
    description: 'Sistem manajemen sekolah dengan siswa, guru, kelas, mata pelajaran, dan nilai',
    category: 'education',
    schema: JSON.stringify({
      tables: [
        {
          id: '1',
          name: 'students',
          position: { x: 0, y: 0 },
          columns: [
            { id: '1-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-2', name: 'nis', type: 'VARCHAR(20)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-3', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '1-4', name: 'email', type: 'VARCHAR(255)', primaryKey: false, nullable: true, unique: true, defaultValue: null, foreignKey: null },
            { id: '1-5', name: 'class_id', type: 'UUID', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: { table: 'classes', column: 'id' } },
            { id: '1-6', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
        {
          id: '2',
          name: 'teachers',
          position: { x: 400, y: 0 },
          columns: [
            { id: '2-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-2', name: 'nip', type: 'VARCHAR(20)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-3', name: 'name', type: 'VARCHAR(255)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '2-4', name: 'email', type: 'VARCHAR(255)', primaryKey: false, nullable: true, unique: true, defaultValue: null, foreignKey: null },
            { id: '2-5', name: 'phone', type: 'VARCHAR(20)', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: null },
          ],
        },
        {
          id: '3',
          name: 'classes',
          position: { x: 200, y: 200 },
          columns: [
            { id: '3-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '3-2', name: 'name', type: 'VARCHAR(50)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '3-3', name: 'grade', type: 'INTEGER', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '3-4', name: 'teacher_id', type: 'UUID', primaryKey: false, nullable: true, unique: false, defaultValue: null, foreignKey: { table: 'teachers', column: 'id' } },
          ],
        },
        {
          id: '4',
          name: 'subjects',
          position: { x: 600, y: 0 },
          columns: [
            { id: '4-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '4-2', name: 'name', type: 'VARCHAR(100)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '4-3', name: 'code', type: 'VARCHAR(20)', primaryKey: false, nullable: false, unique: true, defaultValue: null, foreignKey: null },
          ],
        },
        {
          id: '5',
          name: 'grades',
          position: { x: 300, y: 450 },
          columns: [
            { id: '5-1', name: 'id', type: 'UUID', primaryKey: true, nullable: false, unique: true, defaultValue: null, foreignKey: null },
            { id: '5-2', name: 'student_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'students', column: 'id' } },
            { id: '5-3', name: 'subject_id', type: 'UUID', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: { table: 'subjects', column: 'id' } },
            { id: '5-4', name: 'score', type: 'DECIMAL(5,2)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '5-5', name: 'semester', type: 'VARCHAR(10)', primaryKey: false, nullable: false, unique: false, defaultValue: null, foreignKey: null },
            { id: '5-6', name: 'created_at', type: 'TIMESTAMP', primaryKey: false, nullable: false, unique: false, defaultValue: 'CURRENT_TIMESTAMP', foreignKey: null },
          ],
        },
      ],
      relations: [
        { id: 'r1', sourceTableId: '1', targetTableId: '3', sourceColumn: 'class_id', targetColumn: 'id', type: 'many-to-one' },
        { id: 'r2', sourceTableId: '3', targetTableId: '2', sourceColumn: 'teacher_id', targetColumn: 'id', type: 'many-to-one' },
        { id: 'r3', sourceTableId: '5', targetTableId: '1', sourceColumn: 'student_id', targetColumn: 'id', type: 'one-to-many' },
        { id: 'r4', sourceTableId: '5', targetTableId: '4', sourceColumn: 'subject_id', targetColumn: 'id', type: 'one-to-many' },
      ],
    }),
  },
]

async function main() {
  console.log('Seeding ERD templates...')

  for (const template of templates) {
    await prisma.erdTemplate.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, '-') },
      update: template,
      create: {
        id: template.name.toLowerCase().replace(/\s+/g, '-'),
        ...template,
      },
    })
    console.log(`  ✓ ${template.name}`)
  }

  console.log('ERD templates seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
