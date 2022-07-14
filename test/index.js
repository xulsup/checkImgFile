const assert = require('assert');
// describe：定义一组测试
describe('加法函数测试', function () {
  before(function () {
    // runs before all tests in this block
  });

  // it: 定义一个测试用例
  it('', function () {
    // assert: nodejs内置断言模块
    assert.equal(add(1, 1), 2);
  });

  after(function () {
    // runs after all test in this block
  });
});
