const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const mapDBToModel = require('../../utils');
const { InvariantError, NotFoundError, AuthorizationError } = require('../../exceptions');

class NotesService {
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  async addNote({ title, tags, body, owner }) {
    const id = `note-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO notes VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, tags, body, createdAt, updatedAt, owner],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Catatan gagal ditamahkan');
    }

    await this._cacheService.delete(`notes:${owner}`);
    return result.rows[0].id;
  }

  async getNotes(owner) {
    try {
      const cachedResult = await this._cacheService.get(`notes:${owner}`);
      return JSON.parse(cachedResult);
    } catch (error) {
      const query = {
        text: `SELECT notes.* FROM notes
            LEFT JOIN collaborations ON collaborations.note_id = notes.id
            WHERE notes.owner = $1 OR collaborations.user_id = $1
            GROUP BY notes.id`,
        values: [owner],
      };

      const result = await this._pool.query(query);
      const mappedResult = result.rows.map(mapDBToModel);

      await this._cacheService.set(`notes:${owner}`, JSON.stringify(mappedResult));

      return mappedResult;
    }
  }

  async getNoteById(id) {
    const query = {
      text: `SELECT notes.*, users.username FROM notes
            LEFT JOIN users ON users.id = notes.owner
            WHERE notes.id = $1`,
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    return result.rows.map(mapDBToModel)[0];
  }

  async editNoteById(id, { title, tags, body }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE notes SET title = $1, tags = $2, body = $3, updated_at = $4 WHERE id = $5 RETURNING id, owner',
      values: [title, tags, body, updatedAt, id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Gagal memperbarui catatan. ID tidak ditemukan');
    }

    const { owner } = result.rows[0];
    await this._cacheService.delete(`notes:${owner}`);
  }

  async deleteNoteById(id) {
    const query = {
      text: 'DELETE FROM notes WHERE id = $1 RETURNING id, owner',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Catatan gagal dihapus. ID tidak ditemukan');
    }

    const { owner } = result.rows[0];
    await this._cacheService.delete(`notes:${owner}`);
  }

  async verifyNoteOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM notes WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Resource yang Anda minta tidak ditemukan');
    }

    const { owner: noteOwner } = result.rows[0];
    if (noteOwner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async verifyNoteAccess(noteId, userId) {
    try {
      await this.verifyNoteOwner(noteId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      try {
        await this._collaborationsService.verifyCollaborator(noteId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = NotesService;
