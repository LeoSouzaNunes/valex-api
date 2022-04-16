import * as cardRepo from "../repositories/cardRepository.js";
import * as rechargeRepo from "../repositories/rechargeRepository.js";
import * as error from "../utils/errorUtils.js";
import dayjs from "dayjs";

export async function rechargesCard(cardId: number, amount: number) {
    const { expirationDate } = await checkCardExists(cardId);
    checkCardIsExpired(expirationDate);
    await rechargeRepo.insert({ cardId, amount });
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
