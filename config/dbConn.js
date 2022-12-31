const dbCofig = require('./db');

const dbConn = require('knex')(
    {
      client: dbCofig.client,
      version: dbCofig.version,
      connection: {
        host : dbCofig.connection.host,
        port : dbCofig.connection.port,
        user : dbCofig.connection.user,
        password : dbCofig.connection.password,
        database : dbCofig.connection.database,
    }
  }
);

module.exports = dbConn;