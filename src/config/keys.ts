const keys = {
    PORT: process.env.PORT || 4000,
    MORGAN_DEV: process.env.MORGAN_DEV || 'dev',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/budgetingdb',
    JWT: process.env.JWT || 'test',
    URL: process.env.URL || 'http://localhost:3000'
};
export default keys;
