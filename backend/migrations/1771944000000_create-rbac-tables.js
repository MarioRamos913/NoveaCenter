/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    // Tabla de roles
    pgm.createTable('roles', {
        id: 'id',
        name: { type: 'varchar(50)', notNull: true, unique: true },
        description: { type: 'varchar(255)' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Tabla de recursos
    pgm.createTable('resources', {
        id: 'id',
        name: { type: 'varchar(100)', notNull: true },
        code: { type: 'varchar(100)', notNull: true, unique: true },
        route: { type: 'varchar(255)' },
        description: { type: 'varchar(255)' },
        created_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    });

    // Relación user <-> role (many-to-many)
    pgm.createTable('user_roles', {
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        role_id: {
            type: 'integer',
            notNull: true,
            references: '"roles"',
            onDelete: 'CASCADE',
        },
    });
    pgm.addConstraint('user_roles', 'user_roles_pkey', {
        primaryKey: ['user_id', 'role_id'],
    });
    pgm.createIndex('user_roles', 'user_id');
    pgm.createIndex('user_roles', 'role_id');

    // Relación role <-> resource (many-to-many)
    pgm.createTable('role_resources', {
        role_id: {
            type: 'integer',
            notNull: true,
            references: '"roles"',
            onDelete: 'CASCADE',
        },
        resource_id: {
            type: 'integer',
            notNull: true,
            references: '"resources"',
            onDelete: 'CASCADE',
        },
    });
    pgm.addConstraint('role_resources', 'role_resources_pkey', {
        primaryKey: ['role_id', 'resource_id'],
    });
    pgm.createIndex('role_resources', 'role_id');
    pgm.createIndex('role_resources', 'resource_id');

    // Seed: roles base
    pgm.sql(`INSERT INTO roles (name, description) VALUES ('admin', 'Administrador del sistema')`);
    pgm.sql(`INSERT INTO roles (name, description) VALUES ('user', 'Usuario estándar')`);

    // Seed: recursos base del sistema
    pgm.sql(`INSERT INTO resources (name, code, route, description) VALUES
        ('Dashboard', 'dashboard', '/dashboard', 'Panel principal'),
        ('Licencias', 'licenses', '/dashboard/licenses', 'Gestión de licencias'),
        ('Usuarios', 'users', '/dashboard/users', 'Gestión de usuarios'),
        ('Roles', 'roles', '/dashboard/roles', 'Gestión de roles'),
        ('Recursos', 'resources', '/dashboard/resources', 'Gestión de recursos')
    `);

    // Asignar todos los recursos al rol admin
    pgm.sql(`INSERT INTO role_resources (role_id, resource_id)
        SELECT r.id, res.id FROM roles r, resources res WHERE r.name = 'admin'`);

    // Asignar recursos básicos al rol user
    pgm.sql(`INSERT INTO role_resources (role_id, resource_id)
        SELECT r.id, res.id FROM roles r, resources res
        WHERE r.name = 'user' AND res.code IN ('dashboard', 'licenses')`);

    // Migrar usuarios existentes según su campo role actual
    pgm.sql(`INSERT INTO user_roles (user_id, role_id)
        SELECT u.id, r.id FROM users u JOIN roles r ON u.role = r.name
        ON CONFLICT DO NOTHING`);
};

exports.down = pgm => {
    pgm.dropTable('role_resources');
    pgm.dropTable('user_roles');
    pgm.dropTable('resources');
    pgm.dropTable('roles');
};
