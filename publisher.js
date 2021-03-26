const amqp = require('amqplib')

const msg = {
    message: 'this is the message',
    seconds: new Date().getSeconds()
}

async function connect () {
    try{
        const queueName = "jobs"
        const connection = await amqp.connect("amqp://localhost:5672")
        console.log({connection})

        const channel = await connection.createChannel()
        console.log({channel})

        const result = await channel.assertQueue(queueName)
        console.log({result})

        const wasSent = channel.sendToQueue(queueName, Buffer.from(JSON.stringify(msg)))

        if(wasSent) {
            console.log('message send successfully'+msg)
        }else {
            console.log('Can not send the message')
        }
    } catch(ex) {
        console.error(ex)
    }
}

connect()