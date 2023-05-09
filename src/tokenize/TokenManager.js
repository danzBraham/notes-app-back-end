const Jwt = require('@hapi/jwt');
const { InvariantError } = require('../exceptions');

const TokenManager = {
  generateAccessToken: (payload) => Jwt.token.generate(payload, process.env.ACCESS_TOKEN_KEY),
  generateRefreshToken: (payload) => Jwt.token.generate(payload, process.env.REFRESH_TOKEN_KEY),
  verifyRefreshToken: (refreshToken) => {
    try {
      const artifatcs = Jwt.token.decode(refreshToken);
      Jwt.token.verifySignature(artifatcs, process.env.REFRESH_TOKEN_KEY);
      const { payload } = artifatcs.decoded;
      return payload;
    } catch (error) {
      throw new InvariantError('Refresh Token tidak valid');
    }
  },
};

module.exports = TokenManager;
