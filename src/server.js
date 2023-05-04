import Hapi from 'hapi';
import notes from './api/notes/index.js';
import NotesServices from './services/inMemory/NotesService.js';
import NotesValidator from './validator/notes/index.js';

const init = async () => {
  const notesService = new NotesServices();

  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: notes,
    options: {
      service: notesService,
      validator: NotesValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
