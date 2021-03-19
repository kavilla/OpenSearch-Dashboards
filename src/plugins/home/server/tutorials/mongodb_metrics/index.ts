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

import { i18n } from '@osd/i18n';
import { TutorialsCategory } from '../../services/tutorials';
import { onPremInstructions } from '../instructions/metricbeat_instructions';
import {
  TutorialContext,
  TutorialSchema,
} from '../../services/tutorials/lib/tutorials_registry_types';

export function mongodbMetricsSpecProvider(context: TutorialContext): TutorialSchema {
  const moduleName = 'mongodb';
  return {
    id: 'mongodbMetrics',
    name: i18n.translate('home.tutorials.mongodbMetrics.nameTitle', {
      defaultMessage: 'MongoDB metrics',
    }),
    moduleName,
    category: TutorialsCategory.METRICS,
    shortDescription: i18n.translate('home.tutorials.mongodbMetrics.shortDescription', {
      defaultMessage: 'Fetch internal metrics from MongoDB.',
    }),
    longDescription: i18n.translate('home.tutorials.mongodbMetrics.longDescription', {
      defaultMessage:
        'The `mongodb` Metricbeat module fetches internal metrics from the MongoDB server. \
[Learn more]({learnMoreLink}).',
      values: {
        learnMoreLink: '{config.docs.beats.metricbeat}/metricbeat-module-mongodb.html',
      },
    }),
    euiIconType: 'logoMongodb',
    artifacts: {
      dashboards: [
        {
          id: 'Metricbeat-MongoDB-ecs',
          linkLabel: i18n.translate(
            'home.tutorials.mongodbMetrics.artifacts.dashboards.linkLabel',
            {
              defaultMessage: 'MongoDB metrics dashboard',
            }
          ),
          isOverview: true,
        },
      ],
      exportedFields: {
        documentationUrl: '{config.docs.beats.metricbeat}/exported-fields-mongodb.html',
      },
    },
    completionTimeMinutes: 10,
    onPrem: onPremInstructions(moduleName, context),
  };
}
