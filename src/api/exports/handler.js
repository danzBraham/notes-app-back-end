class ExportsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  postExportNotesHandler(request, h) {
    this._validator.validateExportNotesPayload(request.payload);

    const message = {
      userId: request.auth.credentials.id,
      targetEmail: request.payload.targetEmail,
    };
    this._service.sendMessage('export:notes', JSON.stringify(message));

    return h
      .repsonse({
        status: 'success',
        message: 'Permintaan Anda dalam antrean',
      })
      .code(201);
  }
}

module.exports = ExportsHandler;
