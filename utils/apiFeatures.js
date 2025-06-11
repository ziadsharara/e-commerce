import qs from 'qs';

class ApiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery;
    this.queryStr = queryStr;
  }

  filter() {
    // Parse query string if it's a raw string
    let queryObj = this.queryStr;
    if (typeof queryObj === 'string') {
      queryObj = qs.parse(queryObj);
    }
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

  search() {
    if (this.queryStr.keyword) {
      const keyword = this.queryStr.keyword;
      this.mongooseQuery = this.mongooseQuery.find({
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { description: { $regex: keyword, $options: 'i' } },
        ],
      });
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 50;
    const skip = (page - 1) * limit;
    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

export default ApiFeatures;
