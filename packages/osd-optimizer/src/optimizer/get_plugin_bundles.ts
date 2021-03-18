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

import Path from 'path';

import { Bundle } from '../common';

import { OpenSearchDashboardsPlatformPlugin } from './opensearch_dashboards_platform_plugins';

export function getPluginBundles(
  plugins: OpenSearchDashboardsPlatformPlugin[],
  repoRoot: string,
  outputRoot: string
) {
  const xpackDirSlash = Path.resolve(repoRoot, 'x-pack') + Path.sep;

  return plugins
    .filter((p) => p.isUiPlugin)
    .map(
      (p) =>
        new Bundle({
          type: 'plugin',
          id: p.id,
          publicDirNames: ['public', ...p.extraPublicDirs],
          sourceRoot: repoRoot,
          contextDir: p.directory,
          outputDir: Path.resolve(
            outputRoot,
            Path.relative(repoRoot, p.directory),
            'target/public'
          ),
          manifestPath: p.manifestPath,
          banner: p.directory.startsWith(xpackDirSlash)
            ? `/*! Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one or more contributor license agreements.\n` +
              ` * Licensed under the Elastic License; you may not use this file except in compliance with the Elastic License. */\n`
            : undefined,
        })
    );
}
