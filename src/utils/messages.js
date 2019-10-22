const generateMessage = (text, username = 'Admin') => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (coords, username) => {
    return {
        username,
        url: 'https://www.google.com/maps?q=' + coords.latitude + ',' + coords.longitude,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}