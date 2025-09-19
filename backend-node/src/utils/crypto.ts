import { createHash } from 'crypto';

const genHash = (key: string): string => {
    return createHash(process.env.HASH_ALGORITHM as string).update(key).digest('base64');
};

export { genHash };
