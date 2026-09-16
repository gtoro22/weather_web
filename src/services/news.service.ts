import type { NewsArticle, NewsCategoryCount } from '@/types'
import { toDataSourceError } from '@/types'
import type { NewsQuery } from './repositories'
import { getRepositories } from './data-source.factory'

class NewsServiceImpl {
  async getArticles(query: NewsQuery = {}): Promise<NewsArticle[]> {
    try {
      return await getRepositories().news.listArticles(query)
    } catch (error) {
      throw toDataSourceError(error)
    }
  }

  async getCategoryDistribution(): Promise<NewsCategoryCount[]> {
    try {
      return await getRepositories().news.getCategoryDistribution()
    } catch (error) {
      throw toDataSourceError(error)
    }
  }
}

export const NewsService = new NewsServiceImpl()
