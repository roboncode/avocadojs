// tslint:disable:no-expression-statement
import { QueryBuilder } from './lib/query';
import { Database, aql } from 'arangojs';
import test from 'ava';
import { Orango } from './index';
import { unmarshalCursor } from './lib/encoding/cursor';
// import orango from './lib/orango';
import { unmarshal } from './lib/encoding/json';

let db = Orango.db('examples', {
  url: 'http://localhost:15100'
});

class User {
  email = '';
  firstName = '';
  lastName = '';

  static get collectionName() {
    return 'users';
  }

  static async findWithMinimalHelpers(db: Database): Promise<User[]> {
    let collection = db.collection("users")
    let query = aql`FOR doc in ${collection} RETURN doc`;
    const cursor = await db.query(query);
    let list = [];
    while (cursor.hasNext()) {
      const result = await cursor.next();
      let classInst = new User();
      let err = unmarshal(result, classInst);
      if (err) {
        throw err;
      }
      list.push(classInst);
    }
    return list;
  }

  static async findWithHelpers(db: Database): Promise<User[]> {
    let query = new QueryBuilder(this.collectionName).find('u').many();
    const cursor = await db.query(query);
    return (await unmarshalCursor(cursor, User)) as User[];
  }
}

test('example #1', async t => {
  let users = await User.findWithMinimalHelpers(db);
  console.log("#1", users)
  t.truthy(users.length === 5);
});

test('example #2', async t => {
  let users = await User.findWithHelpers(db);
  console.log("#2", users)
  t.truthy(users.length === 5);
});

// test('example #3', async t => {
//   let users = await User.findWithOrango(db);
//   console.log("#3", users)
//   t.truthy(users.length === 5);
// });
