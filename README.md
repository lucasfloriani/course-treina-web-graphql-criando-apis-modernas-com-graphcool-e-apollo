# GraphQL

É uma linguagem de consulta, assim como o SQL. Sua diferença é que o SQL é um padrão para bancos de dados, enquanto o GraphQL é um padrão para APIs.

Com o GraphQL podemos indicar ao servidor exatamente os campos que queremos em uma única requisição, até mesmo se os dados estiverem em lugares diferentes. Isso dá mais liberdade ao FrontEnd e poupa o BackEnd de ficar criando várias APIs.

## Origem

O GraphQL começou no Facebook. Eles começaram a usar em seus apps mobile em 2012. A primeira vez que o Facebook falou publicamente sobre o GraphQL foi na React.js Conf 2015, e depois anunciaram que o GraphQL teria seu código aberto.

## Por que usar?

Redução de quantidade de requisições e de dados trafegados principalmente para auxiliar dispositivos móveis.
Com o GraphQL podemos realizar queries diferentes para cada dispositivo, assim resultando nos dados realmente necessários, algo excelente para internets 3G ou 4G.

É muito comum tambem que, em sistemas maiores, os dados fiquem em diferentes bases de dados. Podemos, por exemplo, ter dados relacionais no MySQL, guardar certas informações em forma de documentos no MongoDB e ter pequenos dados para consultas rápidas no Redis.

É aqui que começamos a ver que teremos um bom trabalho: juntar dados de bancos diferentes e enviar uma estrutura diferente para cada tipo de aplicação.

![Normal APIs vs GraphQL APIs](imagens/graphql-diferenca.png)

Ao invés de ter que ficar criando uma API para cada estrutura diferente de dados e/ou ficar manualmente fazendo consultas para cada banco e depois juntar os dados, que tal simplesmente dizer a "alguém" o que você precisa? Apenas indique ao GraphQL o que você precisa e ele irá fazer todo o trabalho.

## Quem usa

Pode ser usado em qualquer lugar onde um cliente se comunica com uma API, seja web, desktop ou mobile.

* Coursera
* Facebook
* Github
* Meteor
* New York Times
* Pinterest
* Product Hunt
* Serverless
* Shopify
* Twitter
* Yelp

## FAQ

**Não gosto de ferramentas do Facebook**<br>
R: Existem ferramentas que realizam o mesmo que o GraphQL como o Falcor desenvolvida pela Netflix.

**Se eu for trabalhar com GraphQL, terei que usar React**<br>
R: Não

**A ideia do cliente dizer o que quer não me parece segura...**<br>
R: Fique tranquilo. O GraphQL tem uma coisa chamada resolvers. Com eles você pode cuidar da segurança de seus dados, permitindo ou não que determinado usuário acesse-os.

## Queries com GraphQL

### Criação do SDL (Schema Definition Language)

```node
type Pessoa{
  id: ID!
  nome: String!
  idade: Int!
  posts: [Post!]!
}

type Post{
  id: ID!
  titulo: String!
  autor: Pessoa!
}
```

* **type nomeDoTipo**:  Define um novo objeto que será utilizado;
* **! no final**: Define campo como obrigatório;
* **[nomeDoTipo]**: Define uma lista de nomeDoTipo;
* **[nomeDoTipo!]**: Evita que valores nulos seja adicionados a lista;
* **[nomeDoTipo!]!**: Evita que o campo venha nulo, resultando num array vazio.

### Query de consulta

```node
{
  allPessoas(first: 3){
    nome
    idade
    posts{
      titulo
    }
  }
}
```

* **Root Field**: Objetos principal da query de consulta;
* **Payloads**: São os campos do objeto;
* **all[nomeDoTipo]s**: Retorna todos os nomeDoTipo;
* **(first: 3)**: Parâmetros para query ao objeto adicionado, não precisam ser em ordem.

### Mutations

É utilizado para alteração de dados relacionados as ações CRUD, iniciando sempre com a palavra chave mutation.
Nas mutations são passados por parâmetros os valores a serem adicionados ao objeto (adicionados dentro dos parênteses), e quais dados serão retornados (dentro das chaves).

```node
mutation {
  createPessoa(idade: 25, nome: "Maria"){
    id
  }
}
```

### Subscription

Usado para receber alteração as informações que deseja observar, realizando assim uma conexão continua (tempo real) através de websockets, podendo observar todas as ações relacionadas ao CRUD. Por exemplo a subscription abaixo, onde a cada nova pessoa adicionada o GraphQL se encarregará de retornar o valor novo criado.

```node
subscription {
  newPessoa{
    id
    nome
    idade
  }
}
```

### Lado servidor

**Query serve como um contrato entre cliente e servidor, permitindo assim somente os campos que poderão ser consultados.**

```node
type Query{
  allPessoas(first: Int): [Pessoa!]!
}
```

**Query para mutations:**

```node
type Mutation{
  createPessoa(nome: String!, idade: Int!): Pessoa!
}
```

**Query para subscriptions:**

```node
type Subscription{
  newPessoa: Pessoa!
}
```

## O que é Graphcool

É um framework open-source que facilita o trabalho com GraphQL.

Podemos baixar o Graphcool e hospedá-lo em nosso próprio servidor ou tambem podemos aproveitar o serviço oferecido, que já disponibiliza uma plataforma completa com banco de dados.

Assim, ao criar uma aplicação, podemos focar inteiramente no Front End, pois o BackEnd com o Banco de Dados e APIs com GraphQL já estará pronto, sendo somente necessário criar o Schema.

### Como Instalar

```node
npm install -g graphcool
```

### Iniciando projeto com Graphcool

```node
graphcool-framework init
```

Caso ocorra algum erro, execute o comando abaixo:

```node
mkdit ~/.graphcool
```

### Realizando o deploy

```node
graphcool-framework deploy
```

### Abrir site para edição do graphql do seu projeto

```node
graphcool-framework playground
```

Caso queira resgatar as urls das apis, você poderá clicar no botão de endpoints dentro da página do playground.

### Exemplo de query por POST

```node
fetch('insira-sua-url-da-api-simples-aqui', {
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
    },
  body: `{"query": "{allPessoas{id nome}}"}`,
})
.then(response => response.json())
.then(data => console.log(data))
```

## Comandos GraphQL

### Campos

```node
{
  allPessoas{
    nome // Campo de Pessoa
    idade // Campo de Pessoa
    posts { // Campo de Pessoa
      titulo // Campo do Post
    }
  }
}
```

### Argumentos/Parâmetros

Exemplo com busca de uma pessoa especifica ao banco de dados, passando o seu id como parâmetro na query.
Adicionamos a query com Pessoa pois com o parâmetro id, a função retornará somente um objeto do tipo Pessoa.

```node
{
  Pessoa(id: "cjjyps7l50pso0163blae7jf9") {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

### Filtros

Para filtrar os dados antes de retorná-los com graphQL, podemos adicionar um parâmetro de objeto em nossa query, adicionando assim quais filtragens deverão ser realizadas em quais campos desejamos, como por exemplo:

```node
// Busca de nome igual "Maria"
{
  allPessoas(filter: {nome: "Maria"}) {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

Para realizarmos queries com "OR", fazemos a seguinte sintaxe:

```node
{
  allPessoas(filter: {
    OR: [
      {nome: "Maria"},
      {idade: 26}
    ]
  }) {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

Caso necessite que ambos os filtros sejam aceitos, podemos realizar a seguinte sintaxe alternativa:

```node
{
  allPessoas(filter: {
    AND: [
      {nome: "Maria"},
      {idade: 25}
    ]
  }) {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

Podemos fazer filtragem especificas em cada campo utilizando a seguinte sintaxe:

* **nome_in**: Todos os valores contidos em uma lista;
* **nome_lt**: Todos os valores menores;
* **nome_gt**: Todos os valores maiores;
* **nome_gte**: Todos os valores maiores ou iguais;
* **nome_lte**: Todos os valores menores ou iguais;
* **nome_not**: Todos os valores que não são iguais;
* **nome_not_in**: Todos os valores que não estão contidos em uma lista;
* **nome_contains**: Todos os valores que possuem a String passada;
* **nome_ends_with**: Todos os valores que terminam com a String passada;
* **nome_starts_with**: Todos os valores que começam com a String passada;
* **nome_not_contains**: Todos os valores que não possuem a String passada;
* **nome_not_ends_with**: Todos os valores que não terminam com a String passada;
* **nome_not_starts_with**: Todos os valores que não começam com a String passada;

### Ordenação

Pode-se ordernar o resultado tanto como ASC (campo_ASC) ou DESC (campo_DESC)

```node
{
  allPessoas(orderBy: nome_ASC) {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

### Paginação

Utiliza-se as keywords first e last para pegar os primeiros ou os ultimos dados presentes no banco de dados, seguidos com a quantidade de valores que será retornado:

```node
{
  allPessoas(first: 2) {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

Podemos tambem pular um certo id de um objeto, facilitando assim a realização da paginação, onde quando utilizamos first, podemos adicionar o after, e quando utilizamos o last, adicionamos o before:

```node
{
  allPessoas(first: 1, after: "cjjyps7l50pso0163blae7jf9") {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

```node
{
  allPessoas(last: 1, before: "cjjypstue0qav0128ofee40uc") {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

Além de utilizarmos o id do objeto para pularmos uma certa quantidade de elementos, podemos utilizar o skip para pular uma quantidade x de elementos, exemplo:

```node
{
  allPessoas(first: 1, skip: 1) {
    nome
    idade
    posts{
      titulo
    }
  }
}
```

OBS: Pode-se retornar 1000 nós por paginação.

### Aliases

Utilizado para renomear os campos, sendo um bom recurso para listar 2 listas de um objeto com filtros diferentes

```node
{
  allPessoas {
    identificador: id
    nome
    idade
    publicacoes: posts{
      titulo
    }
  }
}
```

```node
{
  meninas: allPessoas(filter: {
    nome: "Maria"
  }) {
    id
    nome
    idade
    posts{
      titulo
    }
  }
  meninos: allPessoas(filter: {
    nome: "Maria"
  }) {
    id
    nome
    idade
    posts{
      titulo
    }
  }
}
```

### Fragmentos

Fragmentos são usado para reutilização e organização de código, separando código repetido.

```node
{
  meninas: allPessoas(filter: {
    nome: "Maria"
  }) {
    ...meusCampos
  }
  meninos: allPessoas(filter: {
    nome: "Maria"
  }) {
    ...meusCampos
  }
}

fragment meusCampos on Pessoa{
  id
  nome
  idade
  posts{
    titulo
  }
}
```

### Nome das Operações

Nomes padrões utilizados antes do código graphql para indicar sua ação:

* **query**: Usado para realizar buscar com graphql, podendo ser omitida por ser a ação padrão;
* **mutations**: Usado para realizar ações CRUD;

Podemos tambem nomear as ações igual funções em outras linguagens, não mudando a resposta do servidor, porem deixa assim seu código mais organizado:

```node
query buscaPessoas{
  allPessoas{
    nome
    idade
  }
}
```

### Variáveis

Usado para substituir interpolação e concatenação de strings

```node
query buscaPessoas($nome: String = "Maria"){
  allPessoas(filter: {nome: $nome}){
    nome
    idade
  }
}
```

```node
// Valor adicionado a variável
{
  "nome": "João"
}
```

### Diretivas

Keywords utilizadas para deixar a query mais dinâmica.
Diretivas contem o prefixo "@", como no exemplo abaixo utilizando a diretiva "@skip", onde ele verifica se vai ignorar um campo ou não.

```node
query buscaPessoas($semIdade: Boolean!){
  allPessoas{
    nome
    idade @skip(if: $semIdade)
  }
}
```

```node
// @skip
// 'true' = sem campo idade
// 'false' = com campo idade
{
  "semIdade": true
}
```

Outra diretiva é a @include, que utiliza o campo na query se for 'true':

```node
query buscaPessoas($comIdade: Boolean!){
  allPessoas{
    nome
    idade @include(if: $comIdade)
  }
}
```

```node
// @include
// 'true' = com campo idade
// 'false' = sem campo idade
{
  "comIdade": true
}
```

### Mutation em Relações

Seguindo o exemplo de relacionamento entre Pessoa e Post onde temos uma relação 1-N, quando realizamos uma mutation que irá inserir um post existente em uma Pessoa executamos o seguinte código:

```node
mutation ($pessoaId: ID!, $postId: ID!){
  addToPessoaPosts(
    postsPostId: $postId,
    autorPessoaId: $pessoaId
  ){
    autorPessoa{
      nome
      posts{
        titulo
      }
    }
  }
}
```

Os nomes das funções variam de acordo com a relação:

| Tipo de Relação | Adicionar | Remover |
| --- | --- | --- |
| 1-1 | setPessoaPosts | unsetPessoaPosts |
| 1-N | addToPessoaPosts | removeFromPessoaPosts |
| N-N | addToPessoaPosts | removeFromPessoaPosts |

OBS: O nome que aparece após "set", "unset", "addTo" e "removeFrom" é o nome que escolhemos no momento em que criamos a relação lá no Schema.

### CRUD Mutations

Criação de uma Pessoa:

```node
mutation criarPessoa($nome: String!, $idade: Int!) {
  createPessoa(nome: $nome, idade: $idade){
    id
  }
}
```

```node
// Dados passados a mutation criarPessoa
{
  "nome": "Caroline",
  "idade": 23
}
```

Alteração de uma Pessoa:

```node
mutation updatePessoa($id: ID!, $nome: String) {
  updatePessoa(id: $id, nome: $nome){
    id
    nome
    idade
  }
}
```

```node
// Dados passados a mutation updatePessoa
{
  "id": "cjjzq8lal1fnu0171fo9fa70a",
  "nome": "Carol"
}
```

Remover uma Pessoa:

```node
mutation removerPessoa($id: ID!) {
  deletePessoa(id: $id){
    id
    nome
    idade
  }
}
```

```node
// Dados passados a mutation removerPessoa
{
  "id": "cjjzq8lal1fnu0171fo9fa70a"
}
```

### Meta Fields

Usado para verificar dados sobre determinado campo.
O campo "__typename" irá retornar "Pessoa", nos permitindo saber que o nome do tipo do dado que recebemos é "Pessoa".

```node
{
  allPessoas{
    __typename
    nome
    idade
  }
}
```

```node
// Retorno
{
  "data": {
    "allPessoas": [
      {
        "__typename": "Pessoa",
        "nome": "Maria",
        "idade": 25
      },
      {
        "__typename": "Pessoa",
        "nome": "João",
        "idade": 26
      }
    ]
  }
}
```

Caso seja preciso mais dados, podemos utilizar a seguinte sintaxe:

```node
{
  __type(name: "Pessoa") {
    name
    kind
  }
}
```

```node
// Retorno
{
  "data": {
    "__type": {
      "name": "Pessoa",
      "kind": "OBJECT"
    }
  }
}
```
