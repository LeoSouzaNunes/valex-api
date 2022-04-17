import * as cardRepo from "../repositories/cardRepository.js";
import * as businessRepo from "../repositories/businessRepository.js";
import * as payment from "../repositories/paymentRepository.js";
import * as recharge from "../repositories/rechargeRepository.js";
import * as error from "../utils/errorUtils.js";
import * as encrypt from "../utils/hashDataUtils.js";
import dayjs from "dayjs";

export async function depositsPayment(
    cardId: number,
    businessId: number,
    amount: number,
    password: string
) {
    const cardData = await checkCardExists(cardId);
    checkCardIsUnblocked(cardData);
    checkCardIsExpired(cardData.expirationDate);
    validatePassword(password, cardData.password);
    await validateBusiness(businessId, cardData.type);
    const totalBalance = await calculateBalance(cardId);
    await approvePayment(totalBalance, amount, cardId, businessId);
}

async function approvePayment(
    totalBalance: number,
    amount: number,
    cardId: number,
    businessId: number
) {
    if (totalBalance < amount) {
        throw error.badRequest("Insufficient funds.");
    }
    await payment.insert({ cardId, businessId, amount });
}

async function checkCardExists(cardId: number) {
    const cardData = await cardRepo.findById(cardId);
    if (!cardData) {
        throw error.notFound("Card not found.");
    }
    return cardData;
}

function checkCardIsExpired(expirationDate: string) {
    const formattedLimitDate = formatDate(expirationDate);
    const actualDate = dayjs().valueOf();
    const limitDate = dayjs(`${formattedLimitDate}`).valueOf();
    const diff = limitDate - actualDate;
    if (diff < 0) {
        throw error.unauthorized("Card has expired.");
    }
}

function formatDate(shortenedDate: string) {
    const datePieces = shortenedDate.split("/");
    const formattedDate = `20${datePieces[1]}-${datePieces[0]}-15`;
    return formattedDate;
}

function validatePassword(plainPassword: string, encryptedPassword: string) {
    if (!encrypt.validateHashData(plainPassword, encryptedPassword)) {
        throw error.unauthorized("Invalid password.");
    }
}

async function validateBusiness(
    businessId: number,
    cardType: cardRepo.TransactionTypes
) {
    const businessType = await checkBusinessExists(businessId);
    checkCardIsTheSameType(cardType, businessType);
}

async function checkBusinessExists(businessId: number) {
    const businessData = await businessRepo.findById(businessId);
    if (!businessData) {
        throw error.notFound("Business not found.");
    }
    return businessData.type;
}

function checkCardIsTheSameType(
    cardType: cardRepo.TransactionTypes,
    businessType: string
) {
    if (cardType !== businessType) {
        throw error.unauthorized("Business type doesn't match.");
    }
}

async function calculateBalance(cardId: number) {
    const paymentData = await payment.findByCardId(cardId);
    const rechargeData = await recharge.findByCardId(cardId);

    const paymentTotal = returnTotalSum(paymentData);
    const rechargeTotal = returnTotalSum(rechargeData);

    return rechargeTotal - paymentTotal;
}

function returnTotalSum(array: any[]) {
    let totalSum = 0;
    if (array.length === 0) {
        return totalSum;
    }
    for (const item of array) {
        totalSum += item.amount;
    }

    return totalSum;
}

function checkCardIsUnblocked({ isBlocked }) {
    if (isBlocked) {
        throw error.unauthorized("Card blocked.");
    }
}
