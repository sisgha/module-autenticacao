import {MigrationInterface, QueryRunner, Table} from 'typeorm';

export class TableUsuario1698605107135 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario',

        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },

          // ...

          {
            name: 'nome',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'email',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'matricula_siape',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'flag_seed_super_usuario',
            type: 'boolean',
            default: 'FALSE',
          },

          // ...

          {
            name: 'date_created',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'date_updated',
            type: 'timestamptz',
            default: 'now()',
            isNullable: false,
          },

          {
            name: 'date_deleted',
            type: 'timestamptz',
            isNullable: true,
          },
        ],
      }),
    );

    await queryRunner.query(`
      CREATE TRIGGER db_usuario_change_date_updated 
        BEFORE UPDATE ON usuario FOR EACH ROW EXECUTE PROCEDURE 
        update_date_updated_column();
    `);

    await queryRunner.query(`
      CREATE TRIGGER db_usuario_track 
        AFTER INSERT OR UPDATE OR DELETE ON usuario
        FOR EACH ROW EXECUTE PROCEDURE change_trigger();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuario', true);
  }
}
