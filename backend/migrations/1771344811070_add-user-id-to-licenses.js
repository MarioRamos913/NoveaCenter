exports.shorthands = undefined;

exports.up = pgm => {
    pgm.addColumn('licenses', {
        user_id: {
            type: 'integer',
            references: '"users"',
            onDelete: 'SET NULL',
            default: null,
        },
    });
    pgm.createIndex('licenses', 'user_id');
};

exports.down = pgm => {
    pgm.dropColumn('licenses', 'user_id');
};
