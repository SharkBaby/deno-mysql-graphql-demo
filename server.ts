// 本项目是参考该篇文章 https://www.ronnieho.dev/blog/deno/deno-graphql-server/,做了如下增强
/**
 * 1. 可以连接mysql 数据库
 * 2. 确保可以返回graphql数据
 */
// deno run --allow-net --allow-read server.ts
// GET: http://localhost:7777/graphql
// GET: http://localhost:7777/index.html - it is access vue3 page under static folder
/**
{
  books {
    id
    title
    author
    country
    alexa
    url
    __typename
  }
}
 */
import { Application, Router } from 'https://deno.land/x/oak@v6.0.1/mod.ts';
import { buildSchema, graphql } from 'https://cdn.pika.dev/graphql@^15.0.0';
import {
  bold,
  cyan,
  green,
  red,
  yellow,
} from "https://deno.land/std@0.82.0/fmt/colors.ts";
import { queryMysqlResults } from './mysql-query.ts';
import { closeMysqlConnection } from './mysql-close.ts';

// query mysql results
console.warn('111');
const querySql = 'select * from websites;';
const results = await queryMysqlResults(querySql);
console.warn('222');
closeMysqlConnection();
console.warn('333');
// close mysql connection

const schema = buildSchema(`
  type Book {
    id: Int
    name: String
    url: String
    alexa: Int
    country: String
    title: String
    author: String
  }
  type Query {
    books: [Book]
    hello: String
  }
`);

const books = [
  {
    id: 1,
    title: 'Dune',
    author: 'Frank Herbert'
  },
  {
    id: 2,
    title: '1984',
    author: 'George Orwell'
  }
].concat(results);

const resolvers = {
  books: () => {
    return books;
  },
  hello: () => 'World by Perry'
}

const app = new Application();
const port = 7777;

const graphiqlHTML = `<html>
<head>
  <title>Simple GraphiQL Example</title>
  <link href="https://unpkg.com/graphiql/graphiql.min.css" rel="stylesheet" />
</head>
<body style="margin: 0;">
  <div id="graphiql" style="height: 100vh;"></div>
  <script crossorigin src="https://unpkg.com/react/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom/umd/react-dom.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/graphiql/graphiql.min.js"></script>
  <script>
    const graphQLFetcher = graphQLParams =>
      fetch('http://localhost:${port}/graphql', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(graphQLParams),
      })
        .then(response => response.json())
        .catch(() => response.text());
    ReactDOM.render(
      React.createElement(GraphiQL, { fetcher: graphQLFetcher }),
      document.getElementById('graphiql'),
    );
  </script>
</body>
</html>`

const router = new Router();
router
  // .all('*', async (ctx, next) => {
  //   // ctx.response.headers.set('Access-Control-Allow-Origin', '*');
  //   // ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , myheader');
  //   // ctx.response.headers.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  //   await next();
  // })
  .get("/", (context) => {
    context.response.body = "Hello world!";
  })
  .get('/graphql', context => {
    context.response.body = graphiqlHTML;
  })
  .post('/graphql', async context => {
    const requestBody = await context.request.body();
    const valueResult = await requestBody.value;
    let query = '';
    if (valueResult.query) query = valueResult.query;

    graphql(schema, query, resolvers).then((response => {
      context.response.headers.set('Access-Control-Allow-Origin', '*');
      context.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , myheader');
      context.response.headers.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
      context.response.body = response;
    }))
  })
  .options('/graphql', async (ctx, next) => {
    ctx.response.headers.set('Access-Control-Allow-Origin', '*');
    ctx.response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , myheader');
    ctx.response.headers.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    // await next();
    ctx.response.status = 200;
    return;
  });

app.use(router.routes());
app.use(router.allowedMethods());
app.use(async (context) => {
  await context.send({
    root: `${Deno.cwd()}/static`,
    index: "index.html",
  });
});
console.log(`GraphQL Server running on http://localhost:${port}/graphql`);
app.addEventListener("listen", ({ hostname, port }) => {
  console.log(
    bold("Start listening on ") + yellow(`${hostname}:${port}`),
  );
});
await app.listen({ port });