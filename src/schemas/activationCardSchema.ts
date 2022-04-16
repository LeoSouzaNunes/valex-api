import joi from "joi";

const cvvRegex = /^[0-9]{3}$/;
const passwordRegex = /^[0-9]{4}$/;

const activationCardSchema = joi.object({
    cvv: joi.string().pattern(cvvRegex).required(),
    password: joi.string().pattern(passwordRegex).required(),
});

export default activationCardSchema;
