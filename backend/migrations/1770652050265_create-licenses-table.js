/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.createTable('licenses', {
        key: {
            type: 'varchar(255)',
            primaryKey: true,
            notNull: true,
        },
        first_name: {
            type: 'varchar(100)',
            notNull: true,
        },
        last_name: {
            type: 'varchar(100)',
            notNull: true,
        },
        id_number: {
            type: 'varchar(50)',
            notNull: true,
        },
        business_name: {
            type: 'varchar(150)',
        },
        sector: {
            type: 'varchar(100)',
        },
        software: {
            type: 'varchar(50)',
            notNull: true,
        },
        status: {
            type: 'varchar(20)',
            notNull: true,
        },
        expiration_date: {
            type: 'timestamp',
            notNull: true,
        },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP'),
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('licenses');
};
