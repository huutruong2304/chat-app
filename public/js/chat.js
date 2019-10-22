//client side
// this will emit information, activities of clients to server


// const Mustache = require('mustache')
const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML
    //Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

//autoscroll page
const autoscroll = () => {
    // new message element
    // const $newMessage = $messages.lastElementChild

    // //height of the message
    // const newMessageStyles = getComputedStyle($newMessage)
    // const newMessageMargin = parseInt(newMessageStyles.margin)
    // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // // visible height
    // const visibleHeight = $messages.offsetHeight

    // //height of messages container
    // const containerHeight = $messages.scrollHeight

    // //How far have I scrolled!
    // const scrollOfSet = $messages.scrollTop + visibleHeight

    // if (containerHeight - newMessageHeight >= scrollOfSet) {
    $messages.scrollTop = $messages.scrollHeight
        // }

}




// receive messages's info from server to process
socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//process curent location infor from server
socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('hh:mm A')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

// hanlde submit btn to send messages
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
        //disable button
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = $messageFormInput.value

    socket.emit('sendMessage', message, (error) => {
        //enable btn
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error) {
            return console.log(error)
        }

        console.log('Message delivered!')
    })
})

// handle click send location 
$sendLocationButton.addEventListener('click', () => {
    $sendLocationButton.setAttribute('disabled', 'disabled')

    if (!navigator.geolocation) {
        return alert('Geolocation is not supported on your browser!')
    }

    //xác nhận allow location
    navigator.geolocation.getCurrentPosition(position => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location shared!')

        })
    })
})

//a client accept to join room chat
socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }
})


// render user list
socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    $sidebar.innerHTML = html
})