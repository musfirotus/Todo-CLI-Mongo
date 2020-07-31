const mongoose = require('mongoose')
const todoModel = require('./models/todoModel')
const db = require('./config/db')
const { program } = require('@caporal/core')
const prompt = require('prompt-sync')({sigint: true});

program.version("1.0.0").description("ToDoList-CLI-APP-MongoDB");

// Tampilkan Data Todo List
const listTodo = async () => {
    const listTodo = await todoModel.find();
    Object.values(listTodo).forEach(lis=>{
        if(lis.cek == true) console.log( `${lis._id}. ${lis.item}. (Done)`);
        else if(lis.cek == false) console.log(`${lis._id}. ${lis.item}.`);
        else console.log('Error');
    })
    await mongoose.disconnect();
    console.log(`Disconnect!`);
}

// Check if error
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
    .action(async ({ args }) => {
        const todo = new todoModel ({ _id: args.addid, item: args.add}, error);
        await todo.save();
        await listTodo();
    })

    // Update todo list
    // How to run : node index.js todo update <id> <item>
    .command('todo update', 'Edit entri todo')
    .argument('<updateId>', 'id yang ingin diedit')
    .argument('<update>', 'Hasil yang diedit')
    .action(async ({ args }) => {
        await todoModel.updateOne(
            { _id:args.updateId },
            { item:args.update },
            error
        )
        await listTodo();
    })

    // Delete todo list
    // How to run : node index.js todo del <id>
    .command('todo del', 'Hapus salah satu todo list')
    .argument('<deleteId>', 'id yang ingin di delete')
    .action(async ({ args }) => {
        await todoModel.deleteOne(
            { _id:args.deleteId },
            error
        )
        await listTodo();
    })

    // Clear all todo list
    // How to run : node index.js todo clear
    .command('todo clear', 'Hapus semua data todo list')
    .action(async () => {
        const answer = prompt('Apakah Anda yakin menghapus semua todo list? (y/N) : ');
        if(answer == "y" || answer == "Y") {
            (async()=>{
                await todoModel.deleteMany({}, error)
                console.log('Data berhasil dihapus!');
                await listTodo();
            })();
        } else if(answer == "n" || answer == "N") {
            console.log('Batal menghapus!');
            await listTodo();
        } else {
            console.log(`Error : ${error}`);
        }
    })

    // Update status todo list ke status 'Done'
    // How to run : node index.js todo done <id>
    .command('todo done', 'Edit status menjadi \'Done\'')
    .argument('<updateId>', 'id yang ingin diedit')
    .action(async ({ args }) => {
        await todoModel.updateOne(
            { _id: args.updateId },
            { cek: true },
            error
        )
        await listTodo();
    })

    // Update status todo list ke status 'Undone'
    // How to run : node index.js todo undone <id>
    .command('todo undone', 'Edit status menjadi \'Undone\'')
    .argument('<updateId>', 'id yang ingin diedit')
    .action(async ({ args }) => {
        await todoModel.updateOne(
            { _id: args.updateId },
            { cek: false },
            error
        )
        await listTodo();
    })
    
program.run();