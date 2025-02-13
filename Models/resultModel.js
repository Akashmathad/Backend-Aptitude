const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  contestNumber: {
    type: Number,
    required: [true, 'Provide a contest number'],
    unique: true,
  },
  contestName: {
    type: String,
    required: [true, 'Provide a contest name'],
  },
  Results: [
    {
      usn: {
        type: String,
        required: [true, 'Please provide a valid usn'],
        lowercase: true,
      },
      branch: {
        type: String,
        required: [true, 'Please provide a branch'],
        lowercase: true,
        enum: {
          values: ['cse', 'ece', 'ise'],
          message: 'The type should cse, ece or ise',
        },
      },
      name: {
        type: String,
        required: [true, 'Provide a name'],
      },
      points: {
        type: Number,
        required: [true, 'Provide the points'],
      },
      timeLeft: {
        type: Number,
        required: [true, 'Provide the time'],
      },
    },
  ],
});

const Result = mongoose.model('Result', resultSchema);

module.exports = Result;
