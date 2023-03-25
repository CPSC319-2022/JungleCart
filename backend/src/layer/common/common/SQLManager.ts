import * as mysql from "/opt/nodejs/node_modules/mysql";
import NetworkError from "/opt/common/network-error";

export interface ConnectionParameters {
    hostname: string;
    user: string;
    password: string;
    port: number;
    database?: string;
}

export class SQLManagerClass {
    private pool: mysql.Pool | null;
    private defaultConnectionParameters: ConnectionParameters = {
        hostname: 'sqldb.cyg4txabxn5r.us-west-2.rds.amazonaws.com',
        user: 'admin',
        password: 'PeterSmith319',
        port: 3306,
        database: 'dev'
    };

    public createConnectionPool = (connectionParameters?: ConnectionParameters): void => {
        const {hostname, user, database, password, port} = connectionParameters ?? this.defaultConnectionParameters;

        if (!database) throw NetworkError.BAD_REQUEST;

        if (this.pool) this.pool.end();

        this.pool = mysql.createPool({
            host: hostname,
            user: user,
            database: database,
            password: password,
            port: Number(port),
            waitForConnections: true,
            connectionLimit: 60, // RDS max
            queueLimit: 0,
            debug: true,
        });
    };

    public query = async (query: string, set?: Array<any>): Promise<mysql.Query> => {
        const connection = await this.getConnection();

        const queryResults = await this.queryConnection(connection, query, set);

        connection.release();

        return queryResults;
    };

    private getConnection = (): Promise<mysql.Connection> => {
        return new Promise((resolve, reject) => {
            if (!this.pool) reject(NetworkError.FAILED_DEPENDENCY);

            this.pool.getConnection((error: mysql.MysqlError, connection: mysql.Connection) =>
                error ? reject(NetworkError.BAD_REQUEST) : resolve(connection)
            );
        });
    };

    private queryConnection = (connection: mysql.Connection, query: string, set?): Promise<mysql.Query> => {
        return new Promise((resolve, reject) => {
            connection.query(query, set, (error, results) =>
                error ? reject(NetworkError.BAD_REQUEST) : resolve(results)
            );
        });
    };
}

const SQLManager: SQLManagerClass = ((): SQLManagerClass => {
    const SQLManager = new SQLManagerClass();
    SQLManager.createConnectionPool();
    return SQLManager;
})();

export default SQLManager;