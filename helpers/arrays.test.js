import { SORTING_DIRECTIONS, sortAlphabetically, sortNumerically } from './arrays'

describe('Helpers | Arrays', () => {
  const table = [
    { name: 'z', score: 40 },
    { name: 'y', score: 20 },
    { name: 'x', score: 30 }
  ]

  it('sort table items alphabetically and ascendingly', () => {
    table.sort(sortAlphabetically('name', SORTING_DIRECTIONS.ASC))
    expect(table[0].name).toEqual('x')
    expect(table[1].name).toEqual('y')
    expect(table[2].name).toEqual('z')
  })

  it('sort table items alphabetically and descendingly', () => {
    table.sort(sortAlphabetically('name', SORTING_DIRECTIONS.DESC))
    expect(table[0].name).toEqual('z')
    expect(table[1].name).toEqual('y')
    expect(table[2].name).toEqual('x')
  })

  it('sort table items numerically and ascendingly', () => {
    table.sort(sortNumerically('score', SORTING_DIRECTIONS.ASC))
    expect(table[0].score).toEqual(20)
    expect(table[1].score).toEqual(30)
    expect(table[2].score).toEqual(40)
  })

  it('sort table items numerically and descendingly', () => {
    table.sort(sortNumerically('score', SORTING_DIRECTIONS.DESC))
    expect(table[0].score).toEqual(40)
    expect(table[1].score).toEqual(30)
    expect(table[2].score).toEqual(20)
  })
})
