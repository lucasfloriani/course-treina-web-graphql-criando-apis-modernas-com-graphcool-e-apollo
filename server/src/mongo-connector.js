const { Logger, MongoClient } = require('mongodb');

const MONGO_URL = 'mongodb://localhost:27017/';
const DB_NAME = 'tw_posts';

module.exports = async () => {
  const connection = await MongoClient.connect(MONGO_URL);
  var db = connection.db(DB_NAME);

  let logCount = 0;
  Logger.setCurrentLogger((msg, state) => {
    console.log(`MONGODB REQUEST ${++logCount}: ${msg}`)
  })
  Logger.setLevel('debug');
  Logger.filter('class', ['Cursor']);

  return {
    Posts: db.collection('posts'),
    Users: db.collection('users')
  }
}
