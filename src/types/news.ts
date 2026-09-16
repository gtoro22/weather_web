export type NewsCategory = 'tecnologia' | 'economia' | 'clima' | 'politica' | 'ciencia' | 'deportes'

export interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  category: NewsCategory
  imageUrl: string
  url?: string
}

export interface NewsCategoryCount {
  category: NewsCategory
  label: string
  count: number
}
