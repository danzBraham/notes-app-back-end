export const up = async (pgm) => {
  await pgm.createTable('notes', {
    id: {
      type: 'varchar(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    tags: {
      type: 'TEXT[]',
      notNull: true,
    },
    body: {
      type: 'TEXT',
      notNull: true,
    },
    created_at: {
      type: 'TEXT',
      notNull: true,
    },
    updated_at: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

export const down = async (pgm) => {
  await pgm.dropTable('notes');
};
