import { findById } from "../repositories/employeeRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js";
import * as cardRepo from "../repositories/cardRepository.js";
import * as error from "../utils/errorUtils.js";
import faker from "@faker-js/faker";

function formatName(name: string) {
    const nameArray = name.split(" ");
    nameArray.forEach((element, index) => {
        if (index === 0 || index === nameArray.length - 1) {
        } else {
        }
    });
}

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
    const employeeData = await findById(employeeId);
    if (!employeeData) {
        throw error.notFound("Didn't find employee data.");
    }

    const hasCard = await cardRepo.findByTypeAndEmployeeId(type, employeeId);
    if (hasCard) {
        throw error.conflict("Card already exist.");
    }

    return {
        employeeId,
        number: faker.finance.creditCardNumber("Mastercard"),
        cardHolderName: "",
    };
}
