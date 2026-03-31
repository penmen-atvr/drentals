import { 
  pgTable, 
  serial, 
  text, 
  timestamp, 
  integer, 
  numeric, 
  boolean, 
  jsonb,
  varchar
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const equipmentCategories = pgTable("equipment_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const equipment = pgTable("equipment", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => equipmentCategories.id).notNull(),
  name: text("name").notNull(),
  brand: text("brand"),
  model: text("model"),
  slug: text("slug").unique(),
  description: text("description"),
  specifications: jsonb("specifications"),
  dailyRate: numeric("daily_rate", { precision: 10, scale: 2 }).notNull(),
  weeklyRate: numeric("weekly_rate", { precision: 10, scale: 2 }),
  monthlyRate: numeric("monthly_rate", { precision: 10, scale: 2 }),
  purchasePrice: numeric("purchase_price", { precision: 12, scale: 2 }),
  soldPrice: numeric("sold_price", { precision: 12, scale: 2 }),
  condition: text("condition"),
  status: text("status").default("available").notNull(), // available, rented, maintenance, retired, sold
  featured: boolean("featured").default(false).notNull(),
  isKit: boolean("is_kit").default(false).notNull(),
  mainImageUrl: text("main_image_url"),
  lastServiceDate: timestamp("last_service_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

export const equipmentImages = pgTable("equipment_images", {
  id: serial("id").primaryKey(),
  equipmentId: integer("equipment_id").references(() => equipment.id).notNull(),
  imageUrl: text("image_url").notNull(),
  altText: text("alt_text"),
  displayOrder: integer("display_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

export const kitItems = pgTable("kit_items", {
  id: serial("id").primaryKey(),
  kitId: integer("kit_id").references(() => equipment.id, { onDelete: 'cascade' }).notNull(),
  itemId: integer("item_id").references(() => equipment.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Relations
export const equipmentRelations = relations(equipment, ({ one, many }) => ({
  category: one(equipmentCategories, {
    fields: [equipment.categoryId],
    references: [equipmentCategories.id],
  }),
  images: many(equipmentImages, { relationName: "equipment_images" }),
  kitComponents: many(kitItems, { relationName: "kit_components" }),
  asPartOfKits: many(kitItems, { relationName: "kit_items" }),
}))

export const equipmentImagesRelations = relations(equipmentImages, ({ one }) => ({
  equipment: one(equipment, {
    fields: [equipmentImages.equipmentId],
    references: [equipment.id],
    relationName: "equipment_images",
  }),
}))

export const equipmentCategoriesRelations = relations(equipmentCategories, ({ many }) => ({
  equipment: many(equipment),
}))

export const kitItemRelations = relations(kitItems, ({ one }) => ({
  kit: one(equipment, {
    fields: [kitItems.kitId],
    references: [equipment.id],
    relationName: "kit_components",
  }),
  item: one(equipment, {
    fields: [kitItems.itemId],
    references: [equipment.id],
    relationName: "kit_items",
  }),
}))


