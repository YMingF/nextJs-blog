import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreatePost1716213239211 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 升级数据库
    return await queryRunner.createTable(
      new Table({
        name: "Posts",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "title", type: "varchar" },
          { name: "content", type: "text" },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 降级
    return await queryRunner.dropTable("Posts") ;
  }
}
