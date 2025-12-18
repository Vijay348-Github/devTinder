const validator = require("validator");

const validateUserData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Name is not valid.");
    } else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid.");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not strong.");
    }
};

const validateProfileDataToBeEdited = (req) => {
    const allowedFieldsToEdit = [
        "firstName",
        "lastName",
        "email",
        "age",
        "about",
        "photo",
        "skills",
    ];
    const isAllowed = Object.keys(req).every(field => allowedFieldsToEdit.includes(field));

    return isAllowed;
};

module.exports = {
    validateUserData,validateProfileDataToBeEdited
};
