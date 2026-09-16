<script setup lang="ts">
import { computed } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { BasePageLayout, ChartCard, DataTableContainer } from '@/components/common'
import { DonutChart } from '@/components/charts'
import { useNews } from '@/modules/news/composables/useNews'
import { NEWS_CATEGORY_LABELS } from '@/constants'
import { formatDateTime, formatRelative } from '@/utils'

const {
  search,
  category,
  categoryOptions,
  articles,
  distribution,
  distributionData,
  resetFilters,
} = useNews()

const hasFilters = computed(() => Boolean(search.value) || category.value !== null)
</script>

<template>
  <BasePageLayout
    title="Noticias"
    subtitle="Titulares simulados agrupados por categoría y fuente"
    :breadcrumbs="[{ label: 'Inicio', to: '/dashboard' }, { label: 'Noticias' }]"
  >
    <template #filters>
      <a-input
        v-model:value="search"
        placeholder="Buscar por título, resumen o fuente"
        allow-clear
        style="max-width: 320px"
        aria-label="Buscar noticias"
      >
        <template #prefix><SearchOutlined /></template>
      </a-input>

      <a-select
        v-model:value="category"
        :options="categoryOptions"
        placeholder="Todas las categorías"
        allow-clear
        style="min-width: 200px"
        aria-label="Filtrar por categoría"
      />

      <a-button v-if="hasFilters" @click="resetFilters()">Limpiar filtros</a-button>
    </template>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="8">
        <ChartCard
          title="Distribución por categoría"
          description="Sobre el total de titulares"
          :loading="distribution.isLoading.value"
          :error="distribution.error.value"
          :empty="distributionData.length === 0"
          :height="300"
          @retry="distribution.refresh()"
        >
          <DonutChart
            :data="distributionData"
            center-label="noticias"
            :height="300"
            aria-label="Gráfica de dona con la distribución de noticias por categoría"
          />
        </ChartCard>
      </a-col>

      <a-col :xs="24" :lg="16">
        <DataTableContainer
          title="Titulares"
          :loading="articles.isLoading.value"
          :error="articles.error.value"
          :empty="articles.isEmpty.value"
          @retry="articles.refresh()"
        >
          <template #empty>
            <a-empty description="Ninguna noticia coincide con la búsqueda">
              <a-button type="primary" @click="resetFilters()">Quitar filtros</a-button>
            </a-empty>
          </template>

          <a-row :gutter="[12, 12]">
            <a-col v-for="article in articles.data.value ?? []" :key="article.id" :xs="24" :md="12">
              <a-card class="article" hoverable>
                <template #cover>
                  <img class="article__image" :src="article.imageUrl" :alt="article.title" />
                </template>

                <a-card-meta>
                  <template #title>
                    <a
                      v-if="article.url"
                      :href="article.url"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {{ article.title }}
                    </a>
                    <span v-else>{{ article.title }}</span>
                  </template>
                  <template #description>
                    <p class="article__summary">{{ article.summary }}</p>
                    <div class="article__meta">
                      <a-tag color="blue">{{ NEWS_CATEGORY_LABELS[article.category] }}</a-tag>
                      <span>{{ article.source }}</span>
                      <a-tooltip :title="formatDateTime(article.publishedAt)">
                        <span>· {{ formatRelative(article.publishedAt) }}</span>
                      </a-tooltip>
                    </div>
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>

          <template #footer>
            <span class="legend">
              {{ (articles.data.value ?? []).length }} titulares mostrados
            </span>
          </template>
        </DataTableContainer>
      </a-col>
    </a-row>
  </BasePageLayout>
</template>

<style scoped>
.article {
  height: 100%;
}

.article__image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}

.article__summary {
  margin: 0 0 10px;
  color: var(--app-text-secondary);
  font-size: 13px;
  line-height: 1.5;
}

.article__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  color: var(--app-text-secondary);
  font-size: 12px;
}

.legend {
  color: var(--app-text-secondary);
  font-size: 12px;
}
</style>
