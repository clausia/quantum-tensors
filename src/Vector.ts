// VECTOR CLASS
// Tensor-aware named sparse complex vector

// VECTOR CLASS
// TODO: index from/to coordinate
// add
// dot product
// conjugate
// permute

import SparseCell from './SparseCell'
import Complex from './Complex'
import Dimension from './Dimension'

export default class Vector {
    cells: SparseCell[]
    dimensions: Dimension[]

    constructor(cells: SparseCell[], dimensions: Dimension[]) {
        this.cells = cells              // assume ordered?
        this.dimensions = dimensions
        // TODO: validation check
    }

    // Outer product of vectors
    outer(v2: Vector): Vector {
        const v1 = this;
        const size = (v1.dimension.length).concat(v2.size)
        const dimNames = (v1.dimNames).concat(v2.dimNames)
        const coordNames = (v1.coordNames).concat(v2.coordNames)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap
        const cells = (v1.cells).flatMap((cell1: SparseCell) =>
            (v2.cells).map((cell2: SparseCell) =>
                cell1.outer(cell2)
            )
        )
        return new Vector(cells, size, dimNames, coordNames)
    }

    // Override toString() method
    toString(): string {
        const introStr = `Vector of max size [${this.size}] with dimensions [${this.dimNames}]`
        const valueStr = this.cells
            .map((cell) => {
                const coordStr = (cell.coord).map((i: number, dim: number) => this.coordNames[dim][i])
                return `${cell.value.toString()} |${coordStr}⟩`
            })
            .join(" + ")
        return `${introStr}\n${valueStr}`
    }

    // Constructor from array of numbers
    // static fromArray(arr: Complex[], size: number[], dimNames: string[], coordNames: string[][]): Vector {
    //     const sizeRev = [...size]
    //     sizeRev.reverse()

    //     const cells: SparseCell[] = arr
    //         .map((val: Complex, i: number) => [val, i])
    //         .filter((d: [Complex, number]) => { return !d[0].isZero() })
    //         .map((d: [Complex, number]) => {
    //             const cell = d[0]
    //             const coord: number[] = []
    //             let x: number = d[1]
    //             sizeRev.forEach((d) => {
    //                 const r = x % d
    //                 coord.push(r)
    //                 x = (x - r) / d
    //             })
    //             return new SparseCell(coord, cell)
    //         })
    //     arr.forEach((v: Complex, i: number) => {
    //     })
    //     return new Vector(cells, size, dimNames, coordNames)
    // }
}