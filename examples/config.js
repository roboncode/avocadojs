module.exports = {
  db: 'examples',
  default: {
    url: 'http://localhost:15100',
    // Orango supports passing in ArangoDB JS driver options
    isAbsolute: false,
    loadBalancingStrategy: 'NONE',
    maxRetries: 3,
  },
  auth: {
    username: 'root',
    password: 'orango',
    url: 'http://localhost:15101',
    // Orango supports passing in ArangoDB JS driver options
    isAbsolute: false,
    loadBalancingStrategy: 'NONE',
    maxRetries: 3,
  }
}