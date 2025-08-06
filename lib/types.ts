export interface Category {
  id: number
  name: string
  description: string | null
}

export interface Equipment {
  id: number
  category_id: number
  category_name?: string
  name: string
  brand: string | null
  model: string | null
  description: string | null
  specifications: Record<string, any> | null
  daily_rate: number
  weekly_rate: number | null
  monthly_rate: number | null
  condition: string | null
  status: string
  featured: boolean
  main_image_url: string | null
  created_at: string
  updated_at: string
}

export interface EquipmentImage {
  id: number
  equipment_id: number
  image_url: string
  alt_text: string | null
  display_order: number
  created_at: string
}
