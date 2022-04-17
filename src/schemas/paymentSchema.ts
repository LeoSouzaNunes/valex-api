import joi from "joi";

const passwordRegex = /^[0-9]{4}$/;

const paymentSchema = joi.object({
    cardId: joi.number().integer().required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().integer().greater(0).required(),
    password: joi.string().pattern(passwordRegex).required(),
});

export default paymentSchema;
