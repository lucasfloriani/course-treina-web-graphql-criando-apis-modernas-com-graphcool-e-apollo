import Vue from 'vue/dist/vue';

import VueApollo from 'vue-apollo';
import { ApolloClient, HttpLink, InMemoryCache } from 'apollo-client-preset';

import { split } from 'apollo-link';
import { WebSocketLink} from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

import Operations from './Operations';

var httpLink = new HttpLink({uri: 'https://api.graph.cool/simple/v1/cjjyplx1d2f3j0148betz1vww'});

var wsLink = new WebSocketLink({
	uri: 'wss://subscriptions.graph.cool/v1/cjjyplx1d2f3j0148betz1vww',
	options: {
		reconnect: true
	}
})

var link = split(
	({query}) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === 'OperationDefinition' && operation === 'subscription'
	},
	wsLink,
	httpLink
)

const apolloClient =  new ApolloClient({
	link,
	cache: new InMemoryCache(),
	connectToDevTools: true
});

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
	defaultClient: apolloClient
})

new Vue({
	el: '#app',
	apolloProvider,
	data: {
		allPosts: [],
		newTitle: ''
	},
	methods: {
		create: function() {
			const title = this.newTitle;
			this.newTitle = '';
			if(title) {
				this.$apollo.mutate({
					mutation: Operations.Post.create,
					variables: {
						titulo: title,
						autorId: 'cjjyps7l50pso0163blae7jf9'
					},
					// // Usado o update para atualizar o data allPosts, pois
					// // o Apollo acaba deixando o campo como somente leitura, necessitando
					// // assim este método para atualizar os dados.
					// update: (store, { data: { createPost }}) => {
					// 	// Pega em cache a requisição
					// 	var data = store.readQuery({query: Operations.Post.all})
					// 	data.allPosts.push(createPost);
					// 	store.writeQuery({query: Operations.Post.all, data})
					// }
				})
			}
		},
		edit: function(post) {
			var newTitle = window.prompt('Update Post', post.titulo)
			if(newTitle) {
				var newPost = Object.assign({}, post, {titulo: newTitle});
				this.update(newPost);
			}
		},
		update: function(post) {
			this.$apollo.mutate({
				mutation: Operations.Post.update,
				variables: {
					titulo: post.titulo,
					id: post.id
				}
			})
		},
		remove: function(post) {
			this.$apollo.mutate({
				mutation: Operations.Post.remove,
				variables: {
					id: post.id
				},
				// update: (store, { data: { deletePost }}) => {
				// 	// Pega em cache a requisição
				// 	var data = store.readQuery({query: Operations.Post.all})

				// 	var item = data.allPosts.find(item => item.id === deletePost.id)
				// 	var itemIndex = data.allPosts.indexOf(item);
				// 	data.allPosts.splice(itemIndex, 1);

				// 	store.writeQuery({query: Operations.Post.all, data})
				// }
			})
		}
	},

	apollo: {
		allPosts: {
			query: Operations.Post.all,
			// Aqui é que deve ser alterado valores
			subscribeToMore: {
				document: Operations.Post.subscription,
				updateQuery: (prev, { subscriptionData }) => {
					if(subscriptionData.data.Post.mutation === 'CREATED') {
						return {
							allPosts: [...prev.allPosts, subscriptionData.data.Post.node]
						}
					} else if(subscriptionData.data.Post.mutation === 'DELETED') {
						var item = prev.allPosts.find(item => item.id === subscriptionData.data.Post.previousValues.id);
						var itemIndex = prev.allPosts.indexOf(item);
						// Para não alterar a lista diretamente, algo que não pode ser realizado
						var newPostsList =  [...prev.allPosts];
						newPostsList.splice(itemIndex, 1);
						return {
							allPosts: newPostsList
						}
					} // Update já faz automaticamente
				}
			}
		},
		// $subscribe é usado para receber as notificações de alterações
		// e não para alterar valores
		$subscribe: {
			postAdded: {
				query: Operations.Post.subscription,
				result: function(response) {
					console.log(response);
				}
			}
		}
	}
})