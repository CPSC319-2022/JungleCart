import SQLManager from "/opt/common/SQLManager";

export default class Model {
    constructor() {
        SQLManager.createConnectionPool();
    }
    create?(info);

    read?(info);

    update?(info);

    delete?(info);

    protected query = SQLManager.query;
}
