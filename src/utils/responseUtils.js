const successResponse = (res, message = "operation successful") => {
  const dataData = {
    success: true,
    message,
  };
  return res.status(200).json(dataData);
};

const successResponseWithData = (res, data) => {
  const resDataData = {
    data,
  };
  return res.status(200).json(resDataData);
};

const successResponseWithMsgAndData = (res, data, message) => {
  const resDataData = {
    success: true,
    message,
    data,
  };
  return res.status(200).json(resDataData);
};

const errorResponse = (res, message = "internal server error") => {
  const dataData = {
    success: false,
    message,
  };
  return res.status(500).json(dataData);
};

const notFoundResponse = (res, message = "resource not found") => {
  const dataData = {
    success: false,
    message,
  };
  return res.status(404).json(dataData);
};

const validationError = (res, message = "invalid data") => {
  const resDataData = {
    success: false,
    message,
  };
  return res.status(400).json(resDataData);
};

const validationErrorWithData = (res, data, message = "invalid data") => {
  const resDataData = {
    success: false,
    message,
    data,
  };
  return res.status(400).json(resDataData);
};

const unauthorizedResponse = (res, message = "unauthorized request") => {
  const dataData = {
    success: false,
    message,
  };
  return res.status(401).json(dataData);
};



module.exports = {
  successResponse,
  successResponseWithData,
  successResponseWithMsgAndData,
  errorResponse,
  notFoundResponse,
  validationErrorWithData,
  unauthorizedResponse,
  validationError,
};