import {} from './consts'
import { System } from './system'
import { Validator } from './validator'
import { Database } from 'arangojs'
import { Config } from 'arangojs/lib/cjs/connection';
// import { unmarshalCursor } from './encoding/cursor';

export class Orango {
  private static dbs: Map<string, Database> = new Map()
  public static system = new System()

  static db(name: string, config: Config | undefined): Database {
    if (!this.dbs.has(name)) {
      const db = new Database(config)
      db.useDatabase(name)
      this.dbs.set(name, db)
    }
    return this.dbs.get(name) as Database
  }

  static validator(schema: Object): Validator {
    return new Validator(schema)
  }

  // async connect(config: any = null): Promise<Orango> {
  //   return this
  // }

  async disconnect(): Promise<boolean> {
    return true
  }

  get connected(): boolean {
    return true
  }

  // async query(db:Database, queryString: string, ClassRef:any = null): Promise<any[]> {
  //   let cursor
  //   cursor = await db.query(queryString);
  //   return await unmarshalCursor(cursor, ClassRef)
  // }
}

export default new Orango()
