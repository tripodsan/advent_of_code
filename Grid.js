/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { BaseGrid } from './BaseGrid.js';

export class Grid extends BaseGrid {
  constructor(dim) {
    super(dim)
    this._g = {};
  }

  key(v) {
    return v.join(':');
  }

  put(v, data = {}) {
    if (typeof data === 'string') {
      data = {
        c: data,
      }
    }
    this.touch(v);
    return this._g[this.key(v)] = {
      v: [...v],
      ...data,
    };
  }

  del(v) {
    const key = this.key(v);
    delete this._g[key];
  }

  get(v) {
    return this._g[this.key(v)];
  }

  getOrSet(v, fn, up) {
    const key = this.key(v);
    let d = this._g[key];
    if (!d) {
      this.touch(v);
      d = {
        v: Array.from(v),
        ...fn(),
      };
      this._g[key] = d;
    } else if (up) {
      d = up(d);
    }
    return d;
  }

  size() {
    return this.values().length;
  }

  values() {
    return Object.values(this._g);
  }
}
