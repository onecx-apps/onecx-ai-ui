import { SearchAiKnowledgeVectorDbRequest } from 'src/app/shared/generated'
import { z, ZodTypeAny } from 'zod'

export const aiKnowledgeVectorDbSearchCriteriasSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  vdb: z.string().optional(),
  vdbCollection: z.string().optional(),
  id: z.number().optional(),
  limit: z.number().optional()
} satisfies Partial<Record<keyof SearchAiKnowledgeVectorDbRequest, ZodTypeAny>>)

export type AiKnowledgeVectorDbSearchCriteria = z.infer<typeof aiKnowledgeVectorDbSearchCriteriasSchema>
