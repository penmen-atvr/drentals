CREATE TYPE "public"."section_item_target_type" AS ENUM('equipment', 'category', 'brand');--> statement-breakpoint
CREATE TYPE "public"."homepage_section_type" AS ENUM('hero', 'carousel', 'grid', 'banner');--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"category_id" integer NOT NULL,
	"name" text NOT NULL,
	"brand" text,
	"model" text,
	"slug" text,
	"description" text,
	"specifications" jsonb,
	"daily_rate" numeric(10, 2) NOT NULL,
	"weekly_rate" numeric(10, 2),
	"monthly_rate" numeric(10, 2),
	"purchase_price" numeric(12, 2),
	"sold_price" numeric(12, 2),
	"condition" text,
	"status" text DEFAULT 'available' NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"is_kit" boolean DEFAULT false NOT NULL,
	"main_image_url" text,
	"last_service_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "equipment_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "equipment_categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "equipment_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipment_id" integer NOT NULL,
	"image_url" text NOT NULL,
	"alt_text" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homepage_sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" "homepage_section_type" DEFAULT 'carousel' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kit_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"kit_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "section_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" integer NOT NULL,
	"target_type" "section_item_target_type" DEFAULT 'equipment' NOT NULL,
	"equipment_id" integer,
	"category_id" integer,
	"brand" text,
	"custom_image_url" text,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_category_id_equipment_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."equipment_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment_images" ADD CONSTRAINT "equipment_images_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kit_items" ADD CONSTRAINT "kit_items_kit_id_equipment_id_fk" FOREIGN KEY ("kit_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kit_items" ADD CONSTRAINT "kit_items_item_id_equipment_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_items" ADD CONSTRAINT "section_items_section_id_homepage_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."homepage_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_items" ADD CONSTRAINT "section_items_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "section_items" ADD CONSTRAINT "section_items_category_id_equipment_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."equipment_categories"("id") ON DELETE cascade ON UPDATE no action;