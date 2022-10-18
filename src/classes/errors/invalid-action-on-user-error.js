const UserError = require('./user-error');

class InvalidActionOnUserError extends UserError {
  constructor() {
    super('This action cannot be performed on the specified user');
    this.name = 'InvalidActionOnUserError';
  }
}

module.exports = InvalidActionOnUserError;
