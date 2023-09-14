
const defaultRoute = (req, res) => {
    res.send('hello');
}

const sierraRoute = (req, res) =>{
    res.send('Sierra Wamsley');
}

const hannahRoute = (req, res) =>{
    res.send('Hanna Birch');
}

module.exports = {
    defaultRoute,
    hannahRoute,
    sierraRoute,
};