import { combineReducers, createFeature } from '@ngrx/store'
import { AiKnowledgeVectorDbState } from './ai-knowledge-vector-db.state'
import { aiKnowledgeVectorDbSearchReducer } from './pages/ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.reducers'

export const aiKnowledgeVectorDbFeature = createFeature({
  name: 'aiKnowledgeVectorDb',
  reducer: combineReducers<AiKnowledgeVectorDbState>({
    search: aiKnowledgeVectorDbSearchReducer
  })
})
