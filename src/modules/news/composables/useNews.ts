import { computed, ref } from 'vue'
import { useAsyncData } from '@/composables'
import { NewsService } from '@/services'
import { NEWS_CATEGORY_LABELS } from '@/constants'
import type { NewsCategory } from '@/types'

export function useNews(limit?: number) {
  const search = ref('')
  const category = ref<NewsCategory | null>(null)

  const articles = useAsyncData(
    () =>
      NewsService.getArticles({
        search: search.value,
        category: category.value,
        limit,
      }),
    { watchSources: [search, category] },
  )

  const distribution = useAsyncData(() => NewsService.getCategoryDistribution())

  const categoryOptions = computed(() =>
    (Object.keys(NEWS_CATEGORY_LABELS) as NewsCategory[]).map((value) => ({
      value,
      label: NEWS_CATEGORY_LABELS[value],
    })),
  )

  const distributionData = computed(() =>
    (distribution.data.value ?? []).map((item) => ({ label: item.label, value: item.count })),
  )

  function resetFilters(): void {
    search.value = ''
    category.value = null
  }

  return {
    search,
    category,
    categoryOptions,
    articles,
    distribution,
    distributionData,
    resetFilters,
  }
}
