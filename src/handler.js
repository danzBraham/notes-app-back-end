import { nanoid } from 'nanoid';
// eslint-disable-next-line import/extensions
import notes from './notes.js';

export const addNoteHandler = (request, h) => {
  const { title, tags, body } = request.payload;
  const id = nanoid(16);
  const createdAt = new Date().toISOString();
  const updatedAt = createdAt;

  const newNote = {
    id,
    title,
    tags,
    body,
    createdAt,
    updatedAt,
  };

  notes.push(newNote);

  const isSuccess = notes.filter((note) => note.id === id > 0);

  if (!isSuccess) {
    return h
      .response({
        status: 'fail',
        message: 'Catatan gagal ditambahkan',
      })
      .code(500);
  }

  return h
    .response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId: id,
      },
    })
    .code(201);
};

export const getAllNotesHandler = () => ({
  status: 'success',
  data: {
    notes,
  },
});

export const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const note = notes.find((n) => n.id === id);

  if (note === undefined) {
    return h
      .response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
      })
      .code(404);
  }

  return {
    status: 'success',
    data: {
      note,
    },
  };
};

export const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. ID tidak ditemukan',
      })
      .code(404);
  }

  notes[index] = {
    ...notes[index],
    title,
    tags,
    body,
    updatedAt,
  };

  return h
    .response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    })
    .code(201);
};

export const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);

  if (index === -1) {
    return h
      .response({
        status: 'fail',
        message: 'Gagal menghapus catatan. ID tidak ditemukan',
      })
      .code(404);
  }

  notes.splice(index, 1);
  return h
    .response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    })
    .code(200);
};
