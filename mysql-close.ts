import {mysqlClient} from './mysql-connect.ts';

const closeMysqlConnection = async ()=> {
  console.warn('start to close mysql connection');
  await mysqlClient.close();
  console.warn('success to close mysql connection');
}

export {
  closeMysqlConnection,
  
}