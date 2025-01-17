export default class BaseModule {
  /**
   * @param {Main} main
   */
  constructor(main) {
    this._m = main;
  }

  get auth() {
    return this._m.auth;
  }

  get config() {
    return this._m.config;
  }

  get globalStorage() {
    return this._m.globalStorage;
  }

  get log() {
    return this._m.log;
  }

  get modules() {
    return this._m.modules;
  }

  get servers() {
    return this._m.servers;
  }

  get users() {
    return this._m.userManager;
  }

  /**
   * @param {Object} object
   * @param {boolean} internal If this is the raw register object
   */
  register(instance, object, internal = true) {
    if (typeof object !== "object")
      throw new Error(
        "Invalid self assignment, expected object but got different type instead."
      );

    Object.assign(this, object);

    if (internal) {
      this.instance = instance;

      delete object.category;
      this.rawData = object;
    } else if (this.rawData) {
      Object.assign(this.rawData, object);
    }
  }
}
