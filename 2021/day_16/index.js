// import { Grid } from '../../utils.js';
import { inspect } from 'unist-util-inspect';
import fs from 'fs';

const HEX = {
  '0': [0, 0, 0, 0],
  '1': [0, 0, 0, 1],
  '2': [0, 0, 1, 0],
  '3': [0, 0, 1, 1],
  '4': [0, 1, 0, 0],
  '5': [0, 1, 0, 1],
  '6': [0, 1, 1, 0],
  '7': [0, 1, 1, 1],
  '8': [1, 0, 0, 0],
  '9': [1, 0, 0, 1],
  'A': [1, 0, 1, 0],
  'B': [1, 0, 1, 1],
  'C': [1, 1, 0, 0],
  'D': [1, 1, 0, 1],
  'E': [1, 1, 1, 0],
  'F': [1, 1, 1, 1],
}

function init() {
  return fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split('')
    .map((s) => HEX[s])
    .flat();
}

function read(buf, n) {
  if (n > buf.length) {
    return [];
  }
  return buf.splice(0, n);
}

function readInt(buf, n) {
  return parseInt(read(buf, n).join(''), 2);
}

/**
 * To do this, the binary number is padded with leading zeroes until its length is a multiple of four bits,
 * and then it is broken into groups of four bits.
 * Each group is prefixed by a 1 bit except the last group, which is prefixed by a 0 bit.
 * These groups of five bits immediately follow the packet header.
 * @param data
 */
function parseLiteral(data) {
  let s = 0;
  while (true) {
    let d = readInt(data, 5);
    if (d < 16) {
      return s * 16 + d;
    }
    s = s * 16 + (d - 16)
  }
}

/*
  /*
  Packets with type ID 0 are sum packets - their value is the sum of the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 1 are product packets - their value is the result of multiplying together the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is less than the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have exactly two sub-packets.
   */

/**
 * Every packet begins with a standard header: the first three bits encode the packet version,
 * and the next three bits encode the packet type ID. These two values are numbers;
 * all numbers encoded in any packet are represented as binary with the most significant bit first.
 *
 * - Packets with type ID 4 represent a literal value.
 * - Every other type of packet (any packet with a type ID other than 4) represent an operator
 *
 * the bit immediately after the packet header; this is called the length type ID:
 * - If the length type ID is 0, then the next 15 bits are a number that represents the total length in bits of the sub-packets contained by this packet.
 * - If the length type ID is 1, then the next 11 bits are a number that represents the number of sub-packets immediately contained by this packet.
 * @param data
 */
function parsePackage(data) {
  const version = readInt(data, 3);
  const typeId = readInt(data, 3);
  if (Number.isNaN(typeId)) {
    return null;
  }
  const type = [
    'sum',
    'mul',
    'min',
    'max',
    'literal',
    'gt',
    'lt',
    'eq',
  ][typeId];

  if (type === 'literal') {
    return {
      version,
      type,
      number: parseLiteral(data),
    }
  }
  const lengthTypeId = readInt(data, 1);
  const pkg = {
    version,
    typeId,
    type,
  }
  if (lengthTypeId === 0) {
    const numBits = readInt(data, 15);
    if (Number.isNaN(numBits)) {
      return null;
    }
    pkg.numBits = numBits;
    pkg.children = parsePackages(read(data, numBits));
  } else {
    const numPacks = readInt(data, 11);
    pkg.numPacks = numPacks;
    pkg.children = parsePackages(data, numPacks);
  }

  return pkg;
}

function parsePackages(data, n = Number.MAX_SAFE_INTEGER) {
  const ret = [];
  while (n--) {
    const pkg = parsePackage(data);
    if (!pkg) {
      break;
    }
    ret.push(pkg);
  }
  return ret;
}

function calc(node) {
  const { type, children } = node;
  switch (type) {
    case 'literal':
      return node.number;
    case 'sum':
      return children.reduce((p, child) => p + calc(child), 0);
    case 'mul':
      return children.reduce((p, child) => p * calc(child), 1);
    case 'min':
      return children.reduce((p, child) => Math.min(p, calc(child)), Number.MAX_SAFE_INTEGER);
    case 'max':
      return children.reduce((p, child) => Math.max(p, calc(child)), Number.MIN_SAFE_INTEGER);
    case 'gt':
      return calc(children[0]) > calc(children[1]) ? 1 : 0;
    case 'lt':
      return calc(children[0]) < calc(children[1]) ? 1 : 0;
    case 'eq':
      return calc(children[0]) === calc(children[1]) ? 1 : 0;
    default:
      throw Error(node.type);
  }
}

function sumVersion(node) {
  let s = node.version;
  if (node.children) {
    for (const child of node.children) {
      s += sumVersion(child);
    }
  }
  return s;
}

function puzzle1() {
  const ast = parsePackage(init());
  console.log(inspect(ast));
  return sumVersion(ast);
}

function puzzle2() {
  return calc(parsePackage(init()));
}


console.log('puzzle 1:', puzzle1()); // 589
console.log('puzzle 2:', puzzle2()); // 2885
