import joi from "joi";

const passwordRegex = /^[0-9]{4}$/;

const passwordSchema = joi.object({
    password: joi.string().pattern(passwordRegex).required(),
});

export default passwordSchema;
