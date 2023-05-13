class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  async postUserHandler(request, h) {
    this._validator.validateUserPayload(request.payload);
    const userId = await this._service.addUser(request.payload);
    return h
      .response({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: { userId },
      })
      .code(201);
  }

  async getUsersByUsernameHandler(request) {
    const { username = '' } = request.query;
    const users = await this._service.getUsersByUsername(username);

    return {
      status: 'success',
      data: {
        users,
      },
    };
  }

  async getUserByIdHandler(request) {
    const user = await this._service.getUserById(request.params.id);
    return {
      status: 'success',
      data: { user },
    };
  }
}

module.exports = UsersHandler;
