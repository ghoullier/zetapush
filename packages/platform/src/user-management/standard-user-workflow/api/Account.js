'use strict';
var __extends =
  (this && this.__extends) ||
  (function() {
    var extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function(d, b) {
          d.__proto__ = b;
        }) ||
      function(d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };
    return function(d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
exports.__esModule = true;
var AccountCreationError = /** @class */ (function(_super) {
  __extends(AccountCreationError, _super);
  function AccountCreationError(message, details) {
    var _this = _super.call(this, message) || this;
    _this.details = details;
    return _this;
  }
  return AccountCreationError;
})(Error);
exports.AccountCreationError = AccountCreationError;