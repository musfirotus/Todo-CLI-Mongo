const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Koneksi
const db = (async () => {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error!'));
    db.on('open', () => {
        console.log('Connected');
    })
})();

module.exports = db;