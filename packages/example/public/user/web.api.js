class SimpleAuthentication {
  constructor({ $publish }) { this.$publish = $publish; }
  static get DEFAULT_DEPLOYMENT_ID() { return 'simple_0'; }
  changePassword({ token, key, password } = {}) { return this.$publish('changePassword', { token, key, password }); }
  checkPassword({ key, password } = {}) { return this.$publish('checkPassword', { key, password }); }
  checkUser({ key, softFail } = {}) { return this.$publish('checkUser', { key, softFail }); }
  createUser(profile = {}) { return this.$publish('createUser', profile); }
  credentials({ owner } = {}) { return this.$publish('credentials', { owner }); }
  deleteUser({ key, softFail } = {}) { return this.$publish('deleteUser', { key, softFail }); }
  requestReset({ key } = {}) { return this.$publish('requestReset', { key }); }
  updateKey({ newKey, oldKey, owner } = {}) { return this.$publish('updateKey', { newKey, oldKey, owner }); }
  updateUser(profile = {}) { return this.$publish('updateUser', profile); }
}

class UserDirectory {
  constructor({ $publish }) { this.$publish = $publish; }
  static get DEFAULT_DEPLOYMENT_ID() { return 'userdir_0'; }
  search({ filter, query, page } = { filter: {}, query: {} }) { return this.$publish('search', { filter, query, page }); }
  userInfo({ userKeys } = {}) { return this.$publish('userInfo', { userKeys }); }
}


class LoginAvailability {
  constructor(available, login, user) {
    this.available = available;
    this.login = login;
    this.user = user;
    
  }
}

class User {
  constructor(userKey, login) {
    this.userKey = userKey;
    this.login = login;
  }
}

window.Api = class Api {
  static get injected() {
    return [UserDirectory, SimpleAuthentication];
  }
  constructor(zpServiceUserDirectory, zpServiceSimpleAuth) {
    console.log('Api:constructor', zpServiceUserDirectory);
    this.zpServiceUserDirectory = zpServiceUserDirectory;
    this.zpServiceSimpleAuth = zpServiceSimpleAuth
  }
  async createUser({
    login, password, fields
  } = {}) {
    const profile = { ...fields, login, password };
    /** Create user in simple service */
    const response = await this.core_user__createUserByService({
      profile,
      zpService: this.zpServiceSimpleAuth
    });
    return response;
  }
  async getUser({
    userKey
  } = {}) {
    /** Manage optional userKey value */
    // userKey = userKey ?: __userKey;
    /** Get user by user key */
    const response = await this.core_user__getUserByUserKey({
      userKey
    });
    return response;
  }
  async getUserByLogin({
    login
  } = {}) {
    const response = await core_user__getUserByLoginAndService({
      login,
      zpService: this.zpServiceSimpleAuth
    });
    return response;
  }
  async getUserList({
    userKeys= []
  } = {}) {
    /** Get user from directory */
    const { users } = await this.zpServiceUserDirectory.userInfo({ userKeys });
    /** Map restult from map to list  */
    const list = userKeys.map((userKey) => {
      const user = { userKey };
      const item = { user }
      if (users[userKey]) {
        Object.assign(item.user, users[userKey]);
        item.found = true;
      } else {
        item.found = false;
      }
      return item;
    });
    return { list };
  }
  async updateUser({
    login, fields
  } = {}) {
    const profile = { login, ...fields };
    /** Get user infos */
    await this.core_user__updateUserByService({
      profile,
      zpService: this.zpServiceSimpleAuth
    });
    /** Get updated user */
    const response = await this.core_user__getUserByLoginAndService({
      login,
      zpService: zpServiceSimpleAuth
    });
    return response;
  }

  async core_user__createUserByService({
    profile,
    zpService
  } = {}) {
    /** Check if account login is available */
    const { available } = await this.core_user__isLoginAvailableByService({
      login: profile.login,
      zpAuthenticationService: zpService
    });
    /** Assert login is available */
    // assert available ERROR__USER_ALREADY_EXISTS; 
    /** Create a new account */
    const { zetapushKey: userKey } = await zpService.createUser(profile);
    /** Get user infos */
    const { user } = await this.core_user__getUserByUserKey({ userKey });
    return { user }
  }
  async core_user__isLoginAvailableByService({
    login,
    zpAuthenticationService
  } = {}) {
    /** Check user existence */
    const user = await zpAuthenticationService.checkUser({
      key: login,
      softFail: true
    });
    const available = typeof user.login === 'undefined';
    return new LoginAvailability(available, login, user);
  }
  async core_user__getUserByUserKey({
    userKey
  } = {}) {
    /** Get user profile from user directory */
    const { users } = await this.zpServiceUserDirectory.userInfo({
      userKeys : [userKey]
    });
    /** Normalize user fields */
    const user = users[userKey];
    user.userKey = userKey;
    return {
      user
    }
  }
  async core_user__getUserByLoginAndService({
    login, zpService
  } = {}) {
    const profile = await zpService.checkUser({
      key: login,
      softFail: true
    });
    return Object.values(profile).reduce((user, [property, value]) => {
      if (property != 'zetapushKey') {
        user[property] = value;
      }
      return user;
    }, {
      userKey: profile.zetapushKey
    });
  }
  async core_user__updateUserByService({
    profile, zpService
  } = {}) {
    /** Check if account login is available */
    const { available } = await this.core_user__isLoginAvailableByService({
      login: profile.login,
      zpAuthenticationService: zpService
    });
    /** Assert user exist */
    // assert !available ERROR__USER_NOT_FOUND; 
    /** Create a new account */
    const account = await zpService.updateUser(profile);
    const userKey = account.zetapushKey;
    /** Get user infos */
    const { user } = await this.core_user__getUserByUserKey({ userKey });
    return { user };
  }
}