import {Client} from "https://deno.land/x/mysql/mod.ts";

const mysqlConnectInfo = {
  hostname: '127.0.0.1',
  port: 3303,
  username: 'root',
  db: 'java_example_for_caas', // tables: websites
  password: '1q2w3e4r',
};
console.warn('start to connect to mysql with below information');
console.error(mysqlConnectInfo);
const mysqlClient = await new Client().connect(mysqlConnectInfo);
console.error('success to connect to mysql');
export {
  mysqlClient,

}

