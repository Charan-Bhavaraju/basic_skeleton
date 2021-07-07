//function to handle async function's errors
//wrap this around all async functions

module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}