import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePosts1716618643582 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 升级数据库
    return await queryRunner.createTable(
      new Table({
        name: "posts",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "title",
            type: "varchar",
          },
          {
            name: "content",
            type: "varchar",
          },
          {
            name: "uuid",
            type: "varchar",
          },
          {
            name: "author_id",
            type: "int",
          },
          {
            name: "likesUserId",
            type: "varchar",
            isArray: true,
            isNullable: true,
          },
          {
            name: "likesAmt",
            type: "int",
            isNullable: true,
          },
        ],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 降级数据库
    return await queryRunner.dropTable("posts");
  }
}
