module.exports = {
  db: 'examples',
  noauth: {
    url: 'http://localhost:15100',
    // Orango supports passing in ArangoDB JS driver options
    isAbsolute: false,
    loadBalancingStrategy: 'NONE',
    maxRetries: 3,
  },
  credentials: {
    username: 'root',
    password: 'orango',
    url: 'http://localhost:15101',
    // Orango supports passing in ArangoDB JS driver options
    isAbsolute: false,
    loadBalancingStrategy: 'NONE',
    maxRetries: 3,
  }
}