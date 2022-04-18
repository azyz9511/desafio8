
class Chat{
    
    constructor(table,options){
        this.table = table;
        this.options = options;
        this.knex = require('knex')(this.options);
    }

    newTable(){
        this.knex.schema.createTable(this.table,(table) => {
            table.string('email',200);
            table.string('texto',250);
            table.string('fyh',100);
        })
        .then(() => {
            console.log('tabla creada');
        })
        .catch((error) => {
            console.log('La tabla ya existe');
        });
            
    }

    addMessage(message){
        this.knex(this.table).insert(message)
        .then(() => {
            console.log('mensaje guardado');
        })
        .catch((error) => {
            console.log(error);
        });
    }

    readMessages(){
        const nuevoMensaje = this.knex.from(this.table).select('*')
        .then((data) => {
            return data;
        })
        .catch((error) => {
            return false;
        });
        return nuevoMensaje;
    }

}

module.exports = Chat;