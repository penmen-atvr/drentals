DROP TABLE IF EXISTS "section_items" CASCADE;
--> statement-breakpoint
DROP TABLE IF EXISTS "homepage_sections" CASCADE;
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."section_item_target_type";
--> statement-breakpoint
DROP TYPE IF EXISTS "public"."homepage_section_type";
--> statement-breakpoint
CREATE TYPE "public"."mobile_home_section_type" AS ENUM('hero', 'equipment_carousel', 'category_strip', 'brand_strip', 'kit_grid');
--> statement-breakpoint
CREATE TABLE "mobile_home_sections" (
  "id" serial PRIMARY KEY NOT NULL,
  "key" text NOT NULL,
  "title" text NOT NULL,
  "subtitle" text,
  "type" "mobile_home_section_type" NOT NULL,
  "is_active" boolean DEFAULT true NOT NULL,
  "display_order" integer DEFAULT 0 NOT NULL,
  "config" jsonb,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  CONSTRAINT "mobile_home_sections_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "mobile_home_section_equipment_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "section_id" integer NOT NULL,
  "equipment_id" integer NOT NULL,
  "custom_image_url" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mobile_home_section_category_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "section_id" integer NOT NULL,
  "category_id" integer NOT NULL,
  "custom_image_url" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mobile_home_section_brand_items" (
  "id" serial PRIMARY KEY NOT NULL,
  "section_id" integer NOT NULL,
  "brand" text NOT NULL,
  "custom_image_url" text,
  "display_order" integer DEFAULT 0 NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mobile_home_section_equipment_items" ADD CONSTRAINT "mobile_home_section_equipment_items_section_id_mobile_home_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."mobile_home_sections"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "mobile_home_section_equipment_items" ADD CONSTRAINT "mobile_home_section_equipment_items_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "mobile_home_section_category_items" ADD CONSTRAINT "mobile_home_section_category_items_section_id_mobile_home_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."mobile_home_sections"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "mobile_home_section_category_items" ADD CONSTRAINT "mobile_home_section_category_items_category_id_equipment_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."equipment_categories"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "mobile_home_section_brand_items" ADD CONSTRAINT "mobile_home_section_brand_items_section_id_mobile_home_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."mobile_home_sections"("id") ON DELETE cascade ON UPDATE no action;
