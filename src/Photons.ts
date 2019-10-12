// create state
// loop of
// - make it pass through U
// - propagate
// - note detection probabilities

import _ from "lodash"
import Vector from "./Vector"
import Operator from "./Operator"
import Dimension from "./Dimension"
import { Cx } from "./Complex"
import { Complex } from "../main"

export default class Photons {
  readonly sizeX: number
  readonly sizeY: number
  vector: Vector
  nPhotons: number
  readonly dimX: Dimension
  readonly dimY: Dimension

  constructor(sizeX: number, sizeY: number) {
    this.sizeX = sizeX
    this.sizeY = sizeY
    this.vector = new Vector([], [])
    this.nPhotons = 0
    this.dimX = Dimension.position(sizeX, "x")
    this.dimY = Dimension.position(sizeY, "y")
  }

  createPhoton(posX: number, posY: number, dir: string, pol: string): Vector {
    const dimensions = [this.dimX, this.dimY, Dimension.direction(), Dimension.polarization()]
    const state = [posX.toString(), posY.toString(), dir, pol]

    return Vector.indicator(dimensions, state)
  }

  addPhotonIndicator(posX: number, posY: number, dir: string, pol: string): void {
    // for now, let's assume these are:
    // - perpendicular (otherwise would need creation-operator-like weightging)
    // - just two (otherwise would need dimension permutation OR outer with positios inside)
    const newPhoton = this.createPhoton(posX, posY, dir, pol)
    const oldPhotons = this.vector
    this.nPhotons += 1
    if (this.nPhotons === 1) {
      this.vector = newPhoton
    } else if (this.nPhotons === 2) {
      if (!newPhoton.dot(this.vector).isZero) {
        throw `Adding photons not yet implemented for non-ortogonal states. Old photon:\n${this.vector}\nand new photon:\n${newPhoton}`
      }
      this.vector = Vector.add([oldPhotons.outer(newPhoton), newPhoton.outer(oldPhotons)]).mulConstant(Cx(Math.SQRT1_2))
    } else {
      throw `Adding 3 or more particles not yet implemented`
    }
  }

  createPhotonPropagator(yDirMeansDown = true): Operator {
    const dir = Dimension.direction()
    const dimX = this.dimX
    const dimY = this.dimY
    const s = yDirMeansDown ? 1 : -1

    return Operator.add([
      Operator.outer([Operator.shift(dimX, +1), Operator.identity([dimY]), Operator.indicator([dir], [">"])]),
      Operator.outer([Operator.shift(dimX, -1), Operator.identity([dimY]), Operator.indicator([dir], ["<"])]),
      Operator.outer([Operator.identity([dimX]), Operator.shift(dimY, +s), Operator.indicator([dir], ["v"])]),
      Operator.outer([Operator.identity([dimX]), Operator.shift(dimY, -s), Operator.indicator([dir], ["^"])]),
    ])
  }

  // UGLY AS FCK BUT, HAD SOME ERRORS
  propagatePhotons(yDirMeansDown = true): void {
    if (this.nPhotons !== 1) {
      /// SEE COMMENT ABOVE
      throw `Right now implemented only for 1 photon. Here we have ${this.nPhotons} photons.`
    }
    const photonPropagator = this.createPhotonPropagator(yDirMeansDown)
    // _.range(this.nPhotons).forEach(_i => {
    //this.vector = photonPropagator.mulVecPartial([4 * i, 4 * i + 1, 4 * i + 2], this.vector)
    this.vector = photonPropagator.outer(Operator.identity([Dimension.polarization()])).mulVec(this.vector)
    //})
  }

  createLocalizedOperator(op: Operator, posX: number, posY: number): Operator {
    return Operator.outer([Operator.indicator([this.dimX, this.dimY], [`${posX}`, `${posY}`]), op])
  }

  createSinglePhotonInteraction(opsWithPos: [number, number, Operator][]): Operator {
    // some space for improvement with avoiding identity (direct sum structure)
    const localizedOpsShifted = opsWithPos.map((x: [number, number, Operator]) => {
      const [posX, posY, op] = x
      const shiftedOp = op.sub(Operator.identity([Dimension.direction(), Dimension.polarization()]))
      return this.createLocalizedOperator(shiftedOp, posX, posY)
    })

    return Operator.add([
      Operator.identity([this.dimX, this.dimY, Dimension.direction(), Dimension.polarization()]),
      ...localizedOpsShifted,
    ])
  }

  actOnSinglePhotons(opsWithPos: [number, number, Operator][]): void {
    if (this.nPhotons !== 1) {
      /// SEE COMMENT ABOVE
      throw `Right now implemented only for 1 photon. Here we have ${this.nPhotons} photons.`
    }
    const singlePhotonInteraction = this.createSinglePhotonInteraction(opsWithPos)
    this.vector = singlePhotonInteraction.mulVec(this.vector)
    // _.range(this.nPhotons).forEach(i => {
    //   this.vector = singlePhotonInteraction.mulVecPartial([4 * i, 4 * i + 1, 4 * i + 2, 4 * i + 3], this.vector)
    // })
  }

  /**
   * Right now kind od dirty, but should work
   * Angles 0-360, starting from --> and moving counterclockwise
   * |psi> = (are + i aim) |H> + (bre + i bim) |V>
   */
  aggregatePolarization(): {
    x: number
    y: number
    direction: number
    are: number
    aim: number
    bre: number
    bim: number
  }[] {
    if (this.nPhotons !== 1) {
      throw `Right now implemented only for 1 photon. Here we have ${this.nPhotons} photons.`
    }
    const aggregated = _.chain(this.vector.cells)
      .groupBy(entry => _.at(entry.coord, [0, 1, 2]))
      .values()
      .map(entries => {
        const first = entries[0]
        const [x, y, dir, _pol] = first.coord
        const amplitudes: [Complex, Complex] = [Cx(0), Cx(0)]
        entries.forEach(entry => {
          amplitudes[entry.coord[3]] = entry.value
        })
        return {
          x: x,
          y: y,
          direction: 90 * dir,
          are: amplitudes[0].re,
          aim: amplitudes[0].im,
          bre: amplitudes[1].re,
          bim: amplitudes[1].im,
        }
      })
      .value()

    return aggregated
  }

  totalIntensityPerTile(): { x: number; y: number; probability: number }[] {
    if (this.nPhotons !== 1) {
      throw `Right now implemented only for 1 photon. Here we have ${this.nPhotons} photons.`
    }

    const aggregated = _.chain(this.vector.cells)
      .groupBy(entry => _.at(entry.coord, [0, 1]))
      .values()
      .map(entries => {
        const first = entries[0]
        const [x, y, _dir, _pol] = first.coord
        const probability = entries.map(entry => entry.value.abs2()).reduce((a, b) => a + b)

        return {
          x: x,
          y: y,
          probability: probability,
        }
      })
      .value()

    return aggregated
  }
}