const routes = (handler) => [
  {
    method: 'POST',
    path: '/notes',
    handler: (request, h) => handler.postNoteHandler(request, h),
  },
  {
    method: 'GET',
    path: '/notes',
    handler: () => handler.getNotesHandler(),
  },
  {
    method: 'GET',
    path: '/notes/{id}',
    handler: (request) => handler.getNoteByIdHandler(request),
  },
  {
    method: 'PUT',
    path: '/notes/{id}',
    handler: (request) => handler.putNoteByIdHandler(request),
  },
  {
    method: 'DELETE',
    path: '/notes/{id}',
    handler: (request) => handler.deleteNoteByIdHandler(request),
  },
];

module.exports = routes;
