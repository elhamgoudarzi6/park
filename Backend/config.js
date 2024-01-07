const path = require('path');
module.exports = {
    port: 3368,
    host: 'http://localhost:',
    uploadUrl: 'http://localhost:3368/',
    deleteUrl: 'D:/DEVELOP/Projects/parkapp/Backend/public/uploads/',
    secret: 'sadas@!$@#%!^#!GSDGETWT@#OI%J@#%!*#)^U#)^U!@)U',
    path: {
        controllers: {
            api: path.resolve('./modules/controllers'),
        },
        model: path.resolve('./modules/models'),
        controller: path.resolve('./modules/controllers'),
    }
}
