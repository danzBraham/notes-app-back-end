const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/notes',
    handler: (request, h) => handler.postExportNotesHandler(request, h),
    options: {
      auth: 'notesapp_jwt',
    },
  },
];

module.exports = routes;
