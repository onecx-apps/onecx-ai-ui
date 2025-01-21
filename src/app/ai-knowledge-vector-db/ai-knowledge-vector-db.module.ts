import { CommonModule } from '@angular/common'
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { LetDirective } from '@ngrx/component'
import { EffectsModule } from '@ngrx/effects'
import { StoreModule } from '@ngrx/store'
import { TranslateModule } from '@ngx-translate/core'
import { PortalCoreModule } from '@onecx/portal-integration-angular'
import { CalendarModule } from 'primeng/calendar'
import { SharedModule } from '../shared/shared.module'
import { aiKnowledgeVectorDbFeature } from './ai-knowledge-vector-db.reducers'
import { routes } from './ai-knowledge-vector-db.routes'
import { AiKnowledgeVectorDbSearchComponent } from './pages/ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.component'
import { AiKnowledgeVectorDbSearchEffects } from './pages/ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.effects'
import { addInitializeModuleGuard } from '@onecx/angular-integration-interface'

@NgModule({
  declarations: [AiKnowledgeVectorDbSearchComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SharedModule,
    LetDirective,
    PortalCoreModule.forMicroFrontend(),
    RouterModule.forChild(addInitializeModuleGuard(routes)),
    FormsModule,
    ReactiveFormsModule,
    CalendarModule,
    StoreModule.forFeature(aiKnowledgeVectorDbFeature),
    EffectsModule.forFeature([AiKnowledgeVectorDbSearchEffects]),
    TranslateModule
  ]
})
export class AiKnowledgeVectorDbModule {}
