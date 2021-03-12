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

import { CoreEditor, Position } from '../../types';
import { getCurrentMethodAndTokenPaths } from './autocomplete';

// @ts-ignore
import { getTopLevelUrlCompleteComponents } from '../osd/osd';
// @ts-ignore
import { populateContext } from './engine';

export function getEndpointFromPosition(editor: CoreEditor, pos: Position, parser: any) {
  const lineValue = editor.getLineValue(pos.lineNumber);
  const context = {
    ...getCurrentMethodAndTokenPaths(
      editor,
      {
        column: lineValue.length + 1 /* Go to the very end of the line */,
        lineNumber: pos.lineNumber,
      },
      parser,
      true
    ),
  };
  const components = getTopLevelUrlCompleteComponents(context.method);
  populateContext(context.urlTokenPath, context, editor, true, components);
  return context.endpoint;
}
