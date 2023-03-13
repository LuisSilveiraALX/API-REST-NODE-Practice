const mongoose = require('mongoose');

const connection = async() => {

    try {

        mongoose.connect('mongodb+srv://lsgaming98:cocacola123@cluster0.l7ixjts.mongodb.net/my_blog')

    } catch (error) {
        console.log(error);
        throw new Error('Database connection error')
    }

}