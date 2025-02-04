import { combineReducers, createFeature } from '@ngrx/store'
import { AIKnowledgeVectorDbState } from './ai-knowledge-vector-db.state'
import { aIKnowledgeVectorDbDetailsReducer } from './pages/ai-knowledge-vector-db-details/ai-knowledge-vector-db-details.reducers'
import { aIKnowledgeVectorDbSearchReducer } from './pages/ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.reducers'

export const aIKnowledgeVectorDbFeature = createFeature({
  name: 'aiKnowledgeVectorDb',
  reducer: combineReducers<AIKnowledgeVectorDbState>({
    details: aIKnowledgeVectorDbDetailsReducer,
    search: aIKnowledgeVectorDbSearchReducer
  })
})
