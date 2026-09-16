import type { NewsQuery, NewsRepository } from '@/services/repositories'
import type { NewsArticle, NewsCategory, NewsCategoryCount } from '@/types'
import { NEWS_CATEGORY_LABELS } from '@/constants'
import { simulateNetwork } from '@/utils'
import { MOCK_NEWS } from '@/modules/news/mocks/news.mock'

export class MockNewsAdapter implements NewsRepository {
  async listArticles(query: NewsQuery = {}): Promise<NewsArticle[]> {
    await simulateNetwork('las noticias')
    const term = query.search?.trim().toLowerCase() ?? ''

    const filtered = MOCK_NEWS.filter((article) => {
      const matchesCategory = !query.category || article.category === query.category
      const matchesTerm =
        !term ||
        article.title.toLowerCase().includes(term) ||
        article.summary.toLowerCase().includes(term) ||
        article.source.toLowerCase().includes(term)
      return matchesCategory && matchesTerm
    }).sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))

    return query.limit ? filtered.slice(0, query.limit) : filtered
  }

  async getCategoryDistribution(): Promise<NewsCategoryCount[]> {
    await simulateNetwork('la distribución de noticias')
    const counts = new Map<NewsCategory, number>()
    for (const article of MOCK_NEWS) {
      counts.set(article.category, (counts.get(article.category) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([category, count]) => ({
        category,
        label: NEWS_CATEGORY_LABELS[category],
        count,
      }))
      .sort((a, b) => b.count - a.count)
  }
}
