const path = require('path');
const root = path.resolve(__dirname, '../');

module.exports = {
    root: root,
    src: root + '/src/',
    config: root + '/config/',
    dist: root + '/dist/',
    node: root + '/node_modules/',
    public: root + '/public/',
    indexHTML: root + "/public/index.html",
    indexTSX: root + '/src/index.tsx',
}