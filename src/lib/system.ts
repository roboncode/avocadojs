import { Database } from "arangojs";

export class System extends Database {
  async createDatabase(name: String): Promise<boolean> {
    console.log(name);
    return true;
  }

  async dropDatabase(name: String): Promise<boolean> {
    console.log(name);
    return true;
  }
}
