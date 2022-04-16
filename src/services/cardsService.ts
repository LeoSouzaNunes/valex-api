import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as cardRepo from "../repositories/cardRepository.js";
import * as error from "../utils/errorUtils.js";
import faker from "@faker-js/faker";
import bcrypt from "bcrypt";
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

function formatCardData(
    employeeId: number,
    employeeFullName: string,
    type: cardRepo.TransactionTypes
) {
    const plainSecurityCode = faker.finance.creditCardCVV();

    const cardholderName = formatName(employeeFullName);
    const number = faker.finance.creditCardNumber("Mastercard");
    const securityCode = bcrypt.hashSync(plainSecurityCode, 10);
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
