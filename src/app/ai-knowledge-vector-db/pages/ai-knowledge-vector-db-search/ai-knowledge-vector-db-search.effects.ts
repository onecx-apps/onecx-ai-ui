import { Injectable, SkipSelf } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { concatLatestFrom } from '@ngrx/operators'
import { routerNavigatedAction } from '@ngrx/router-store'
import { Action, Store } from '@ngrx/store'
import {
  filterForNavigatedTo,
  filterOutOnlyQueryParamsChanged,
  filterOutQueryParamsHaveNotChanged
} from '@onecx/ngrx-accelerator'
import { ExportDataService, PortalMessageService } from '@onecx/portal-integration-angular'
import equal from 'fast-deep-equal'
import { catchError, map, of, switchMap, tap } from 'rxjs'
import { AiKnowledgeVectorDbBffService } from '../../../shared/generated'
import { AiKnowledgeVectorDbSearchActions } from './ai-knowledge-vector-db-search.actions'
import { AiKnowledgeVectorDbSearchComponent } from './ai-knowledge-vector-db-search.component'
import { aiKnowledgeVectorDbSearchCriteriasSchema } from './ai-knowledge-vector-db-search.parameters'
import {
  aiKnowledgeVectorDbSearchSelectors,
  selectAiKnowledgeVectorDbSearchViewModel
} from './ai-knowledge-vector-db-search.selectors'

@Injectable()
export class AiKnowledgeVectorDbSearchEffects {
  constructor(
    private actions$: Actions,
    @SkipSelf() private route: ActivatedRoute,
    private aiKnowledgeVectorDbService: AiKnowledgeVectorDbBffService,
    private router: Router,
    private store: Store,
    private messageService: PortalMessageService,
    private readonly exportDataService: ExportDataService
  ) {}

  syncParamsToUrl$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(
          AiKnowledgeVectorDbSearchActions.searchButtonClicked,
          AiKnowledgeVectorDbSearchActions.resetButtonClicked
        ),
        concatLatestFrom(() => [
          this.store.select(aiKnowledgeVectorDbSearchSelectors.selectCriteria),
          this.route.queryParams
        ]),
        tap(([, criteria, queryParams]) => {
          const results = aiKnowledgeVectorDbSearchCriteriasSchema.safeParse(queryParams)
          if (!results.success || !equal(criteria, results.data)) {
            const params = {
              ...criteria
              //TODO: Move to docs to explain how to only put the date part in the URL in case you have date and not datetime
              //exampleDate: criteria.exampleDate?.toISOString()?.slice(0, 10)
            }
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: params,
              replaceUrl: true,
              onSameUrlNavigation: 'ignore'
            })
          }
        })
      )
    },
    { dispatch: false }
  )

  searchByUrl$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AiKnowledgeVectorDbSearchComponent),
      filterOutQueryParamsHaveNotChanged(this.router, aiKnowledgeVectorDbSearchCriteriasSchema, false),
      concatLatestFrom(() => this.store.select(aiKnowledgeVectorDbSearchSelectors.selectCriteria)),
      switchMap(([, searchCriteria]) => this.performSearch(searchCriteria))
    )
  })

  performSearch(searchCriteria: Record<string, any>) {
    return this.aiKnowledgeVectorDbService
      .searchAiKnowledgeVectorDbs({
        ...Object.entries(searchCriteria).reduce(
          (acc, [key, value]) => ({
            ...acc,
            [key]: value instanceof Date ? value.toISOString() : value
          }),
          {}
        )
      })
      .pipe(
        map(({ results, totalNumberOfResults }) =>
          AiKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsReceived({
            results,
            totalNumberOfResults
          })
        ),
        catchError((error) =>
          of(
            AiKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsLoadingFailed({
              error
            })
          )
        )
      )
  }

  rehydrateChartVisibility$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      filterForNavigatedTo(this.router, AiKnowledgeVectorDbSearchComponent),
      filterOutOnlyQueryParamsChanged(this.router),
      map(() =>
        AiKnowledgeVectorDbSearchActions.chartVisibilityRehydrated({
          visible: localStorage.getItem('aiKnowledgeVectorDbChartVisibility') === 'true'
        })
      )
    )
  })

  saveChartVisibility$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AiKnowledgeVectorDbSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(aiKnowledgeVectorDbSearchSelectors.selectChartVisible)),
        tap(([, chartVisible]) => {
          localStorage.setItem('aiKnowledgeVectorDbChartVisibility', String(chartVisible))
        })
      )
    },
    { dispatch: false }
  )

  exportData$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(AiKnowledgeVectorDbSearchActions.chartVisibilityToggled),
        concatLatestFrom(() => this.store.select(selectAiKnowledgeVectorDbSearchViewModel)),
        map(([, viewModel]) => {
          this.exportDataService.exportCsv(viewModel.displayedColumns, viewModel.results, 'AiKnowledgeVectorDb.csv')
        })
      )
    },
    { dispatch: false }
  )

  errorMessages: { action: Action; key: string }[] = [
    {
      action: AiKnowledgeVectorDbSearchActions.aiKnowledgeVectorDbSearchResultsLoadingFailed,
      key: 'AI_KNOWLEDGE_VECTOR_DB_SEARCH.ERROR_MESSAGES.SEARCH_RESULTS_LOADING_FAILED'
    }
  ]

  displayError$ = createEffect(
    () => {
      return this.actions$.pipe(
        tap((action) => {
          const e = this.errorMessages.find((e) => e.action.type === action.type)
          if (e) {
            this.messageService.error({ summaryKey: e.key })
          }
        })
      )
    },
    { dispatch: false }
  )
}
