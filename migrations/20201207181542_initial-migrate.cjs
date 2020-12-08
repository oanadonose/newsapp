
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments() // 'id' field
    tbl.text('name', 128)
       .notNullable()
    tbl.text('email',128)
       .notNullable()
    tbl.unique('email')
    tbl.text('password', 128)
       .notNullable()
    tbl.integer('points')
       .notNullable()
       .defaultTo(0)
    tbl.integer('admin')
       .notNullable()
       .defaultTo(0)
    tbl.integer('subscribed')
       .notNullable()
       .defaultTo(0)
    tbl.timestamps(true, true)
  })
  .createTable('news', tbl => {
    tbl.increments()
    tbl.string('title')
       .notNullable()
       .index()
    tbl.text('article')
       .notNullable()
    tbl.text('photo')
       .notNullable()
    tbl.string('status')
       .notNullable()
       .defaultTo('pending')
    //foreign key info to users table
    tbl.integer('userid')
       .unsigned()
       .notNullable()
       .references('id')
       .inTable('users')
       .onDelete('CASCADE')
       .onUpdate('CASCADE')
       
    tbl.timestamps(true, true)
  })
  
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
  .dropTableIfExists('news')
};
