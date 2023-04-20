const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Importa tu modelo de usuario

const migratePasswords = async () => {
    await mongoose.connect('mongodb+srv://admin:1234@cluster0.dkobmtv.mongodb.net/test', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    const users = await User.find({});

    for (const user of users) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        await user.save();
    }

    console.log('Las contraseñas han sido encriptadas y actualizadas en la base de datos');

    mongoose.connection.close();
};

migratePasswords();