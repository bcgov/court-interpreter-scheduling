import { Repository } from "typeorm"

/**
 * Couldn't get any of the type libraries to work properly, so I copy/pasted the code of
 * the @nestjs-toolbox/typeorm-upsert module and hacked it to get it to work
 */
export async function typeormUpsert<T>(
    repository: Repository<T>,
    object: T,
    conflictKey: string,
    options?: {
        keyNamingTransform?: (k: string) => string,
        doNotUpsert?: string[]
    },
): Promise<{  }> {
    options = options ? options : {}
    const keyNamingTransform = options.keyNamingTransform ?? ((k) => k)
    const doNotUpsert = options.doNotUpsert ?? []
    const upsertKeys: string[] = Object.keys(object).filter(k => !doNotUpsert.includes(k))
    const conflictSetterString = upsertKeys
        .map(keyNamingTransform)
        .map(k => `"${k}"=EXCLUDED."${k}"`).join(' , ')
    const onConflict = `("${conflictKey}") DO UPDATE SET ${conflictSetterString}`
    const result = await repository
        .createQueryBuilder()
        .insert()
        .values(object)
        .onConflict(onConflict)
        .returning('*')
        .execute()
    return result.raw
}
