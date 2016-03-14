module.exports = {
    api: {
        version: 'v1',
        token: 'fD91yZ78668z7q98o0SkQOhx2V67eyg1'
    },
    environment: {
        port: process.env.PORT || 4711,
        production: (process.env.NODE_ENV !== 'dev')
    }
};
