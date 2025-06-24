declare module 'globals' {
  interface GlobalsCollection {
    [key: string]: boolean | 'readonly' | 'writable' | 'off'
  }

  interface Globals {
    browser: GlobalsCollection
    node: GlobalsCollection
    commonjs: GlobalsCollection
    shared: GlobalsCollection
    worker: GlobalsCollection
    amd: GlobalsCollection
    mocha: GlobalsCollection
    jasmine: GlobalsCollection
    jest: GlobalsCollection
    phantomjs: GlobalsCollection
    jquery: GlobalsCollection
    qunit: GlobalsCollection
    prototypejs: GlobalsCollection
    shelljs: GlobalsCollection
    meteor: GlobalsCollection
    mongo: GlobalsCollection
    applescript: GlobalsCollection
    nashorn: GlobalsCollection
    serviceworker: GlobalsCollection
    atomtest: GlobalsCollection
    embertest: GlobalsCollection
    protractor: GlobalsCollection
    webextensions: GlobalsCollection
    greasemonkey: GlobalsCollection
    devtools: GlobalsCollection
    es6: GlobalsCollection
    es2015: GlobalsCollection
    es2016: GlobalsCollection
    es2017: GlobalsCollection
    es2018: GlobalsCollection
    es2019: GlobalsCollection
    es2020: GlobalsCollection
    es2021: GlobalsCollection
    es2022: GlobalsCollection
    builtin: GlobalsCollection
  }

  const globals: Globals
  export = globals
}
