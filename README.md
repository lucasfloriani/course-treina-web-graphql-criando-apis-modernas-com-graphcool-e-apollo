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

Não gosto de ferramentas do Facebook?
R: Existem ferramentas que realizam o mesmo que o GraphQL como o Falcor desenvolvida pela Netflix.

Se eu for trabalhar com GraphQL, terei que usar React?
R: Não

A ideia do cliente dizer o que quer não me parece segura...
R: Fique tranquilo. O GraphQL tem uma coisa chamada resolvers. Com eles você pode cuidar da segurança de seus dados, permitindo ou não que determinado usuário acesse-os.
