const UserError = require("./user-error");

class MemberNotFoundError extends UserError {
    constructor() {
        super('Member not found');
        this.name = 'MemberNotFoundError';
    }
}

module.exports = MemberNotFoundError;
