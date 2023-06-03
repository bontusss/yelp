import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError('invalid ID', 404));
    }
    res.status(204).json({
      status: 'success',
      message: 'doc was deleted successfully',
    });
  });

const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const doc = await Model.findOneAndUpdate({ _id: id }, req.body);
    if (!doc) {
      return next(new AppError('invalid ID', 404));
    }
    res.status(200).json({
      status: 'success',
      message: 'doc update was successful',
    });
  });

const getOne = (Model, popField) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let query = Model.findById(id);
    if (popField) query = query.populate(popField);
    const doc = await query;
    if (!doc) {
      return next(new AppError('invalid ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: { doc },
    });
  });

const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { newDoc },
    });
  });

const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const docs = await Model.find(filter);
    res.status(200).json({
      status: 'success',
      result: docs.length,
      data: { docs },
    });
  });

export default {getAll, getOne, createOne, updateOne, deleteOne}