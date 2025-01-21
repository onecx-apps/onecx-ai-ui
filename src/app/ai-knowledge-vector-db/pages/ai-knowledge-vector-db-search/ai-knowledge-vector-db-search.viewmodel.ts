import { DataTableColumn, RowListGridData } from '@onecx/portal-integration-angular'
import { AiKnowledgeVectorDbSearchCriteria } from './ai-knowledge-vector-db-search.parameters'

export interface AiKnowledgeVectorDbSearchViewModel {
  columns: DataTableColumn[]
  searchCriteria: AiKnowledgeVectorDbSearchCriteria
  results: RowListGridData[]
  displayedColumns: DataTableColumn[]
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
}
