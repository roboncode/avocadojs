module.exports = async ({ orango }) => {
  const Identity = orango.model('Identity')
  console.log(`✅  Populated "${Identity.collectionName}" collection`.green)

  await Identity.import([
    {
      _key: '1',
      user: 'eddie',
      provider: 'orango',
      identifier: 'eddie@vanhalen.com',
      passwordHash: 'abcdefg12345678',
      connection: 'Username-Password-Authentication',
      isSocial: false,
      verified: false
    }
  ]).withDefaults()
}
