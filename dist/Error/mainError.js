"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainError = exports.HTTP = void 0;
var HTTP;
(function (HTTP) {
    HTTP[HTTP["OK"] = 200] = "OK";
    HTTP[HTTP["CREATED"] = 201] = "CREATED";
    HTTP[HTTP["BAD"] = 404] = "BAD";
})(HTTP = exports.HTTP || (exports.HTTP = {}));
class mainError extends Error {
    constructor(args) {
        super(args.message);
        this.success = false;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = args.name;
        this.message = args.message;
        this.status = args.status;
        this.success = args.success;
        if (this.success !== undefined) {
            this.success = args.success;
        }
        Error.captureStackTrace(this);
    }
}
exports.mainError = mainError;
