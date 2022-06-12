class UserError extends Error {
    /**
     * When an error of this type occurs during command execution, its message is displayed to the user.
     * @param {string} message The error message
     */
    constructor(message = null) {
        super(message);
        this.name = 'UserError';
    }
}

module.exports = UserError;
