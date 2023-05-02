import { nanoid } from 'nanoid';

export default class NotesServices {
  constructor() {
    this._notes = [];
  }

  addNote({ title, tags, body }) {
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

    this._notes.push(newNote);

    const isSuccess = this._notes.find((note) => note.id === id);
    if (!isSuccess) {
      throw new Error('Catatan gagal ditambahkan');
    }

    return id;
  }

  getNotes() {
    return this._notes;
  }

  getNoteById(id) {
    const note = this._notes.find((n) => n.id === id);
    if (!note) {
      throw new Error('Catatan tidak ditemukan');
    }
    return note;
  }

  editNoteById(id, { title, tags, body }) {
    const index = this._notes.findIndex((note) => note.id === id);
    const updatedAt = new Date().toISOString();

    if (index === -1) {
      throw new Error('Gagal memperbarui catatan. ID tidak ditemukan');
    }

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new Error('Catatan gagal dihapus. ID tidak ditemukan');
    }
    this._notes.splice(index, 1);
  }
}
