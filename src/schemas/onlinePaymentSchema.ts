import joi from "joi";

const cvvRegex = /^[0-9]{3}$/;
const cardNumberRegex = /^[0-9]{4}[-]{1}[0-9]{4}[-]{1}[0-9]{4}[-]{1}[0-9]{4}$/;

const onlinePaymentSchema = joi.object({
    number: joi.string().pattern(cardNumberRegex).required(),
    name: joi.string().required(),
    expirationDate: joi.string().max(5).required(),
    cvv: joi.string().pattern(cvvRegex).required(),
    businessId: joi.number().integer().required(),
    amount: joi.number().integer().greater(0).required(),
});

export default onlinePaymentSchema;
