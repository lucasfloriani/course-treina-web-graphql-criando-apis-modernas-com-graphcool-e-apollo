// Usado para limitar requisições ao banco de dados
// que buscam a mesma informação na mesma requisição (SQL)
// como dados relacionados de herança (Joins).
const DataLoader = require('dataloader');

async function batchUsers(Users, keys) {
  return await Users.find({_id: {$in: keys}}).toArray();
}

module.exports = ({Users}) => ({
  userLoader: new DataLoader(
    keys => batchUsers(Users, keys),
    { cacheKeyFn: key => key.toString() }
  )
})