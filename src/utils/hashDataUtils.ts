import bcrypt from "bcrypt";

export function hashData(data: string): string {
    return bcrypt.hashSync(data, 10);
}

export function validateHashData(
    plainData: string,
    encryptedData: string
): boolean {
    return bcrypt.compareSync(plainData, encryptedData);
}
