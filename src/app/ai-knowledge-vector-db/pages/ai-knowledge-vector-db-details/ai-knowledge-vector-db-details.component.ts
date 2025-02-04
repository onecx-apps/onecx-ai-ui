import { Component, Input, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Action, BreadcrumbService } from '@onecx/portal-integration-angular'
import { map, Observable } from 'rxjs'

import { PrimeIcons } from 'primeng/api'
import { selectAIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.selectors'
import { AIKnowledgeVectorDbDetailsViewModel } from './ai-knowledge-vector-db-details.viewmodel'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { AIKnowledgeVectorDbSearchActions } from '../ai-knowledge-vector-db-search/ai-knowledge-vector-db-search.actions'

@Component({
  selector: 'app-ai-knowledge-vector-db-details',
  templateUrl: './ai-knowledge-vector-db-details.component.html',
  styleUrls: ['./ai-knowledge-vector-db-details.component.scss']
})
export class AIKnowledgeVectorDbDetailsComponent implements OnInit {
  viewModel$!: Observable<AIKnowledgeVectorDbDetailsViewModel> 
  headerActions$!: Observable<Action[]>
  public aIKnowledgeVectorDbSearchFormGroup!: FormGroup
  public formGroup: FormGroup

  constructor(
    private store: Store,
    private breadcrumbService: BreadcrumbService
  ) {
    this.formGroup = new FormGroup({
      name: new FormControl(null, [Validators.maxLength(255)]),
      description: new FormControl(null, [Validators.maxLength(255)]),
      vdb: new FormControl(null, [Validators.maxLength(255)]),
      vdbCollection: new FormControl(null, [Validators.maxLength(255)]),
      aiContext: new FormControl(null, [Validators.maxLength(255)]),
    })
  }

  ngOnInit(): void {
    this.viewModel$ = this.store.select(selectAIKnowledgeVectorDbDetailsViewModel)
  
    this.headerActions$ = this.viewModel$.pipe(
      map((vm) => {
        const actions: Action[] = [
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.BACK',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.BACK',
            show: 'always',
            icon: PrimeIcons.ARROW_LEFT,
            actionCallback: () => {
              window.history.back()
            }
          },
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.EDIT',
            show: 'always',
            icon: PrimeIcons.PENCIL,
            actionCallback: () => {
              this.edit(vm.details?.id ?? '')
            }
          },
          {
            titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.DELETE',
            labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.GENERAL.DELETE',
            icon: PrimeIcons.TRASH,
            show: 'asOverflow',
            btnClass: '',
            actionCallback: () => {
              this.delete(vm.details?.id ?? '')
            }
          }
        ]
        return actions
      })
    )

    this.viewModel$.subscribe((aIKnVec) => {
      const name = aIKnVec.details?.name ?? ''
      const appId = aIKnVec.details?.aiContext.appId ?? ''

      this.formGroup.patchValue({
        name: aIKnVec.details?.name,
        description: aIKnVec.details?.description,
        vdb: aIKnVec.details?.vdb,
        vdbCollection: aIKnVec.details?.vdbCollection,
        aiContext: appId + name
      })
    })

    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_VECTOR_DB_DETAILS.BREADCRUMB',
        routerLink: '/ai-knowledge-vector-db'
      }
    ])
  }

  edit(id : string ) {
    this.store.dispatch(AIKnowledgeVectorDbSearchActions.editAiKnowledgeVectorDbButtonClicked({ id }))
  }

  delete(id : string ) {
      this.store.dispatch(AIKnowledgeVectorDbSearchActions.deleteAiKnowledgeVectorDbButtonClicked({ id }))
  }
}
