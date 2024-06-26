import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateComments1716618898624 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 升级数据库
        return await queryRunner.createTable(
          new Table({
            name: "comments",
            columns: [
              {
                name: "id",
                type: "int",
                isPrimary: true,
                isGenerated: true,
                generationStrategy: "increment",
              },
              
              {
                name: "content",
                type: "text",
              },
              {
                name: "user_id",
                type: "int",
              },{
                name: "post_id",
                type: "int",
              },
            ],
          })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // 降级数据库
        return await queryRunner.dropTable("comments");
    }
}
