require('dotenv').config();

const Hapi = require('@hapi/hapi');
const notes = require('./api/notes/index');
const NotesServices = require('./services/postgres/NotesService');
const NotesValidator = require('./validator/notes/index');

const init = async () => {
  const notesService = new NotesServices();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
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
