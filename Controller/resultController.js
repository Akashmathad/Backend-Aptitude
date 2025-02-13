const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Result = require('../Models/resultModel');
const AptitudeResult = require('../Models/AptitudeResultModel');
const DSAResult = require('../Models/DSAResultModel');
const Profile = require('../Models/userProfileModel');

exports.createResult = catchAsync(async (req, res, next) => {
  const newResult = await Result.create(req.body);

  res.status(200).json({
    status: 'success',
    results: newResult,
  });
});

exports.createAtitudeResult = catchAsync(async (req, res, next) => {
  const newResult = await AptitudeResult.create(req.body);

  res.status(200).json({
    status: 'success',
    result: newResult,
  });
});

exports.createDSAResult = catchAsync(async (req, res, next) => {
  const newResult = await DSAResult.create(req.body);

  res.status(200).json({
    status: 'success',
    result: newResult,
  });
});

exports.getAllResults = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Result.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const results = await features.query;
  console.log(results);
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      results: results,
    },
  });
});

exports.getAllAptitudeResults = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(AptitudeResult.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const results = await features.query;
  console.log(results);
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      results: results,
    },
  });
});

exports.getAllDSAResults = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(DSAResult.find(), req.query)
    .filter()
    .sort()
    .fields()
    .paginate();

  const results = await features.query;
  console.log(results);
  res.status(200).json({
    status: 'success',
    results: results.length,
    data: {
      results: results,
    },
  });
});

exports.getResultByUsn = catchAsync(async (req, res, next) => {
  const result = await Result.findOne(
    {
      contestNumber: req.params.contestNumber,
      Results: { $elemMatch: { usn: req.params.usn } },
    },
    {
      'Results.$': 1,
    }
  );
  console.log(result);
  if (!result || !result.Results.length) {
    return next(new AppError('Result not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      Result: result.Results[0],
    },
  });
});

exports.getResult = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Result.findOne({
      contestNumber: req.params.contestNumber,
    }),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await features.query;
  // result.forEach((document) => {
  //   document.Results.sort((a, b) => b.points - a.points);
  // });
  result.forEach((document) => {
    document.Results.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return b.timeLeft - a.timeLeft;
    });
  });

  if (!result) {
    return next(new AppError('Result not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.getAptitudeResult = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    AptitudeResult.findOne({
      contestNumber: req.params.contestNumber,
    }),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await features.query;
  // result.forEach((document) => {
  //   document.Results.sort((a, b) => b.points - a.points);
  // });
  result.forEach((document) => {
    document.Results.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return b.timeLeft - a.timeLeft;
    });
  });

  if (!result) {
    return next(new AppError('Result not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.getDSAResult = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    DSAResult.findOne({
      contestNumber: req.params.contestNumber,
    }),
    req.query
  )
    .filter()
    .sort()
    .fields()
    .paginate();

  const result = await features.query;
  // result.forEach((document) => {
  //   document.Results.sort((a, b) => b.points - a.points);
  // });
  result.forEach((document) => {
    document.Results.sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }

      return b.timeLeft - a.timeLeft;
    });
  });

  if (!result) {
    return next(new AppError('Result not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.deleteResult = catchAsync(async (req, res, next) => {
  const result = await Result.findOneAndDelete({
    contestNumber: req.params.contestNumber,
  });

  if (!result) {
    return next(new AppError('Result not found', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.updateAptitudeResult = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ usn: req.params.usn });
  // const resultCheck = await AptitudeResult.findOne({
  //   contestName: req.body.contestName,
  // });

  // if (!profile) {
  //   return next(new AppError('Profile not found', 404));
  // }

  // if (
  //   req.body.contestName === resultCheck.contestName &&
  //   resultCheck.Results.some((document) => req.params.usn === document.usn)
  // ) {
  //   return res.status(200).json({
  //     status: 'success',
  //   });
  // }

  const result = await AptitudeResult.findOneAndUpdate(
    {
      contestNumber: req.params.contestNumber,
      contestName: req.body.contestName,
    },
    {
      $push: {
        Results: {
          usn: req.params.usn,
          name: profile.name,
          branch: profile.branch,
          points: req.body.points,
          timeLeft: req.body.timeLeft,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    return next(new AppError('Result not found', 404));
  }

  next();
});

exports.updateDSAResult = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ usn: req.params.usn });
  const resultCheck = await DSAResult.findOne({
    contestName: req.body.contestName,
  });

  if (!profile) {
    return next(new AppError('Profile not found', 404));
  }

  // if (
  //   req.body.contestName === resultCheck.contestName &&
  //   resultCheck.Results.some((document) => req.params.usn === document.usn)
  // ) {
  //   return res.status(200).json({
  //     status: 'success',
  //   });
  // }

  const result = await DSAResult.findOneAndUpdate(
    {
      contestNumber: req.params.contestNumber,
      contestName: req.body.contestName,
    },
    {
      $push: {
        Results: {
          usn: req.params.usn,
          name: profile.name,
          branch: profile.branch,
          points: req.body.points,
          timeLeft: req.body.timeLeft,
        },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!result) {
    return next(new AppError('Result not found', 404));
  }

  next();
});
