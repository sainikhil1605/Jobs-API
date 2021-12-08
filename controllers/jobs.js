const Job = require('../models/Jobs');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt');
  res.status(StatusCodes.OK).send({ jobs, count: jobs.length });
};
const getJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const jobs = await Job.findOne({ _id: jobId, createdBy: userId });
  res.status(StatusCodes.OK).send({ jobs });
};
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).send({ job });
};
const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if (!company || !position) {
    throw new BadRequestError('company or position is missing');
  }
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    { company, position },
    { new: true }
  );
  res.status(StatusCodes.OK).send({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  const job = Job.findOneAndDelete({ _id: jobId, createdBy: userId });
  if (!job) {
    res.send(new NotFoundError('Job not found'));
  }
  res.status(StatusCodes.OK).send({ msg: 'Job deleted successfully' });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
