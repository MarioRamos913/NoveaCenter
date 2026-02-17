/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        id: 'id',
        username: { type: 'varchar(50)', notNull: true, unique: true },
        password: { type: 'varchar(255)', notNull: true },
        role: { type: 'varchar(20)', notNull: true, check: "role IN ('admin', 'user')" },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    }, {
        ifNotExists: true
    });
};

exports.down = pgm => {
    pgm.dropTable('users');
};
