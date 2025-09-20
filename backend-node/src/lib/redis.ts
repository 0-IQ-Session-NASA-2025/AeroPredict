import Redis from 'ioredis';
// todo change everything to logger
const redisConfig = {
    host: (process.env.REDIS_HOST || 'localhost') as string,
    port: (process.env.REDIS_PORT || 6379) as number
}

// Function to set a key-value pair in Redis
export async function setCache(key: string, value: any, ttl=0): Promise<void> {
    const redis = new Redis(redisConfig);
    try {
        const jsonString: string = JSON.stringify(value);
        if(ttl > 0){
            await redis.set(key, jsonString, 'EX', ttl);
            return
        }
        await redis.set(key, jsonString);
        // console.log(`Key '${key}' set to value '${jsonString}'`);
    } catch (error) {
        console.error('Error setting key-value pair in Redis:', error);
    } finally {
        redis.disconnect();
    }
}

// Function to get the value associated with a key from Redis
export async function getCache(key: string): Promise<{ value: any, key: string }> {
    const redis = new Redis(redisConfig);
    try {
        const value = await redis.get(key);
        if (value !== null) {
            // console.log(`Value for key '${key}': ${value}`);
            redis.disconnect();
            return {
                value: JSON.parse(value),
                key
            }
        } else {
            redis.disconnect();
            // console.log(`No value found for key '${key}'`);
            return {
                value: null,
                key
            }
        }
    } catch (error) {
        console.error('Error getting value from Redis:', error);
        return {
            value: null,
            key

        }
    }
}

// Function to delete a key from Redis
export async function deleteCache(key: string): Promise<void> {
    const redis = new Redis(redisConfig);
    try {
        await redis.del(key);
        // console.log(`Key '${key}' deleted from Redis`);
    } catch (error) {
        console.error('Error deleting key from Redis:', error);
    } finally {
        redis.disconnect();
    }
}

