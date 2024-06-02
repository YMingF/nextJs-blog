import { MigrationInterface, QueryRunner, TableIndex } from "typeorm";

export class AddUniqueUsernameToUsers1717315672804
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "user_name",
        columnNames: ["username"],
        isUnique: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("users", "user_name");
  }
}
