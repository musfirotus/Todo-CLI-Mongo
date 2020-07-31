const mongoose = require('mongoose')
const todoModel = require('./models/todoModel')
const db = require('./config/db')
const { program } = require('@caporal/core')
// const { prompt } = require('prompt')

program.version("1.0.0").description("ToDoList-CLI-APP-MongoDB");

// Tambah Banyak Data Todo List
const insertMany = async () => {
    const insertMany = await todoModel.insertMany([
        { item: "Makan siang", cek: true },
        { item: "Cuci pakaian" }
    ]);
}

// Tampilkan Data Todo List
const listTodo = async () => {
    const listTodo = await todoModel.find();
    Object.values(listTodo).forEach(lis=>{
        if(lis.cek == true) console.log( `${lis._id}. ${lis.item}. (Done)`);
        else if(lis.cek == false) console.log(`${lis._id}. ${lis.item}.`);
        else console.log('Error');
    })
    mongoose.disconnect();
}

const error = (error, result)=>{
    console.log(error, result);
}

program
    // Tampilkan todo list
    // How to run : node index.js todo list
    .command('todo list', 'Show all todo list')
    .action(()=>{
        listTodo();
    })

    // Tambah data todo list
    // How to run :
    // step 1 : node index.js todo list (untuk melihat id yg belum ada)
    // step 2 : node index.js todo add <id> <item>
    .command('todo add', 'Add todo list in database')
    .argument('<addid>', "Add todo to db")
    .argument('<add>', "Add todo to db")
    .action(({ args }) => {
        (async () => {
            const todo = new todoModel ({ _id: args.addid, item: args.add }, error);
            await todo.save();
            await listTodo();
        })();
    })

    // Update todo list
    // How to run :
    .command('todo update', 'Edit entri todo')
    .argument('updateId', 'id yang ingin diedit')
    .argument('update', 'Hasil yang diedit')
    .action(({ args }) => {
        (async () => {
            await todoModel.updateOne(
                { _id:args.updateId },
                { item:args.update },
                error
            )
            listTodo();
        })();
    })
    
program.run();
