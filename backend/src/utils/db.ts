// eslint-disable-next-line @typescript-eslint/no-var-requires
const { query } = require('/opt/nodejs/node_modules/sql-layer');

export const sendQuery = async (sql: string, set?) => {
  return query(sql, set)
    .then((results) => ({
      statusCode: 201,
      body: results,
    }))
    .catch((error) => ({
      statusCode: error.statusCode,
      body: error.message,
    }));
};
