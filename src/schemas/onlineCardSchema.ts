import joi from "joi";

const passwordRegex = /^[0-9]{4}$/;

const onlineCardSchema = joi.object({
    cardId: joi.number().required(),
    password: joi.string().pattern(passwordRegex).required(),
});

export default onlineCardSchema;
