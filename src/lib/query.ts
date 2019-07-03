class Query {
  collection: string;
  command: string
  docName: string
}

export class QueryBuilder {
  query: Query;
  on: any;

  constructor(collectionName: string) {
    this.query = new Query();
    this.query.collection = collectionName;
  }

  collection(name: string): QueryBuilder {
    this.query.collection = name;
    return this;
  }

  find(docName: string = 'doc'): QueryBuilder {
    this.query.command = "find"
    this.query.docName = docName
    return this;
  }

  count(docName: string = ''): QueryBuilder {
    console.log(docName);
    return this;
  }

  insert(data: any): QueryBuilder {
    console.log(data);
    return this;
  }

  remove(docName: string = ''): QueryBuilder {
    console.log(docName);
    return this;
  }

  one(): QueryBuilder {
    return this;
  }

  where(filters: any): QueryBuilder {
    console.log(filters);
    return this;
  }

  skip(value: Number): QueryBuilder {
    console.log(value);
    return this;
  }

  limit(value: Number): QueryBuilder {
    console.log(value);
    return this;
  }

  sort(sorts: string): QueryBuilder {
    console.log(sorts);
    return this;
  }

  set(key: string, value: any): QueryBuilder {
    console.log(key, value);
    return this;
  }

  return(): QueryBuilder {
    console.log(name);
    return this;
  }

  many(): string {
    let q = `FOR ${this.query.docName} IN ${this.query.collection}`;
    if(this.query.command === 'find') {
      q = `${q} RETURN ${this.query.docName}`
    }
    return q
  }
}
