import { createActionGroup, emptyProps, props } from '@ngrx/store'
import { DataTableColumn } from '@onecx/angular-accelerator'
import { AiKnowledgeVectorDb } from '../../../shared/generated'
import { AiKnowledgeVectorDbSearchCriteria } from './ai-knowledge-vector-db-search.parameters'

export const AiKnowledgeVectorDbSearchActions = createActionGroup({
  source: 'AiKnowledgeVectorDbSearch',
  events: {
    'Search button clicked': props<{
      searchCriteria: AiKnowledgeVectorDbSearchCriteria
    }>(),
    'Reset button clicked': emptyProps(),
    'ai knowledge vector db search results received': props<{
      results: AiKnowledgeVectorDb[]
      totalNumberOfResults: number
    }>(),
    'ai knowledge vector db search results loading failed': props<{ error: string | null }>(),
    'Displayed columns changed': props<{
      displayedColumns: DataTableColumn[]
    }>(),
    'Chart visibility rehydrated': props<{
      visible: boolean
    }>(),
    'Chart visibility toggled': emptyProps(),
    'View mode changed': props<{
      viewMode: 'basic' | 'advanced'
    }>(),
    'Export button clicked': emptyProps()
  }
})
