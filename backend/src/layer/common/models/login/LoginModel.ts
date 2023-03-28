import QueryBuilder from '../../core/query-builder';
import SQLManager from '../../core/SQLManager';
class LoginModel {
  constructor() {
    //
  }

  public async login(email: string) {
    const query = QueryBuilder.selectBuilder(
      ['id', 'first_name', 'last_name', 'email'],
      'user',
      { email: email }
    );
    const user = await this.sendQuery(query);
    return { user: user };
  }

  public async signup(signupUserInput) {
    const query = QueryBuilder.insertBuilder(signupUserInput, 'user');
    const user = await this.sendQuery(query);
    return { user: user };
  }

  public async checkEmailExist(email: string) {
    const query = `SELECT EXISTS (SELECT 1 FROM user where email=${email}) user`;
    const result = await this.sendQuery(query);
    return result ? /^1/.test(result[0]['user']) : false;
  }

  public async sendQuery(query: string, set?) {
    return await SQLManager.query(query, set);
  }
}

export default new LoginModel();
