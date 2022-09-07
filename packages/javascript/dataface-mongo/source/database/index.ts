// #region imports
    // #region libraries
    import {
        Collection,
        Filter,
    } from 'mongodb';
    // #endregion libraries


    // #region external
    import {
        Pagination,
    } from '../data/interfaces';
    // #endregion external


    // #region internal
    import {
        handlePagination,
    } from './utilities';
    // #endregion internal
// #endregion imports



// #region module
/**
 * Get data with `id` from the `collection`.
 *
 * @param collection
 * @param id
 */
const getById = async <T>(
    collection: Collection,
    id: string,
) => {
    try {
        const data = await collection.findOne<T>({
            id,
        });

        return data;
    } catch (error) {
        throw error;
    }
}


/**
 * Get data by `type` with `value` from the `collection`.
 *
 * @param collection
 * @param type
 * @param value
 */
const getBy = async <T>(
    collection: Collection,
    type: string,
    value: string,
): Promise<T | null> => {
    try {
        const filter: any = {};
        filter[type] = value;

        const data = (await collection.find(filter).toArray())[0] as T;

        return data;
    } catch (error) {
        throw error;
    }
}


/**
 * Get all from `collection` by query.
 *
 * @param collection
 * @param type
 * @param value
 * @param pagination
 */
const getAllBy = async <T>(
    collection: Collection,
    type: string,
    value: string,
    pagination?: Pagination,
): Promise<T[]> => {
    try {
        const filter: any = {};
        filter[type] = value;

        const paginationResult = await handlePagination<T>(
            collection,
            filter,
            pagination,
        );
        if (paginationResult) {
            return paginationResult;
        }

        const cursor = collection.find(filter);
        const data: T[] = await cursor.toArray() as T[];

        return data;
    } catch (error) {
        throw error;
    }
}


/**
 * Get all from `collection`.
 *
 * @param collection
 * @param pagination
 */
const getAllFrom = async <T>(
    collection: Collection,
    pagination?: Pagination,
): Promise<T[]> => {
    try {
        const filter: any = {};

        const paginationResult = await handlePagination<T>(
            collection,
            filter,
            pagination,
        );
        if (paginationResult) {
            return paginationResult;
        }

        const cursor = collection.find(filter);
        const items: T[] = await cursor.toArray() as T[];

        return items;
    } catch (error) {
        throw error;
    }
}


/**
 * Get all from `collection` matching `filter`.
 *
 * @param collection
 * @param filter
 * @param pagination
 */
const getAllWhere = async <T>(
    collection: Collection,
    filter: Filter<any>,
    pagination?: Pagination,
): Promise<T[]> => {
    try {
        const paginationResult = await handlePagination<T>(
            collection,
            filter,
            pagination,
        );
        if (paginationResult) {
            return paginationResult;
        }

        const cursor = collection.find(filter);
        const items: T[] = await cursor.toArray() as T[];

        return items;
    } catch (error) {
        throw error;
    }
}


/**
 * Updates or creates a document from/into the `collection`.
 *
 * @param collection
 * @param id
 * @param data
 */
const updateDocument = async <T>(
    collection: Collection,
    id: string,
    data: T,
): Promise<boolean> => {
    try {
        const query = {
            id
        };
        const update = {
            $set: {
                ...data,
            },
        };
        const options = {
            upsert: true,
        };

        const result = await collection.updateOne(
            query,
            update,
            options,
        );

        if (
            result.modifiedCount === 0
            && result.upsertedCount === 0
        ) {
            return false;
        }

        return true;
    } catch (error) {
        throw error;
    }
}


/**
 * Add a new document with `id` in the `collection`.
 *
 * @param collection
 * @param id
 * @param data
 */
const addDocument = async <T>(
    collection: Collection,
    id: string,
    data: T,
) => {
    await updateDocument(
        collection,
        id,
        data,
    );
}


/**
 * Update the `field` with the `value` of the document with `id` from the `collection`.
 *
 * @param collection
 * @param id
 * @param field
 * @param value
 */
const updateField = async <T>(
    collection: Collection,
    id: string,
    field: string,
    value: T,
): Promise<boolean> => {
    try {
        const $set: any = {};
        $set[field] = value;

        const result = await collection.updateOne(
            {
                id,
            },
            {
                $set,
            },
        );

        if (result.modifiedCount !== 1) {
            return false;
        }

        return true;
    } catch (error) {
        throw error;
    }
}


const updateWhere = async <T>(
    collection: Collection,
    filter: Filter<any>,
    field: string,
    value: T,
) => {
    try {
        const $set: any = {};
        $set[field] = value;

        const result = await collection.updateOne(
            filter,
            {
                $set,
            },
        );

        if (result.modifiedCount !== 1) {
            return false;
        }

        return true;
    } catch (error) {
        throw error;
    }
}


/**
 * Delete the `field` of the document with `id` from the `collection`.
 *
 * @param collection
 * @param id
 * @param field
 */
const deleteField = async (
    collection: Collection,
    id: string,
    field: string,
): Promise<boolean> => {
    try {
        const $unset: any = {};
        $unset[field] = '';

        const result = await collection.updateOne(
            {
                id,
            },
            {
                $unset,
            },
        );

        if (result.modifiedCount !== 1) {
            return false;
        }

        return true;
    } catch (error) {
        throw error;
    }
}


/**
 *
 * @param collection
 * @param id
 */
const deleteDocument = async (
    collection: Collection,
    id: string,
) => {
    try {
        const result = await collection.deleteOne({
            id,
        });

        if (result.deletedCount !== 1) {
            return false;
        }

        return true;
    } catch (error) {
        throw error;
    }
}


/**
 * Get data by `type` with `value` from the `collection`.
 *
 * @param collection
 * @param type
 * @param value
 */
const deleteDocumentBy = async (
    collection: Collection,
    filter: Filter<any>,
) => {
    try {
        const result = await collection.deleteOne(
            filter,
        );

        if (result.deletedCount !== 1) {
            return false;
        }

        return true;
    } catch (error) {
        throw error;
    }
}


/**
 *
 * @param collection
 */
const deleteCollection = async (
    collection: Collection,
) => {
    try {
        await collection.drop();

        return true;
    } catch (error) {
        throw error;
    }
}



/**
 * Increment the `field` with the `value` of the document with `id` from the `collection`.
 *
 * @param collection
 * @param id
 * @param field
 * @param value
 */
 const incrementField = async (
    collection: Collection,
    id: string,
    field: string,
    value: number,
): Promise<boolean> => {
    try {
        const $inc: any = {};
        $inc[field] = value;

        const result = await collection.updateOne(
            {
                id,
            },
            {
                $inc,
            },
            {
                upsert: true,
            },
        );

        if (result.modifiedCount !== 1) {
            return false;
        }

        return true;
    } catch (error) {
        throw error;
    }
}
// #endregion module



// #region exports
export {
    getById,
    getBy,
    getAllBy,
    getAllFrom,
    getAllWhere,
    addDocument,
    updateDocument,
    updateField,
    updateWhere,
    deleteField,
    deleteDocument,
    deleteDocumentBy,
    deleteCollection,
    incrementField,
};
// #endregion exports
