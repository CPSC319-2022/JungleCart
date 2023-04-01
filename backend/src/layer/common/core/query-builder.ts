import NetworkError from './NetworkError';

class QueryBuilder {
  public selectBuilder = (
    inquiryColumn: string[],
    table: string,
    inquiryOpt: { [key in string]: number | string | Date } = {},
    optCondition = ''
  ) => {
    const query =
      `SELECT ${this.buildSqlParamsForSelect(inquiryColumn)}\nFROM ${table}` +
      `${this.buildInquiryOpt(inquiryOpt, optCondition)}` +
      `;`;
    console.log('query: ', query);
    return query;
  };

  public insertBuilder = (
    data: { [key in string]: number | string | Date | boolean | null },
    table: string
  ) => {
    const query = `
      INSERT INTO ${table} (
        ${this.buildSqlParamsForInsert(data)}
      );
    `;
    return query;
  };

  public updateBuilder = (
    inquiryId: number,
    data: { [key in string]: number | string | Date | null | undefined },
    table: string
  ) => {
    const query = `
      UPDATE ${table} SET ${this.buildSqlParamsForUpdate(
      data
    )} WHERE id = ${inquiryId};`;
    return query;
  };

  public updateBetweenBuilder = (
    inquiryId: number,
    data: { [key in string]: number | string | Date },
    table: string
  ) => {
    const query = `
      UPDATE ${table} SET ${this.buildSqlParamsForUpdate(data)} 
      WHERE id = ${inquiryId}
      AND
      WHERE id BETWEEN 
    ;`;
    return query;
  };

  public deleteBuilder = (
    data: { [key in string]: number | string | Date },
    table: string,
    condition?: string | null
  ) => {
    const query = `
      DELETE FROM ${table} WHERE ${this.buildSqlParamsForDelete(
      data,
      condition
    )};
    `;
    return query;
  };

  private camelToUnderscore = (key: string) => {
    return key.replace(/([A-Z])/g, '_$1').toLowerCase();
  };

  private convertObjKeysToSnakeCase = (obj: {
    [key in string]: number | string | Date | boolean | null | undefined;
  }) => {
    const newObj: {
      [key in string]: number | string | Date | boolean | null | undefined;
    } = {};
    for (const camel in obj) {
      if (obj[camel] !== undefined) {
        newObj[this.camelToUnderscore(camel)] = obj[camel];
      }
    }
    return newObj;
  };

  private buildSqlParamsForSelect = (inquiryColumn: string[]) => {
    if (inquiryColumn[0] === 'all') {
      return '*';
    }
    return inquiryColumn.join(`,`);
  };

  private buildSqlParamsForInsert = (obj: {
    [key in string]: number | string | Date | boolean | null;
  }) => {
    const convertedObj = this.convertObjKeysToSnakeCase(obj);
    const setParams: Array<string> = [];
    const setValues: Array<string> = [];
    const entries = Object.entries(convertedObj);
    entries.forEach((entry) => {
      setParams.push(`${entry[0]}`);
    });
    entries.forEach((entry) => {
      setValues.push(`"${entry[1]}"`);
    });
    setParams.join(`,`);
    setValues.join(`,`);
    return setParams + ') VALUES (' + setValues;
  };

  private buildSqlParamsForUpdate = (obj: {
    [key in string]: number | string | Date | null | undefined;
  }) => {
    const convertedObj = this.convertObjKeysToSnakeCase(obj);
    const resultArr: Array<any> = [];
    const entries = Object.entries(convertedObj);
    entries.forEach((entry) => {
      resultArr.push(`${entry[0]} = "${entry[1]}"`);
    });
    return resultArr.join(', ');
  };

  private buildSqlParamsForDelete = (
    obj: { [key in string]: number | string | Date },
    condition?: string | null
  ) => {
    const convertedObj = this.convertObjKeysToSnakeCase(obj);
    const resultArr: Array<string> = [];
    const entries = Object.entries(convertedObj);
    entries.forEach((entry) => {
      resultArr.push(`${entry[0]} = "${entry[1]}"`);
    });
    if (condition === 'AND' || condition === 'OR') {
      resultArr.join(` ${condition} `);
    }
    return resultArr;
  };

  private buildInquiryOpt = (
    inquiryOpt: { [key in string]: number | string | Date } = {},
    condition = ''
  ) => {
    let inquiryOptQuery = '';
    if (
      Object.keys(inquiryOpt).length > 1 &&
      condition !== 'AND' &&
      condition !== 'OR'
    ) {
      const msg = 'INVALID buildInquiryOpt Condition';
      throw NetworkError.BAD_REQUEST.msg(msg);
    }
    if (Object.keys(inquiryOpt).length !== 0) {
      const convertedObj = this.convertObjKeysToSnakeCase(inquiryOpt);
      const resultArr: Array<string> = [];
      const entries = Object.entries(convertedObj);
      entries.forEach((entry) => {
        resultArr.push(`${entry[0]} = "${entry[1]}"`);
      });
      inquiryOptQuery = `\nWHERE ` + `${resultArr.join(` ${condition} `)}`;
    }
    return inquiryOptQuery;
  };
}

export default new QueryBuilder();
