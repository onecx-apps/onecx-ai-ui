import { DataTableColumn } from '@onecx/portal-integration-angular'
import { AiKnowledgeVectorDb } from 'src/app/shared/generated'
import { AiKnowledgeVectorDbSearchCriteria } from './ai-knowledge-vector-db-search.parameters'

export interface AiKnowledgeVectorDbSearchState {
  columns: DataTableColumn[]
  results: AiKnowledgeVectorDb[]
  displayedColumns: string[] | null
  viewMode: 'basic' | 'advanced'
  chartVisible: boolean
  searchLoadingIndicator: boolean
  criteria: AiKnowledgeVectorDbSearchCriteria
}
