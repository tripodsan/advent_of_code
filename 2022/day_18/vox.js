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


import fs from 'fs';
import { Grid } from '../../utils.js';

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

const points = fs.readFileSync('./input.txt', 'utf-8')
  .trim().split('\n')
  .map((d) => d.split(',').map((d) => parseInt(d, 10)));

const grid = new Grid(3);
points.forEach((d) => grid.put(d));
const XX = grid.max[0] - grid.min[0];
const YY = grid.max[1] - grid.min[1];
const ZZ = grid.max[2] - grid.min[2];

const file = [];

function out(data, s) {
  for (let i = 0; i < s.length; i++) {
    data.push(s.charCodeAt(i));
  }
  return data;
}

function int(data, v) {
  const buf = Buffer.allocUnsafe(4)
  buf.writeInt32LE(v);
  for (const c of buf.values()){
    data.push(c);
  }
  return data;
}

/*
2. Chunk Structure
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
1x4      | char       | chunk id
4        | int        | num bytes of chunk content (N)
4        | int        | num bytes of children chunks (M)

N        |            | chunk content

M        |            | children chunks
-------------------------------------------------------------------------------
 */
function chunk(data, c) {
  out(data, c.name);
  int(data, c.data.length);
  const chunks = c.chunks ?? [];
  const sub = [];
  chunks.forEach((cc) => chunk(sub, cc));
  int(data, sub.length);
  data.push(...c.data);
  data.push(...sub);
}

/*
5. Chunk id 'SIZE' : model size
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
4        | int        | size x
4        | int        | size y
4        | int        | size z : gravity direction
-------------------------------------------------------------------------------
 */
function size() {
  const data = [];
  int(data, XX);
  int(data, YY);
  int(data, ZZ);
  return data;
}

/*

6. Chunk id 'XYZI' : model voxels, paired with the SIZE chunk
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
4        | int        | numVoxels (N)
4 x N    | int        | (x, y, z, colorIndex) : 1 byte for each component
-------------------------------------------------------------------------------

 */
function xyzi() {
  const data = [];
  int(data, points.length);
  for (const [x, y, z] of points) {
    const dx = x - grid.min[0];
    const dy = y - grid.min[1];
    const dz = z - grid.min[2];
    data.push(dx);
    data.push(dy);
    data.push(dz);
    const r = (dx - XX/2)**2 + (dy - YY/2)**2 + (dz- ZZ/2)**2;
    data.push(r);
    // int(data, x - min[0]);
    // int(data, y - min[1]);
    // int(data, z - min[2]);
  }
  return data;
}

/*
 7. Chunk id 'RGBA' : palette
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
4 x 256  | int        | (R, G, B, A) : 1 byte for each component
                      | * <NOTICE>
                      | * color [0-254] are mapped to palette index [1-255], e.g :
                      |
                      | for ( int i = 0; i <= 254; i++ ) {
                      |     palette[i + 1] = ReadRGBA();
                      | }
-------------------------------------------------------------------------------
 */
function palette() {
  const data = [];
  for (let i = 0; i < 255; i++) {
    const { r, g, b } = HSVtoRGB((i / 255) / 5, 1, 1);
    data.push(r);
    data.push(g);
    data.push(b);
    data.push(128);
  }
  return data;
}


// header
out(file, 'VOX ');
int(file, 150);
chunk(file, {
  name: 'MAIN',
  data: [],
  chunks: [{
  //   name: 'PACK',
  //   data: int([], 1), // 1 model
  // }, {
    name: 'SIZE',
    data: size(),
  }, {
    name: 'XYZI',
    data: xyzi(),
  }, {
    name: 'RGBA',
    data: palette(),
  }],
});

fs.writeFileSync('data.vox', Buffer.from(file));
console.log(file);


/*
MagicaVoxel .vox File Format [10/18/2016]

1. File Structure : RIFF style
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
1x4      | char       | id 'VOX ' : 'V' 'O' 'X' 'space', 'V' is first
4        | int        | version number : 150

Chunk 'MAIN'
{
    // pack of models
    Chunk 'PACK'    : optional

    // models
    Chunk 'SIZE'
    Chunk 'XYZI'

    Chunk 'SIZE'
    Chunk 'XYZI'

    ...

    Chunk 'SIZE'
    Chunk 'XYZI'

    // palette
    Chunk 'RGBA'    : optional
}
-------------------------------------------------------------------------------


2. Chunk Structure
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
1x4      | char       | chunk id
4        | int        | num bytes of chunk content (N)
4        | int        | num bytes of children chunks (M)

N        |            | chunk content

M        |            | children chunks
-------------------------------------------------------------------------------


3. Chunk id 'MAIN' : the root chunk and parent chunk of all the other chunks


4. Chunk id 'PACK' : if it is absent, only one model in the file; only used for the animation in 0.98.2
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
4        | int        | numModels : num of SIZE and XYZI chunks
-------------------------------------------------------------------------------


5. Chunk id 'SIZE' : model size
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
4        | int        | size x
4        | int        | size y
4        | int        | size z : gravity direction
-------------------------------------------------------------------------------


6. Chunk id 'XYZI' : model voxels, paired with the SIZE chunk
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
4        | int        | numVoxels (N)
4 x N    | int        | (x, y, z, colorIndex) : 1 byte for each component
-------------------------------------------------------------------------------


7. Chunk id 'RGBA' : palette
-------------------------------------------------------------------------------
# Bytes  | Type       | Value
-------------------------------------------------------------------------------
4 x 256  | int        | (R, G, B, A) : 1 byte for each component
                      | * <NOTICE>
                      | * color [0-254] are mapped to palette index [1-255], e.g :
                      |
                      | for ( int i = 0; i <= 254; i++ ) {
                      |     palette[i + 1] = ReadRGBA();
                      | }
-------------------------------------------------------------------------------


8. Default Palette : if chunk 'RGBA' is absent
-------------------------------------------------------------------------------
unsigned int default_palette[256] = {
	0x00000000, 0xffffffff, 0xffccffff, 0xff99ffff, 0xff66ffff, 0xff33ffff, 0xff00ffff, 0xffffccff, 0xffccccff, 0xff99ccff, 0xff66ccff, 0xff33ccff, 0xff00ccff, 0xffff99ff, 0xffcc99ff, 0xff9999ff,
	0xff6699ff, 0xff3399ff, 0xff0099ff, 0xffff66ff, 0xffcc66ff, 0xff9966ff, 0xff6666ff, 0xff3366ff, 0xff0066ff, 0xffff33ff, 0xffcc33ff, 0xff9933ff, 0xff6633ff, 0xff3333ff, 0xff0033ff, 0xffff00ff,
	0xffcc00ff, 0xff9900ff, 0xff6600ff, 0xff3300ff, 0xff0000ff, 0xffffffcc, 0xffccffcc, 0xff99ffcc, 0xff66ffcc, 0xff33ffcc, 0xff00ffcc, 0xffffcccc, 0xffcccccc, 0xff99cccc, 0xff66cccc, 0xff33cccc,
	0xff00cccc, 0xffff99cc, 0xffcc99cc, 0xff9999cc, 0xff6699cc, 0xff3399cc, 0xff0099cc, 0xffff66cc, 0xffcc66cc, 0xff9966cc, 0xff6666cc, 0xff3366cc, 0xff0066cc, 0xffff33cc, 0xffcc33cc, 0xff9933cc,
	0xff6633cc, 0xff3333cc, 0xff0033cc, 0xffff00cc, 0xffcc00cc, 0xff9900cc, 0xff6600cc, 0xff3300cc, 0xff0000cc, 0xffffff99, 0xffccff99, 0xff99ff99, 0xff66ff99, 0xff33ff99, 0xff00ff99, 0xffffcc99,
	0xffcccc99, 0xff99cc99, 0xff66cc99, 0xff33cc99, 0xff00cc99, 0xffff9999, 0xffcc9999, 0xff999999, 0xff669999, 0xff339999, 0xff009999, 0xffff6699, 0xffcc6699, 0xff996699, 0xff666699, 0xff336699,
	0xff006699, 0xffff3399, 0xffcc3399, 0xff993399, 0xff663399, 0xff333399, 0xff003399, 0xffff0099, 0xffcc0099, 0xff990099, 0xff660099, 0xff330099, 0xff000099, 0xffffff66, 0xffccff66, 0xff99ff66,
	0xff66ff66, 0xff33ff66, 0xff00ff66, 0xffffcc66, 0xffcccc66, 0xff99cc66, 0xff66cc66, 0xff33cc66, 0xff00cc66, 0xffff9966, 0xffcc9966, 0xff999966, 0xff669966, 0xff339966, 0xff009966, 0xffff6666,
	0xffcc6666, 0xff996666, 0xff666666, 0xff336666, 0xff006666, 0xffff3366, 0xffcc3366, 0xff993366, 0xff663366, 0xff333366, 0xff003366, 0xffff0066, 0xffcc0066, 0xff990066, 0xff660066, 0xff330066,
	0xff000066, 0xffffff33, 0xffccff33, 0xff99ff33, 0xff66ff33, 0xff33ff33, 0xff00ff33, 0xffffcc33, 0xffcccc33, 0xff99cc33, 0xff66cc33, 0xff33cc33, 0xff00cc33, 0xffff9933, 0xffcc9933, 0xff999933,
	0xff669933, 0xff339933, 0xff009933, 0xffff6633, 0xffcc6633, 0xff996633, 0xff666633, 0xff336633, 0xff006633, 0xffff3333, 0xffcc3333, 0xff993333, 0xff663333, 0xff333333, 0xff003333, 0xffff0033,
	0xffcc0033, 0xff990033, 0xff660033, 0xff330033, 0xff000033, 0xffffff00, 0xffccff00, 0xff99ff00, 0xff66ff00, 0xff33ff00, 0xff00ff00, 0xffffcc00, 0xffcccc00, 0xff99cc00, 0xff66cc00, 0xff33cc00,
	0xff00cc00, 0xffff9900, 0xffcc9900, 0xff999900, 0xff669900, 0xff339900, 0xff009900, 0xffff6600, 0xffcc6600, 0xff996600, 0xff666600, 0xff336600, 0xff006600, 0xffff3300, 0xffcc3300, 0xff993300,
	0xff663300, 0xff333300, 0xff003300, 0xffff0000, 0xffcc0000, 0xff990000, 0xff660000, 0xff330000, 0xff0000ee, 0xff0000dd, 0xff0000bb, 0xff0000aa, 0xff000088, 0xff000077, 0xff000055, 0xff000044,
	0xff000022, 0xff000011, 0xff00ee00, 0xff00dd00, 0xff00bb00, 0xff00aa00, 0xff008800, 0xff007700, 0xff005500, 0xff004400, 0xff002200, 0xff001100, 0xffee0000, 0xffdd0000, 0xffbb0000, 0xffaa0000,
	0xff880000, 0xff770000, 0xff550000, 0xff440000, 0xff220000, 0xff110000, 0xffeeeeee, 0xffdddddd, 0xffbbbbbb, 0xffaaaaaa, 0xff888888, 0xff777777, 0xff555555, 0xff444444, 0xff222222, 0xff111111
};
 */