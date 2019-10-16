/** Declaration file generated by dts-gen */

export class Complex {
  constructor(re: number, im?: number);

  re(): number;
  im(): number;

  abs(): any;

  abs2(): any;

  add(z2: any): any;

  arg(): any;

  conj(): any;

  equal(z2: any): any;

  isZero(): any;

  mul(z2: any): any;

  normalize(): any;

  sub(z2: any): any;

  toString(complexFormat: any, precision: any): any;

  static fromPolar(r: any, phi: any): any;
}

export class Dimension {
  constructor(name: any, size: any, coordNames: any);

  coordNameToIndex(coordName: any): any;

  isEqual(dim2: any): any;

  toString(): any;

  static checkDimensions(dims1: any, dims2: any): void;

  static concatDimNames(dims: any): any;

  static direction(): any;

  static polarization(): any;

  static position(size: any, name: any): any;

  static spin(): any;

  static stringToCoordIndices(s: any, dimensions: any): any;
}

export class Operator {
  constructor(entries: any, dimensionsOut: any, dimensionsIn: any);

  add(m2: any): any;

  conj(): any;

  dag(): any;

  mulConstant(c: any): any;

  mulVec(v: any): any;

  mulVecPartial(coordIndices: any, v: any): any;

  outer(m2: any): any;

  sub(m2: any): any;

  toString(complexFormat: any, precision: any, separator: any): any;

  transpose(): any;

  static add(ops: any): any;

  static fromArray(
    denseArray: any,
    dimensionsOut: any,
    dimensionsIn: any,
    removeZeros: any
  ): any;

  static fromSparseCoordNames(
    stringedEntries: any,
    dimensionsOut: any,
    dimensionsIn: any
  ): any;

  static identity(dimensions: any): any;

  static indicator(dimensions: any, coordNames: any): any;

  static outer(ops: any): any;

  static shift(dimension: any, shift: any): any;

  static zeros(dimensionsOut: any, dimensionsIn: any): any;
}

export class OperatorEntry {
  constructor(coordOut: any, coordIn: any, value: any);

  outer(e2: any): any;

  toString(): any;

  static fromIndexIndexValue(
    indexOut: any,
    indexIn: any,
    sizesOut: any,
    sizesIn: any,
    value: any
  ): any;
}

export class Photons {
  constructor(sizeX: number, sizeY: number);

  vector(): Vector;

  actOnSinglePhotons(opsWithPos: any): void;

  addPhotonIndicator(posX: any, posY: any, dir: any, pol: any): void;

  aggregatePolarization(): any;

  createLocalizedOperator(op: any, posX: any, posY: any): any;

  createPhoton(posX: any, posY: any, dir: any, pol: any): any;

  createPhotonPropagator(yDirMeansDown: any): any;

  createSinglePhotonInteraction(opsWithPos: any): any;

  propagatePhotons(yDirMeansDown?: boolean): void;

  totalIntensityPerTile(): any;
}

export class Vector {
  constructor(cells: any, dimensions: any);

  add(v2: any): any;

  conj(): any;

  dot(v2: any): any;

  mulConstant(c: any): any;

  outer(v2: any): any;

  sub(v2: any): any;

  toString(complexFormat: any, precision: any, separator: any): any;

  static add(vectors: any): any;

  static fromArray(denseArray: any, dimensions: any, removeZeros: any): any;

  static fromSparseCoordNames(stringedEntries: any, dimensions: any): any;

  static indicator(dimensions: any, coordNames: any): any;

  static outer(vectors: any): any;
}

export class VectorEntry {
  constructor(coord: any, value: any);

  outer(e2: any): any;

  toString(): any;

  static fromIndexValue(index: any, sizes: any, value: any): any;
}

export const TAU: number;

export function CoordsFromIndex(index: any, sizes: any): any;

export function Cx(re: number, im?: number): Complex;

export function PolarizerNS(angle: any): any;

export function amplitudeIntensity(r: any, rot: any): any;

export function attenuator(r: any): any;

export function beamSplitter(angle: any): any;

export function beamsplitterTransmittionDirections(angle: any): any;

export function cornerCube(): any;

export function diodeForDirections(angle: any): any;

export function faradayRotator(angle: any, polarizationRotation: any): any;

export function glassSlab(): any;

export function mirror(angle: any): any;

export function phasePlate(
  angle: any,
  polarizationOrientation: any,
  phase: any
): any;

export function phaseShiftForRealEigenvectors(
  alpha: any,
  phase: any,
  phaseOrthogonal: any,
  dimension: any
): any;

export function polarizer(angle: any, polarizationOrientation: any): any;

export function polarizerWE(angle: any): any;

export function polarizingBeamsplitter(angle: any): any;

export function projectionMatrix(alpha: any, dimension: any): any;

export function quarterWavePlateNS(angle: any): any;

export function quarterWavePlateWE(angle: any): any;

export function reflectFromPlaneDirection(angle: any): any;

export function reflectPhaseFromDenser(): any;

export function reflectPhaseFromLighter(): any;

export function rotationMatrix(alpha: any, dimension: any): any;

export function sugarSolution(polarizationRotation?: any): any;

export function vacuumJar(): any;

export namespace isqrt2 {
  const im: number;

  const phi: number;

  const phiTau: number;

  const r: number;

  const re: number;

  function abs(): any;

  function abs2(): any;

  function add(z2: any): any;

  function arg(): any;

  function conj(): any;

  function equal(z2: any): any;

  function isZero(): any;

  function mul(z2: any): any;

  function normalize(): any;

  function sub(z2: any): any;

  function toString(complexFormat: any, precision: any): any;
}
