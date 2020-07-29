
export interface IHashingService {
    createHash(text): Promise<string>,
    compare(text, hash): Promise<boolean>
}
