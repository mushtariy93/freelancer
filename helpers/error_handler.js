const errorHandler = (res, error) => {
  console.log("Internal error server");
  res.status(400).send({ error: error.message });
};
module.exports = { errorHandler };
