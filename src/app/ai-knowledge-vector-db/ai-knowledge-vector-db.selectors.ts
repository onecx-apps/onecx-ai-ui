import { createFeatureSelector } from '@ngrx/store'
import { aiKnowledgeVectorDbFeature } from './ai-knowledge-vector-db.reducers'
import { AiKnowledgeVectorDbState } from './ai-knowledge-vector-db.state'

export const selectAiKnowledgeVectorDbFeature = createFeatureSelector<AiKnowledgeVectorDbState>(
  aiKnowledgeVectorDbFeature.name
)
