const UserError = require("./user-error");

class InvalidArgumentsError extends UserError {
    constructor() {
        super('Missing/Invalid Arguments');
        this.name = 'InvalidArgumentsError';
    }
}

module.exports = InvalidArgumentsError;
