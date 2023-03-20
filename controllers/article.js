
const test = (req, res) => {
    return res.status(200).json({
        mensaje: "test"
    })
}

const course = (request, response) => {

    console.log('Ejecute endpoint test')
    return response.status(200).send({
        autor: "Luis Silveira"
    });
};

const create = (req, res) => {

    return res.status(200).json({
        message: 'Save action'
    })
}

module.exports = {
    test,
    course,
    create
}