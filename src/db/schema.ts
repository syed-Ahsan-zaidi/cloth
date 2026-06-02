import { pgTable, text, integer, jsonb, timestamp, boolean, real } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const hiddenProducts = pgTable("hidden_products", {
  id: text("id").primaryKey(),
});

export const adminProducts = pgTable("admin_products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  images: jsonb("images").notNull().$type<string[]>(),
  category: text("category").notNull(),
  colors: jsonb("colors").notNull().$type<string[]>(),
  sizes: jsonb("sizes").notNull().$type<string[]>(),
  description: text("description").notNull(),
  rating: real("rating").default(0).notNull(),
  reviews: integer("reviews").default(0).notNull(),
  inStock: boolean("in_stock").default(true).notNull(),
  isNew: boolean("is_new").default(false).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"),
  customer: jsonb("customer").notNull(),
  items: jsonb("items").notNull(),
  paymentMethod: text("payment_method").notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  total: integer("total").notNull(),
});
