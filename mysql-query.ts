import {mysqlClient} from './mysql-connect.ts';

const queryMysqlResults = async (querySql: string)=>{
  console.warn('start to query mysql tables');
  const results = await mysqlClient.query(querySql);
  console.log('results are ', results);
  return results;
}

export {
  queryMysqlResults,

}