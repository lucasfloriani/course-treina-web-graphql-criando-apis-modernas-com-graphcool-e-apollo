const { ObjectId } = require('mongodb');
const pubsub = require('../pubsub');


function buildFilters({OR = [], titulo_contains}){
  const filter = titulo_contains ? {} : null;

  if(titulo_contains){
    filter.titulo = {$regex: `.*${titulo_contains}.*`}
  }
  let filters = filter ? [filter] : [];
  for(let i = 0; i < OR.length; i++) {
    filters = filters.concat(buildFilters(OR[i]))
  }

  return filters;
}

module.exports = {
  Query: {
    allPosts: async (root, {filter, first, skip}, {mongo: {Posts}}) => {
      let query = filter ? { $or: buildFilters(filter) } : {};
      const cursor = Posts.find(query);
      if(first) {
        cursor.limit(first);
      }
      if(skip) {
        cursor.skip(skip);
      }

      return await cursor.toArray();
    }
  },
  Mutation: {
    createPost: async (root, data, {mongo: {Posts}, user}) => {
      let newPost = Object.assign({autorId: user && user._id}, data);
      const response = await Posts.insert(newPost);
      newPost = Object.assign({id: response.insertedIds[0]}, newPost);

      pubsub.publish('Post', { Post: { mutation: 'CREATED', node: newPost}});
      return newPost;
    },
    updatePost: async (root, data, {mongo: {Posts}, user}) => {
      data._id = ObjectId(data.id);
      delete data.id;

      const {value} = await Posts.findAndModify({'_id': data._id}, [], {'$set': data}, {new: true});

      pubsub.publish('Post', { Post: { mutation: 'UPDATED', node: value}})
      return value;
    },
    deletePost: async (root, data, {mongo: {Posts}, user}) => {
      const id = ObjectId(data.id);
      const {value} = await Posts.findAndModify({'_id': id}, [], {}, {remove: true});

      pubsub.publish('Post', { Post: { mutation: 'DELETED', previousValues: value}})
      return value
    },
    createUser: async (root, data, {mongo: {Users}}) => {
      const newUser = {
        nome: data.nome,
        email: data.authProvider.email.email,
        password: data.authProvider.email.password
      }
      const response = await Users.insert(newUser);
      return Object.assign({id: response.insertedIds[0]}, newUser);
    },
    signinUser: async (root, data, {mongo: {Users}}) => {
      const user = await Users.findOne({email: data.email.email})
      if(data.email.password === user.password) {
        return { token: `token-${user.email}`, user }
      }
    }
  },
  Subscription: {
    Post: {
      subscribe: () => pubsub.asyncIterator('Post')
    }
  },
  Post: {
    id: root => root._id || root.id,
    autor: async ({autorId}, data, {dataloaders:{ userLoader }}) => {
      return await userLoader.load(autorId);
    }
  },
  User: {
    id: root => root._id || root.id
  }
}