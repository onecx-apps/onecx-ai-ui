import { routerNavigatedAction, RouterNavigatedAction } from '@ngrx/router-store'
import { createReducer, on } from '@ngrx/store'
import { AiKnowledgeVectorDbSearchActions } from './ai-knowledge-vector-db-search.actions'
import { aiKnowledgeVectorDbSearchColumns } from './ai-knowledge-vector-db-search.columns'
import { aiKnowledgeVectorDbSearchCriteriasSchema } from './ai-knowledge-vector-db-search.parameters'
import { AiKnowledgeVectorDbSearchState } from './ai-knowledge-vector-db-search.state'

export const initialState: AiKnowledgeVectorDbSearchState = {
  columns: aiKnowledgeVectorDbSearchColumns,
  results: [],
  displayedColumns: null,
  viewMode: 'basic',
  chartVisible: false,
  searchLoadingIndicator: false,
  criteria: {}
}

export const aiKnowledgeVectorDbSearchReducer = createReducer(
  initialState,
  on(routerNavigatedAction, (state: AiKnowledgeVectorDbSearchState, action: RouterNavigatedAction) => {
    const results = aiKnowledgeVectorDbSearchCriteriasSchema.safeParse(action.payload.routerState.root.queryParams)
    if (results.success) {
      return {
        ...state,
        criteria: results.data,
        searchLoadingIndicator: Object.keys(action.payload.routerState.root.queryParams).length != 0
      }
    }
    return state
  }),
  on(
    AiKnowledgeVectorDbSearchActions.resetButtonClicked,
    (state: AiKnowledgeVectorDbSearchState): AiKnowledgeVectorDbSearchState => ({
      ...state,
      results: initialState.results,
      criteria: {}
    })
  ),
  on(
    AiKnowledgeVectorDbSearchActions.searchButtonClicked,
    (state: AiKnowledgeVectorDbSearchState, { searchCriteria }): AiKnowledgeVectorDbSearchState => ({
      ...state,
      searchLoadingIndicator: true,
      criteria: searchCriteria
    })
  ),
  on(
    AiKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsReceived,
    (state: AiKnowledgeVectorDbSearchState, { results }): AiKnowledgeVectorDbSearchState => ({
      ...state,
      results
    })
  ),
  on(
    AiKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsLoadingFailed,
    (state: AiKnowledgeVectorDbSearchState): AiKnowledgeVectorDbSearchState => ({
      ...state,
      results: []
    })
  ),
  on(
    AiKnowledgeVectorDbSearchActions.chartVisibilityRehydrated,
    (state: AiKnowledgeVectorDbSearchState, { visible }): AiKnowledgeVectorDbSearchState => ({
      ...state,
      chartVisible: visible
    })
  ),
  on(
    AiKnowledgeVectorDbSearchActions.chartVisibilityToggled,
    (state: AiKnowledgeVectorDbSearchState): AiKnowledgeVectorDbSearchState => ({
      ...state,
      chartVisible: !state.chartVisible
    })
  ),
  on(
    AiKnowledgeVectorDbSearchActions.viewModeChanged,
    (state: AiKnowledgeVectorDbSearchState, { viewMode }): AiKnowledgeVectorDbSearchState => ({
      ...state,
      viewMode: viewMode
    })
  ),
  on(
    AiKnowledgeVectorDbSearchActions.displayedColumnsChanged,
    (state: AiKnowledgeVectorDbSearchState, { displayedColumns }): AiKnowledgeVectorDbSearchState => ({
      ...state,
      displayedColumns: displayedColumns.map((v) => v.id)
    })
  )
)
