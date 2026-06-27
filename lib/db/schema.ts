import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';

export const lessons = sqliteTable('lessons', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text('title').notNull().default('Untitled Lesson'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const images = sqliteTable('images', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  url: text('url').notNull(),
  publicId: text('public_id').notNull(),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const moments = sqliteTable('moments', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  lessonId: text('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  imageId: text('image_id').references(() => images.id, { onDelete: 'set null' }),
  polygons: text('polygons').notNull(),
  highlightLines: text('highlight_lines'),
  explanation: text('explanation').notNull(),
  extraTitle: text('extra_title'),
  extraBody: text('extra_body'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(strftime('%s', 'now'))`),
});

export const lessonsRelations = relations(lessons, ({ many }) => ({
  images: many(images),
  moments: many(moments),
}));

export const imagesRelations = relations(images, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [images.lessonId],
    references: [lessons.id],
  }),
  moments: many(moments),
}));

export const momentsRelations = relations(moments, ({ one }) => ({
  lesson: one(lessons, {
    fields: [moments.lessonId],
    references: [lessons.id],
  }),
  image: one(images, {
    fields: [moments.imageId],
    references: [images.id],
  }),
}));
