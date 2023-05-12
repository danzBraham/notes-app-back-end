/* eslint-disable camelcase */

const mapDBToModel = ({
  id,
  title,
  tags,
  body,
  created_at,
  updated_at,
  owner
}) => ({
  id,
  title,
  tags,
  body,
  createdAt: created_at,
  updatedAt: updated_at,
  owner
});

module.exports = mapDBToModel;
