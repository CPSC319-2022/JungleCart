import { errorGenerator} from '/opt/customError-layer';

const camelToUnderscore = (key: string) => {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
};

const convertObjKeysToSnakeCase = (obj: {
  [key in string]: number | string | Date | boolean | null | undefined;
}) => {
  const newObj: {
    [key in string]: number | string | Date | boolean | null | undefined;
  } = {};
  for (const camel in obj) {
    if (obj[camel] !== undefined) {
      newObj[camelToUnderscore(camel)] = obj[camel];
    }
  }
  return newObj;
};

const buildSqlParamsForSelect = (inquiryColumn: string[]) => {
  if (inquiryColumn[0] === 'all') {
    return '*';
  }
  return inquiryColumn.join(`,`);
};

const buildSqlParamsForInsert = (obj: {
  [key in string]: number | string | Date | boolean | null;
}) => {
  const convertedObj = convertObjKeysToSnakeCase(obj);
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

const buildSqlParamsForUpdate = (obj: {
  [key in string]: number | string | Date | null | undefined;
}) => {
  const convertedObj = convertObjKeysToSnakeCase(obj);
  const resultArr: Array<any> = [];
  const entries = Object.entries(convertedObj);
  entries.forEach((entry) => {
    resultArr.push(`${entry[0]} = "${entry[1]}"`);
  });
  return resultArr.join(', ');
};

const buildSqlParamsForDelete = (
  obj: { [key in string]: number | string | Date },
  condition?: string | null
) => {
  const convertedObj = convertObjKeysToSnakeCase(obj);
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

const buildInquiryOpt = (
  inquiryOpt: { [key in string]: number | string | Date } = {},
  condition = ''
) => {
  let inquiryOptQuery = '';
  if (
    Object.keys(inquiryOpt).length > 1 &&
    condition !== 'AND' &&
    condition !== 'OR'
  ) {
    errorGenerator({
      message: 'INVALID buildInquiryOpt Condition',
      statusCode: 400,
    });
  }
  if (Object.keys(inquiryOpt).length !== 0) {
    const convertedObj = convertObjKeysToSnakeCase(inquiryOpt);
    const resultArr: Array<string> = [];
    const entries = Object.entries(convertedObj);
    entries.forEach((entry) => {
      resultArr.push(`${entry[0]} = "${entry[1]}"`);
    });
    inquiryOptQuery = `\nWHERE ` + `${resultArr.join(` ${condition} `)}`;
  }
  return inquiryOptQuery;
};
export const selectBuilder = (
  inquiryColumn: string[],
  table: string,
  inquiryOpt: { [key in string]: number | string | Date } = {},
  optCondition = ''
) => {
  const query =
    `SELECT ${buildSqlParamsForSelect(inquiryColumn)}\nFROM ${table}` +
    `${buildInquiryOpt(inquiryOpt, optCondition)}` +
    `;`;
  console.log('query: ', query);
  return query;
};

export const insertBuilder = (
  data: { [key in string]: number | string | Date | boolean | null },
  table: string
) => {
  const query = `
    INSERT INTO ${table} (
      ${buildSqlParamsForInsert(data)}
    );
  `;
  return query;
};

export const updateBuilder = (
  inquiryId: number,
  data: { [key in string]: number | string | Date | null | undefined },
  table: string
) => {
  const query = `
    UPDATE ${table} SET ${buildSqlParamsForUpdate(
    data
  )} WHERE id = ${inquiryId};`;
  return query;
};

export const updateBetweenBuilder = (
  inquiryId: number,
  data: { [key in string]: number | string | Date },
  table: string
) => {
  const query = `
    UPDATE ${table} SET ${buildSqlParamsForUpdate(data)} 
    WHERE id = ${inquiryId}
    AND
    WHERE id BETWEEN 
  ;`;
  return query;
};

export const deleteBuilder = (
  data: { [key in string]: number | string | Date },
  table: string,
  condition?: string | null
) => {
  const query = `
    DELETE FROM ${table} WHERE ${buildSqlParamsForDelete(data, condition)};
  `;
  return query;
};
