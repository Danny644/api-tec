function paginationOptions(page1, limit1, select, populate) {
    try{
        const page = page1 || 1;
        const limit = limit1 || 10;

        let options;

        if(populate){
            options = {
                page,
                limit,
                select: select,
                populate: populate
            };
            
        }else{

        options = {
            page,
            limit,
            select: select
        };
    }
 
        return options

    }catch(error){

        return null;

    }
}

function paginationArray(page1, limit1, arrayPagination) {
    try{
    const page = page1 || 1;
    const limit = limit1 || 10; 

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const data = arrayPagination.slice(startIndex, endIndex);

    const totalCount = arrayPagination.length;

    const totalPages = Math.ceil(totalCount / limit);

    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    const prevPage = hasPrevPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;


    return { totalCount, totalPages,currentPage: page, data, hasPrevPage, hasNextPage, prevPage, nextPage};

    }catch(error){
        return null;
    }
}

function onlyPagination(page1, limit1, arrayPagination) {
    try{
    const page = page1 || 1;
    const limit = limit1 || 10; 

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const data = arrayPagination.slice(startIndex, endIndex);

    return data;

    }catch(error){
        return null;
    }
}

module.exports = { paginationOptions, paginationArray,  onlyPagination  }
