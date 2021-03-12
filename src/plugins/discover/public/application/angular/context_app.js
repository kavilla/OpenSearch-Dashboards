/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import _ from 'lodash';
import { CONTEXT_STEP_SETTING, CONTEXT_TIE_BREAKER_FIELDS_SETTING } from '../../../common';
import { getAngularModule, getServices } from '../../opensearch_dashboards_services';
import contextAppTemplate from './context_app.html';
import './context/components/action_bar';
import { getFirstSortableField } from './context/api/utils/sorting';
import {
  createInitialQueryParametersState,
  getQueryParameterActions,
  QUERY_PARAMETER_KEYS,
} from './context/query_parameters';
import {
  createInitialLoadingStatusState,
  FAILURE_REASONS,
  LOADING_STATUS,
  QueryActionsProvider,
} from './context/query';
import { callAfterBindingsWorkaround } from './context/helpers/call_after_bindings_workaround';

getAngularModule().directive('contextApp', function ContextApp() {
  return {
    bindToController: true,
    controller: callAfterBindingsWorkaround(ContextAppController),
    controllerAs: 'contextApp',
    restrict: 'E',
    scope: {
      anchorId: '=',
      columns: '=',
      indexPattern: '=',
      filters: '=',
      predecessorCount: '=',
      successorCount: '=',
      sort: '=',
    },
    template: contextAppTemplate,
  };
});

function ContextAppController($scope, Private) {
  const { filterManager, indexPatterns, uiSettings } = getServices();
  const queryParameterActions = getQueryParameterActions(filterManager, indexPatterns);
  const queryActions = Private(QueryActionsProvider);
  this.state = createInitialState(
    parseInt(uiSettings.get(CONTEXT_STEP_SETTING), 10),
    getFirstSortableField(this.indexPattern, uiSettings.get(CONTEXT_TIE_BREAKER_FIELDS_SETTING))
  );

  this.actions = _.mapValues(
    {
      ...queryParameterActions,
      ...queryActions,
    },
    (action) => (...args) => action(this.state)(...args)
  );

  this.constants = {
    FAILURE_REASONS,
    LOADING_STATUS,
  };

  $scope.$watchGroup(
    [
      () => this.state.rows.predecessors,
      () => this.state.rows.anchor,
      () => this.state.rows.successors,
    ],
    (newValues) => this.actions.setAllRows(...newValues)
  );

  /**
   * Sync properties to state
   */
  $scope.$watchCollection(
    () => ({
      ..._.pick(this, QUERY_PARAMETER_KEYS),
      indexPatternId: this.indexPattern.id,
    }),
    (newQueryParameters) => {
      const { queryParameters } = this.state;
      if (
        newQueryParameters.indexPatternId !== queryParameters.indexPatternId ||
        newQueryParameters.anchorId !== queryParameters.anchorId ||
        !_.isEqual(newQueryParameters.sort, queryParameters.sort)
      ) {
        this.actions.fetchAllRowsWithNewQueryParameters(_.cloneDeep(newQueryParameters));
      } else if (
        newQueryParameters.predecessorCount !== queryParameters.predecessorCount ||
        newQueryParameters.successorCount !== queryParameters.successorCount ||
        !_.isEqual(newQueryParameters.filters, queryParameters.filters)
      ) {
        this.actions.fetchContextRowsWithNewQueryParameters(_.cloneDeep(newQueryParameters));
      }
    }
  );

  /**
   * Sync state to properties
   */
  $scope.$watchCollection(
    () => ({
      predecessorCount: this.state.queryParameters.predecessorCount,
      successorCount: this.state.queryParameters.successorCount,
    }),
    (newParameters) => {
      _.assign(this, newParameters);
    }
  );
}

function createInitialState(defaultStepSize, tieBreakerField) {
  return {
    queryParameters: createInitialQueryParametersState(defaultStepSize, tieBreakerField),
    rows: {
      all: [],
      anchor: null,
      predecessors: [],
      successors: [],
    },
    loadingStatus: createInitialLoadingStatusState(),
  };
}
