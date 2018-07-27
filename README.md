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

## Schema e Tipos

O GraphQL foi projetado para se trabalhar com qualquer linguagem de programação. Por isso que ao invés de seguir a sintaxe de uma linguagem especifica, foi criada uma linguagem própria, o GSL (GraphQL Schema Language). Ela é bem parecida com a sintaxe que usamos para escrever as consultas.

```node
type Pessoa{
   nome: String!
   idade: Int!
   posts: [Post]!
}
```

Ela é tão parecida com a própria sintaxe da consulta que no começo é comum se confundir. Mas isso é proposital para que a gente não tenha que aprender sintaxes diferentes para mexer com a mesma ferramenta, acelerando o processo de aprendizado.

* Primeiro declaramos que estamos criando um tipo com "type";
* **Pessoa** indica o tipo do objeto que estamos criando. Em uma linguagem de programação seria como criar uma "classe";
* **nome, idade e posts** são os nomes dos campos de "Pessoa", indicando que podemos pedir por estes campos quando fizermos uma consulta que envolva "Pessoa";
* **String e Int** estão indicando o tipo do dado. O tipo do dado é indicado após ":";
* **"!"** indica que esse campo é obrigatório. Nesse exemplo estamos dizendo que não pode haver uma "Pessoa" sem os dados de "nome" e "idade" em nosso banco. Então ao inserir uma nova Pessoa, esses dados não podem faltar. Ao fazer a consulta podemos ignorar esses campos caso a gente não queira que eles retornem;
* **"[]"** indica que esse campo é uma lista. No nosso exemplo estamos indicando que o campo "posts" é uma lista do tipo "Post", que é um outro objeto. Já que no nosso exemplo indicamos que é um campo obrigatório, caso não haja dados teremos um Array vazio como retorno ao invés do valor "null".

### Argumentos

Cada campo que declaramos em um objeto pode receber zero ou mais argumentos (ou parâmetros), os quais indicam mais algumas informações sobre o dado.

```node
type Pessoa{
   id: ID!
   nome: String!
   altura(unit: LengthUnit = METER): Float
}
```

Veja que declaramos a unidade do campo "altura" com um valor padrão "METER". Imagine que temos então o dado de "altura" em metros, mas nossa API será acessada em lugares onde medimos a altura em "pés". Ao invés de cada cliente fazer a conversão, podemos simplesmente indicar à query que queremos o dado em pés, e já receberemos o valor no formato requisitado.

Diferente de parâmetros que passamos em funções, que é importante saber a ordem, no GraphQL podemos colocar em qualquer oderm, já que nós sempre indicamos o nome do parâmetro que estamos passando.

O GraphQL já vem com alguns tipos definidos, mas também podemos declarar os nossos próprios.

### Scalar Types

São campos com tipo fixo e que não possuem outros campos, como por exemplo o campo "nome" que retorna uma String, diferente do campo "posts" que contem outros campos dentro dele.

São scalar types os:

* **Int** - Números inteiros de 32-bits com sinal;
* **Float** - Números flutuantes de dupla precisão com sinal;
* **String** - Sequência de caracteres UTF-8;
* **Boolean** - true ou false;
* **ID** - Identificador única usado como chave para retornar objetos.

Na maioria das implementações do GraphQL é possível especificar novos Scalar Types. Imagine um campo do tipo "Date". Podemos definir como o dado será serializado e deserializado. Ou seja, podemos armazenas a data em um Timestamp mas ao retornar ao usuário, enviaremos sempre a data de modo legível no formato "YYYY/MM/DD".

### Enumeration Types

Famosos Enums, são um tipo especial de Scalar Types, os quais são restritos a um grupo de valores em particular.

Podemos criar um enum para ajudar a criar uma inscrição, onde somente os valores "CREATED", "UPDATED" e "DELETED" são usados, assim garantindo que nenhum outro valor seja utilizado.

```node
enum MutationType {
  CREATED
  UPDATED
  DELETED
}
```

### Listas e Null

#### 1ª Possibilidade: [ Post ]!

```node
type Pessoa{
  posts: [ Post ]!
}
```

Veja que o "!" só está com o "[]". Isso indica que o campo "post" (a própria lista) não pode ser nulo. Caso não haja dados, pelo menos um Array vazio será retornado.

```node
posts: null // inválido
posts: []    // válido
posts: [ {titulo: "Treinaweb"}, {titulo: "GraphQL"} ] // válido
posts: [ {titulo: "Treinaweb"}, null ] // válido
```

#### 2ª Possibilidade: [ Post! ]

Veja que o "!" está apenas com o "Post". Isso indica que o próprio Post não pode ser nulo, mas a lista (campo "posts") sim.

```node
posts: null // válido
posts: []    // válido
posts: [ {titulo: "Treinaweb"}, {titulo: "GraphQL"} ] // válido
posts: [ {titulo: "Treinaweb"}, null ] // inválido
```

#### 3ª Possibilidade: [ Post! ]!

Veja que o "!" está com o "Post" e com o "[]". Isso indica que o próprio Post não pode ser nulo e se não tiver dados, será retornada uma lista vazia.

```node
posts: null // inválido
posts: []    // válido
posts: [ {titulo: "Treinaweb"}, {titulo: "GraphQL"} ] // válido
posts: [ {titulo: "Treinaweb"}, null ] // inválido
```

#### 4ª Possibilidade: [ Post ]

Não há "!". Qualquer campo pode vir nulo.

```node
posts: null // válido
posts: []    // válido
posts: [ {titulo: "Treinaweb"}, {titulo: "GraphQL"} ] // válido
posts: [ {titulo: "Treinaweb"}, null ] // válido
```

### Interfaces

Interface é um tipo abstrato que possui um grupo de campos. Se criarmos um tipo que implemente determinada interface, esse tipo deverá possuir os tipos definidos na interface.

Interfaces são úteis quando nós queremos retornar um objeto ou um grupo deles, mas estes talvez serão de vários tipos diferentes, por exemplo:

```node
// Query
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    primaryFunction
  }
}
```

```node
// Variáveis
{
  "ep": "JEDI"
}
```

```node
// Retorno
{
  "errors": [
    {
      "message": "Cannot query field \"primaryFunction\" on type \"Character\". Did you mean to use an inline fragment on \"Droid\"?",
      "locations": [
        {
          "line": 4,
          "column": 5
        }
      ]
    }
  ]
}
```

O campo hero retorna um tipo Character, isso significa que ele talvez seja um Human ou um Droid dependendo do episódio no argumento.
Na query acima, você pode somente perguntar por campos que existem na interface do Character, o qual não inclue primaryFunction.

Para receber um campo de um tipo de objeto especifico, você precisa usar um inline fragment:

### Inline Fragments

Quando vimos como criar consultas, vimos também sobre "Fragmentos", que nos permitem indicar um grupo de campos e chamar esse grupo depois para fazer consulta.

Quando temos "Interfaces" ou "Union Types", podemos indicar fragmentos sem declará-los. Esses são os "Inline Fragments".

Eles são muito úteis quando queremos buscar um ou mais dados e o tipo retornado pode ter campos específicos de cada tipo de dado.

```node
// Query
query HeroForEpisode($ep: Episode!) {
  hero(episode: $ep) {
    name
    ... on Droid {
      primaryFunction
    }
  }
}
```

```node
// Variáveis
{
  "ep": "JEDI"
}
```

```node
// Retorno
{
  "data": {
    "hero": {
      "name": "R2-D2",
      "primaryFunction": "Astromech"
    }
  }
}
```

Fragmentos nomeados tambem podem ser usados do mesmo modo, sendo que fragmentos nomeados sempre tem um tipo atrelado a ele.

### Union Types

São parecidos com as Interfaces, mas não precisam especificar os campos em comum entre os tipos

```node
union Resulta = Adulto | Crianca
```

Quando retornarmos "Resultado", poderemos ter um "Adulto" ou uma "Criança".

É importante lembrar que em tipos "Union", os tipos passados precisam ser concretos, ou seja, não são aceitas Interfaces ou outros Union Types.

Neste caso, se você buscar um campo que retorne o union type "Resultado", você precisa usar o fragmento inline para conseguir pegar qualquer um de seus campos.

```node
{
  allResultados{
    … on Adulto {
      empresa
    }
    … on Crianca {
      escola
    }
  }
}
```

// Para terminar o union types

### Meta Fields

Dado que podemos ter algumas situações onde nós não sabemos qual tipo está sendo retornado em um serviço GraphQL, nós precisamos algum modo de determinar como lidar com os dados no frontend. O Graphql permite solicitar no request __typename, um meta campo, em qualquer ponto da query para pegar o nome do tipo do objeto.

```node
// Query
{
  search(text: "an") {
    __typename
    ... on Human {
      name
    }
    ... on Droid {
      name
    }
    ... on Starship {
      name
    }
  }
}
```

```node
// Retorno
{
  "data": {
    "search": [
      {
        "__typename": "Human",
        "name": "Han Solo"
      },
      {
        "__typename": "Human",
        "name": "Leia Organa"
      },
      {
        "__typename": "Starship",
        "name": "TIE Advanced x1"
      }
    ]
  }
}
```

Na query acima, a busca nos retornou o Union Type que pode ser uma das três opções. Isso seria impossivel de dizer qual seria a diferença entre os tipos no frontend sem o campo __typename.

Serviços GraphQL provem alguns outros meta fields, sendo possivel encontrá-los na sua documentação.

### Input Types

São utilizados quando precisamos de campos mais complexos. Aí que entram os tipos "Input". São muito úteis quando trabalhamos com Mutations.

Para declará-los, fazemos da mesma forma ao declarar um tipo, mas usamos a palavra-chave "input".

```node
input DocumentosInput{
  rg: String
  cpf: String
}
```

Poderíamos ter um Mutation para criar uma Pessoa com Documentos assim:

```node
mutation CreatePessoa($nome: String!, $idade: Int!, $documentos: DocumentosInput!){
  createPessoa(nome: $nome, idade: $idade, documentos: $documentos) {
    id
  }
}
```

E as variáveis serem passadas assim:

```node
{
  nome: "Maria"
  idade: 25
  documentos: {
    rg: "11111111111",
    cpf: "222.222.222-22"
  }
}
```

Veja que ao criar o Mutation, a passagem do campo "documentos" ficou bem simples.

Podemos ver os Inputs como declaração do tipo de um campo, e que não terá todas as funcionalidades que vimos que os Types possuem, como por exemplo argumentos em sua declaração.

## Bibliotecas para GraphQL

### Frontend

Há duas principais bibliotecas para o lado do Cliente quando se trabalha com GraphQL: Apollo Client e Relay.

#### Relay

O Relay é desenvolvido pelo Facebook, que também criou o React e o GraphQL. Ele possui várias otimizações para performance, mas só trabalha com React e apenas está disponível para desenvolvimento web.

#### Apollo

O Apollo é um cliente que visa ser poderoso e flexível. Ele dá suporte ás maiores plataformas de desenvolviment, tanto web quanto mobile, como:

* Android Nativo;
* iOS Nativo;
* Vue.js;
* Angular;
* React;
* React Native;
* Meteor;
