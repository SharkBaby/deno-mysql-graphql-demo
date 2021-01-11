
// deno run --allow-net  deno-graphql.ts
// Server start at http://localhost:8080
// deno 1.2.x required oak version up to v6.0.1
import { Application, Router } from "https://deno.land/x/oak@v6.0.1/mod.ts";
import { applyGraphQL, gql } from "https://deno.land/x/oak_graphql/mod.ts";

// connect mysql database
import { queryMysqlResults } from './mysql-query.ts';
import { closeMysqlConnection } from './mysql-close.ts';

// query mysql results
console.warn('111');
const querySql = 'select * from websites;';
const mysqlResults = await queryMysqlResults(querySql);
console.warn('222');
// close mysql connection
closeMysqlConnection();

const app = new Application();

const types = gql`
type Player {
  firstName: String
  midName: String
  lastName: String
  id: Int
  name: String
  url: String
  alexa: Int
  country: String
}

type Query {
  getPlayers: [Player] 
}
type Mutation{
  setPlayer(firstName: String,lastName: String, midName: String): Player
}
`;

let players = [
  {
    firstName: "Nelson",
    midName: "players midName 1",
    lastName: "Hernandez"
  },
  {
    firstName: "Jhon",
    midName: "players midName 2",
    lastName: "Gomez"
  },
]
players = players.concat(mysqlResults);

const resolvers = {
  Query: {
    getPlayers: () => {
      return players
    },
  },
  Mutation: {
    setPlayer(_: void, args: void) {
      console.log(args);
      return args
    }
  }
};

const GraphQLService = await applyGraphQL<Router>({
  Router,
  typeDefs: types,
  resolvers: resolvers,
});

app.use(GraphQLService.routes(), GraphQLService.allowedMethods());

console.log("Server start at http://localhost:8080");
await app.listen({ port: 8080 });
