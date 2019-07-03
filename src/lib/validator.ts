export class Validator {
  constructor(schema:any) {
    console.log(schema)
  }

  validate(data: any): Error {
    console.log(data)
    return null
  }
}
