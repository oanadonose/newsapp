
exports.up = function(knex) {
  return knex.schema.createTable('feedback', tbl => {
    tbl.increments()
    //fk to user
    tbl.integer('userid')
       .unsigned()
       .notNullable()
       .references('id')
       .inTable('users')
       .onDelete('CASCADE')
       .onUpdate('CASCADE')
    tbl.integer('newsid')
       .unsigned()
       .notNullable()
       .references('id')
       .inTable('news')
       .onDelete('CASCADE')
       .onUpdate('CASCADE')
    tbl.integer('rating')
       .notNullable()
    tbl.string('comment')
    
    tbl.timestamps(true, true)
  })
};

exports.down = function(knex) {
   return knex.schema.dropTableIfExists('feedback')
};
