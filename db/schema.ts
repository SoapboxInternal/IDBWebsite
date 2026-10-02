import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const brands = sqliteTable('brands', {
 id:text('id').primaryKey(), name:text('name').notNull(), category:text('category').notNull(), status:text('status').notNull(), website:text('website').notNull(), image:text('image').notNull(), description:text('description').notNull().default(''), visible:integer('visible').notNull().default(1), position:integer('position').notNull().default(0), revision:integer('revision').notNull().default(1)
});
export const settings=sqliteTable('settings',{key:text('key').primaryKey(),value:text('value').notNull()});
