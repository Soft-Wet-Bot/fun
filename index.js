import BaseModule from "./structures/BaseModule.js";

export default class Fun extends BaseModule {
  /**
   * @param {Main} main
   */
  constructor(main) {
    super(main);

    this.register(Fun, {
      name: "fun",
    });
  }

  init() {
    this.modules.commandRegistrar.registerCommands('fun', import.meta.url);

    return true;
  }
}
