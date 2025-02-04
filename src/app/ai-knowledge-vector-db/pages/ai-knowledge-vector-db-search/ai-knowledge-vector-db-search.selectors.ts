import { createSelector } from '@ngrx/store'
import { createChildSelectors } from '@onecx/ngrx-accelerator'
import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { aIKnowledgeVectorDbFeature } from '../../ai-knowledge-vector-db.reducers'
import { initialState } from './ai-knowledge-vector-db-search.reducers'
import { AIKnowledgeVectorDbSearchViewModel } from './ai-knowledge-vector-db-search.viewmodel'

export const aIKnowledgeVectorDbSearchSelectors = createChildSelectors(
  aIKnowledgeVectorDbFeature.selectSearch,
  initialState
)

export const selectResults = createSelector(
  aIKnowledgeVectorDbSearchSelectors.selectResults,
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
  aIKnowledgeVectorDbSearchSelectors.selectColumns,
  aIKnowledgeVectorDbSearchSelectors.selectDisplayedColumns,
  (columns, displayedColumns): DataTableColumn[] => {
    return (displayedColumns?.map((d) => columns.find((c) => c.id === d)).filter((d) => d) as DataTableColumn[]) ?? []
  }
)

export const selectAIKnowledgeVectorDbSearchViewModel = createSelector(
  aIKnowledgeVectorDbSearchSelectors.selectColumns,
  aIKnowledgeVectorDbSearchSelectors.selectCriteria,
  selectResults,
  selectDisplayedColumns,
  aIKnowledgeVectorDbSearchSelectors.selectViewMode,
  aIKnowledgeVectorDbSearchSelectors.selectChartVisible,
  (columns, searchCriteria, results, displayedColumns, viewMode, chartVisible): AIKnowledgeVectorDbSearchViewModel => ({
    columns,
    searchCriteria,
    results,
    displayedColumns,
    viewMode,
    chartVisible
  })
)
