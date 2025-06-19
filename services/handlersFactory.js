import { Model } from 'mongoose';
import { ApiError } from '../utils/apiError.js';
import ApiFeatures from '../utils/apiFeatures.js';
import qs from 'qs';

export const deleteOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findByIdAndDelete(id);

  if (!document) {
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res
    .status(200)
    .json({ success: true, message: 'Document deleted successfully!' });
};

export const deleteAll = Model => async (req, res, next) => {
  const result = await Model.deleteMany();

  if (!result) return next(new ApiError('No document to delete!'));

  res.status(200).json({
    success: true,
    message: `All documents deleted successfully!`,
    deletedCount: result.deletedCount,
  });
};

export const updateOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  // findOneAndUpdate(filter, update, options)
  const document = await Model.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }, // to return the data after update in response
  );

  if (!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: document });
};

export const createOne = Model => async (req, res) => {
  const document = await Model.create(req.body);
  res.status(201).json({ success: true, data: document });
};

export const getOne = Model => async (req, res, next) => {
  const { id } = req.params;
  const document = await Model.findById(id);
  if (!document) {
    // ApiError('message', statusCode)
    return next(new ApiError(`No document for this id ${id}`, 404));
  }
  res.status(200).json({ success: true, data: document });
};

export const getAll =
  (Model, modelName = '') =>
  async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const rawQuery = req._parsedUrl.query;
    const parsedQuery = qs.parse(rawQuery);

    const documentsCount = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), parsedQuery)
      .paginate(documentsCount)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await apiFeatures.mongooseQuery;

    res.status(200).json({
      success: true,
      results: documents.length,
      paginationResult,
      data: documents,
    });
  };
