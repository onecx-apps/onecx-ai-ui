import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Store } from '@ngrx/store'
import { isValidDate } from '@onecx/accelerator'
import { Action, BreadcrumbService, DataTableColumn, ExportDataService } from '@onecx/portal-integration-angular'
import { PrimeIcons } from 'primeng/api'
import { map, Observable } from 'rxjs'
import { AiKnowledgeVectorDbSearchActions } from './ai-knowledge-vector-db-search.actions'
import {
  AiKnowledgeVectorDbSearchCriteria,
  aiKnowledgeVectorDbSearchCriteriasSchema
} from './ai-knowledge-vector-db-search.parameters'
import { selectAiKnowledgeVectorDbSearchViewModel } from './ai-knowledge-vector-db-search.selectors'
import { AiKnowledgeVectorDbSearchViewModel } from './ai-knowledge-vector-db-search.viewmodel'

@Component({
  selector: 'app-ai-knowledge-vector-db-search',
  templateUrl: './ai-knowledge-vector-db-search.component.html',
  styleUrls: ['./ai-knowledge-vector-db-search.component.scss']
})
export class AiKnowledgeVectorDbSearchComponent implements OnInit {
  viewModel$: Observable<AiKnowledgeVectorDbSearchViewModel> = this.store.select(
    selectAiKnowledgeVectorDbSearchViewModel
  )

  headerActions$: Observable<Action[]> = this.viewModel$.pipe(
    map((vm) => {
      const actions: Action[] = [
        {
          labelKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          icon: PrimeIcons.DOWNLOAD,
          titleKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.EXPORT_ALL',
          show: 'asOverflow',
          actionCallback: () => this.exportItems()
        },
        {
          labelKey: vm.chartVisible
            ? 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          icon: PrimeIcons.EYE,
          titleKey: vm.chartVisible
            ? 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.HIDE_CHART'
            : 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.HEADER_ACTIONS.SHOW_CHART',
          show: 'asOverflow',
          actionCallback: () => this.toggleChartVisibility()
        }
      ]
      return actions
    })
  )

  diagramColumnId = 'id'
  diagramColumn$ = this.viewModel$.pipe(
    map((vm) => vm.columns.find((e) => e.id === this.diagramColumnId) as DataTableColumn)
  )

  public aiKnowledgeVectorDbSearchFormGroup: FormGroup = this.formBuilder.group({
    ...(Object.fromEntries(aiKnowledgeVectorDbSearchCriteriasSchema.keyof().options.map((k) => [k, null])) as Record<
      keyof AiKnowledgeVectorDbSearchCriteria,
      unknown
    >)
  } satisfies Record<keyof AiKnowledgeVectorDbSearchCriteria, unknown>)

  constructor(
    private readonly breadcrumbService: BreadcrumbService,
    private readonly store: Store,
    private readonly formBuilder: FormBuilder,
    @Inject(LOCALE_ID) public readonly locale: string,
    private readonly exportDataService: ExportDataService
  ) {}

  ngOnInit() {
    this.breadcrumbService.setItems([
      {
        titleKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.BREADCRUMB',
        labelKey: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.BREADCRUMB',
        routerLink: '/ai-knowledge-vector-db'
      }
    ])
    this.viewModel$.subscribe((vm) => this.aiKnowledgeVectorDbSearchFormGroup.patchValue(vm.searchCriteria))
  }

  search(formValue: FormGroup) {
    const searchCriteria = Object.entries(formValue.getRawValue()).reduce(
      (acc: Partial<AiKnowledgeVectorDbSearchCriteria>, [key, value]) => ({
        ...acc,
        [key]: isValidDate(value)
          ? new Date(
              Date.UTC(
                value.getFullYear(),
                value.getMonth(),
                value.getDate(),
                value.getHours(),
                value.getMinutes(),
                value.getSeconds()
              )
            )
          : value || undefined
      }),
      {}
    )
    this.store.dispatch(AiKnowledgeVectorDbSearchActions.searchButtonClicked({ searchCriteria }))
  }

  resetSearch() {
    this.store.dispatch(AiKnowledgeVectorDbSearchActions.resetButtonClicked())
  }

  exportItems() {
    this.store.dispatch(AiKnowledgeVectorDbSearchActions.exportButtonClicked())
  }

  viewModeChanged(viewMode: 'basic' | 'advanced') {
    this.store.dispatch(
      AiKnowledgeVectorDbSearchActions.viewModeChanged({
        viewMode: viewMode
      })
    )
  }

  onDisplayedColumnsChange(displayedColumns: DataTableColumn[]) {
    this.store.dispatch(AiKnowledgeVectorDbSearchActions.displayedColumnsChanged({ displayedColumns }))
  }

  toggleChartVisibility() {
    this.store.dispatch(AiKnowledgeVectorDbSearchActions.chartVisibilityToggled())
  }
}
