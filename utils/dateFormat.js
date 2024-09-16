// Utility function / formating dates

const dateFormat =(timestamp) => {
    return new Date(timestamp).toISOString();
};

module.exports = dateFormat;

