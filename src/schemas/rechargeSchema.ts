import joi from "joi";

const rechargeSchema = joi.object({
    cardId: joi.number().integer().required(),
    amount: joi.number().integer().greater(0).required(),
});

export default rechargeSchema;
