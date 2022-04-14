export function notFound(message: string) {
    return { type: "not_found", message };
}
export function conflict(message: string) {
    return { type: "conflict", message };
}
export function unauthorized(message: string) {
    return { type: "unauthorized", message };
}
