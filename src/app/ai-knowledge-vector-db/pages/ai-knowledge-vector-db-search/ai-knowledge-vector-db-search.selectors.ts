import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { aiKnowledgeVectorDbFeature } from '../../ai-knowledge-vector-db.reducers'
import { initialState } from './ai-knowledge-vector-db-search.reducers'
import { AiKnowledgeVectorDbSearchViewModel } from './ai-knowledge-vector-db-search.viewmodel'

export const aiKnowledgeVectorDbSearchSelectors = createChildSelectors(
  aiKnowledgeVectorDbFeature.selectSearch,
  initialState
)

export const selectResults = createSelector(
  aiKnowledgeVectorDbSearchSelectors.selectResults,
  (results): RowListGridData[] => {
    return results.map((item) => ({
      imagePath: '',
      id: item.id,
      name: item.name,
      description: item.description,
      vdb: item.vdb,
      vdbCollection: item.vdbCollection
    }))
  }
)

export const selectDisplayedColumns = createSelector(
  aiKnowledgeVectorDbSearchSelectors.selectColumns,
  aiKnowledgeVectorDbSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectAiKnowledgeVectorDbSearchViewModel = createSelector(
  aiKnowledgeVectorDbSearchSelectors.selectColumns,
  aiKnowledgeVectorDbSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  aiKnowledgeVectorDbSearchSelectors.selectViewMode,
  aiKnowledgeVectorDbSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): AiKnowledgeVectorDbSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)
