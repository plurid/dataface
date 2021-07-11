// #region imports
    // #region libraries
    import {
        Collection,
        ObjectID,
        FilterQuery,
    } from 'mongodb';
    // #endregion libraries


    // #region external
    import {
        Pagination,
    } from '../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const handlePagination = async <T>(
    collection: Collection,
    filter: FilterQuery<any>,
    pagination?: Pagination,
) => {
    if (pagination) {
        const {
            type,
            start,
            count: paginationCount,
        } = pagination;

        const count = paginationCount || 20;

        if (start) {
            const item = await collection.findOne({
                'id': start,
            });

            if (item) {
                const lastID = new ObjectID(item._id);
                filter['_id'] = {
                    '$lt': lastID,
                };
            }
        }

        const sortType = type === 'last' ? -1 : 1;

        const cursor = collection
            .find(filter)
            .sort({
                $natural: sortType,
            }).limit(count);

        const items: T[] = await cursor.toArray();

        return items;
    }

    return null;
}
// #endregion module



// #region exports
export {
    handlePagination,
};
// #endregion exports
