import { ArrayCursor } from 'arangojs/lib/cjs/cursor';
import { unmarshal } from './json';

export async function unmarshalCursor(cursor: ArrayCursor, v:any = null): Promise<any[]> {
  let list = []
  while (cursor.hasNext()) {
    const result = await cursor.next();
    if (v) {
      let classInst = new v();
      let err = unmarshal(result, classInst);
      if (err) {
        throw err;
      }
      list.push(classInst);
    } else {
      list.push(result);
    }
  }
  return list;
}
