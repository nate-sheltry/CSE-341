
const path = require('path');


const defaultRoute = (req, res) => {
    res.send('hello');
}

const getProfessional = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../') + 'user.json')
}

const frontend = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../') + 'frontend/index.html')
}

const style = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../') + 'frontend/style.css')
}

const script = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../') + 'frontend/script.js')
}

module.exports = {
    defaultRoute,
    getProfessional,
    frontend,
    style,
    script
};

