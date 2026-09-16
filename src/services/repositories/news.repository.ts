import type { NewsArticle, NewsCategory, NewsCategoryCount } from '@/types'

export interface NewsQuery {
  search?: string
  category?: NewsCategory | null
  limit?: number
}

export interface NewsRepository {
  listArticles(query?: NewsQuery): Promise<NewsArticle[]>
  getCategoryDistribution(): Promise<NewsCategoryCount[]>
}
