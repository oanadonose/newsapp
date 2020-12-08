import * as knex from "knex";

export const seed = async(knex) => {
    // Deletes ALL existing entries
    await knex("users").del();
    // Inserts seed entries
    await knex("users").insert([
        { name: "test1", email: "test1@mail.com", password: "test1" },
        { name: "test2", email: "test2@mail.com", password: "test2" },
        { name: "testadmin", email: "testadmin@mail.com", password: "testadmin", admin: 1 }
    ]);
};
