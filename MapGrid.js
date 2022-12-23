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
    super(dim);
    this._m = new Map();
  }

  key(v) {
    // assume dim = 2
    const v0 = v[0];
    const v1 = v[1];
    const k0 = v0 >= 0 ? v0 * 2 : - v0 * 2 - 1;
    const k1 = v1 >= 0 ? v1 * 2 : - v1 * 2 - 1;
    const k = (k0 + k1) * (k0 + k1 + 1) / 2 + k1;
    if (k > Number.MAX_SAFE_INTEGER) {
      throw Error('Overflow error!');
    }
    return k;
  }

  put(v, data = {}) {
    if (typeof data === 'string') {
      data = {
        c: data,
      }
    }
    const key = this.touch(v);
    const value = {
      v: [...v],
      ...data,
    };
    this._m.set(key, value);
    return value;
  }

  del(v) {
    this._m.delete(this.key(v));
  }

  get(v) {
    return this._m.get(this.key(v));
  }

  getOrSet(v, fn, up) {
    const key = this.touch(v);
    let d = this._m.get(key);
    if (!d) {
      d = {
        v: Array.from(v),
        ...fn(),
      };
      this._m.set(key, d);
    } else if (up) {
      d = up(d);
    }
    return d;
  }

  size() {
    return this._m.size;
  }

  values() {
    return [...this._m.values()];
  }
}
