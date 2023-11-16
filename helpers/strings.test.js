import { toCamelCase, toPascalCase } from './strings'

describe('helpers | Strings', () => {
  it('convert string to camelCase', () => {
    const s1 = toCamelCase('  String to_convert  ')
    expect(s1).toEqual('stringToConvert')

    const s2 = toCamelCase('another  String To-convert ')
    expect(s2).toEqual('anotherStringToConvert')
  })

  it('convert string to PascalCase', () => {
    const s1 = toPascalCase('string-to_convert')
    expect(s1).toEqual('StringToConvert')

    const s2 = toPascalCase(' Another_String  To convert  ')
    expect(s2).toEqual('AnotherStringToConvert')
  })
})
