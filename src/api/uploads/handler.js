class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUploadImageHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateImageHeaders(data.hapi.headers);
    const fileLocation = await this._service.writeFile(data, data.hapi);

    return h
      .response({
        status: 'success',
        data: {
          fileLocation,
        },
      })
      .code(201);
  }
}

module.exports = UploadsHandler;
