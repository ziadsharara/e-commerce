import qs from 'qs';

class ApiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery;
    this.queryStr = queryStr;
  }

  filter() {
    const queryObj = { ...this.queryStr };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'keyword'];
    excludeFields.forEach(field => delete queryObj[field]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const filter = JSON.parse(queryStr);

    this.mongooseQuery = this.mongooseQuery.find(filter);
    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .join(' ');
      if (sortBy) {
        this.mongooseQuery = this.mongooseQuery.sort(sortBy);
      }
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select('-__v');
    }
    return this;
  }

  search(modelName) {
    if (this.queryStr.keyword) {
      if (modelName === 'Products') {
        const keyword = this.queryStr.keyword;
        this.mongooseQuery = this.mongooseQuery.find({
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
          ],
        });
      } else {
        const keyword = this.queryStr.keyword;
        this.mongooseQuery = this.mongooseQuery.find({
          $or: [{ name: { $regex: keyword, $options: 'i' } }],
        });
      }
    }
    return this;
  }

  paginate(countDocument) {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 50;
    const skip = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPages = Math.ceil(countDocument / limit); // 50 / 10 = 0.2 => 1

    // next page
    if (endIndex < countDocument) {
      pagination.next = page + 1;
    }
    // previous page
    if (skip > 0) {
      pagination.prev = page - 1;
    }
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);

    this.paginationResult = pagination;
    return this;
  }
}

export default ApiFeatures;
