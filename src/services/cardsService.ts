import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as cardRepo from "../repositories/cardRepository.js";
import * as error from "../utils/errorUtils.js";
import * as encrypt from "../utils/hashDataUtils.js";
import faker from "@faker-js/faker";
import dayjs from "dayjs";

export async function checkKey(key: any) {
    const companyData = await findByApiKey(key);
    if (!companyData) {
        throw error.unauthorized("Invalid key.");
    }
    return companyData;
}

export async function checkIsValidEmployeeAndCreateCard(
    employeeId: number,
    type: cardRepo.TransactionTypes
) {
    const employeeFullName = await isEmployee(employeeId);
    await checkEmployeeHasCard(employeeId, type);
    const [safeCardData, plainCardData] = formatCardData(
        employeeId,
        employeeFullName,
        type
    );
    await cardRepo.insert(safeCardData);
    return plainCardData;
}

export async function findCards(employeeId: number) {
    const cards = await cardRepo.findByEmployeeId(employeeId);
    return cards;
}

export async function activateCard(
    cardId: number,
    plainCVV: string,
    cardPassword: string
) {
    const cardData = await checkCardExists(cardId);
    checkCardIsExpired(cardData.expirationDate);
    checkIsAlreadyActive(cardData.password);
    validateCVV(plainCVV, cardData.securityCode);
    const encryptedPassword = encrypt.hashData(cardPassword);
    await cardRepo.update(cardId, { ...cardData, password: encryptedPassword });
}

function validateCVV(plainCVV: string, encryptedCVV: string) {
    if (!encrypt.validateHashData(plainCVV, encryptedCVV)) {
        throw error.unauthorized("Invalid CVV.");
    }
}

function checkIsAlreadyActive(password: string) {
    if (password !== null) {
        throw error.conflict("Card already activated.");
    }
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

async function checkCardExists(cardId: number) {
    const cardData = await cardRepo.findById(cardId);
    if (!cardData) {
        throw error.notFound("Card not found.");
    }
    return cardData;
}

function formatCardData(
    employeeId: number,
    employeeFullName: string,
    type: cardRepo.TransactionTypes
) {
    const plainSecurityCode = faker.finance.creditCardCVV();

    const cardholderName = formatName(employeeFullName);
    const number = faker.finance.creditCardNumber("Mastercard");
    const securityCode = encrypt.hashData(plainSecurityCode);
    const expirationDate = dayjs().add(5, "year").format("MM/YY");

    const safeCardData = {
        employeeId,
        number,
        cardholderName,
        securityCode,
        expirationDate,
        password: null,
        isVirtual: false,
        originalCardId: null,
        isBlocked: true,
        type,
    };

    return [safeCardData, { ...safeCardData, securityCode: plainSecurityCode }];
}

async function checkEmployeeHasCard(
    employeeId: number,
    type: cardRepo.TransactionTypes
) {
    const hasCard = await cardRepo.findByTypeAndEmployeeId(type, employeeId);
    if (hasCard) {
        throw error.conflict("Card already exists.");
    }
}

async function isEmployee(employeeId: number) {
    const employeeData = await findById(employeeId);
    if (!employeeData) {
        throw error.notFound("Employee not found.");
    }
    return employeeData.fullName;
}

function formatName(name: string) {
    const nameArray = name.split(" ");
    const shortenedName = nameArray
        .reduce(concatFormattedName, "")
        .toUpperCase()
        .trim();
    return shortenedName;
}

function concatFormattedName(
    total: string,
    element: string,
    index: number,
    nameArray: string[]
) {
    if (index === 0 || index === nameArray.length - 1) {
        return total + ` ${element}`;
    } else {
        if (element.length >= 3) {
            return total + ` ${element[0]}`;
        } else {
            return total;
        }
    }
}
