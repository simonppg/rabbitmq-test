const amqp = require('amqplib')

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getChannel() {
    const connection = await amqp.connect("amqp://localhost:5672")

    const channel = await connection.createChannel()
    return channel
}

async function publish(channel, msg) {
    const queueName = "task_queue"
    await channel.assertQueue(queueName, { durable: true })

    const wasSent = channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(msg)),
        { persistent: true })

    if (wasSent) {
        console.log('message send successfully', msg)
    } else {
        console.log('Can not send the message')
    }
}

async function run () {
    const msg = {
        message: 'this is the message'
    }

    const channel = await getChannel()

    for (let i = 1; i <= 5; i++) {
        await sleep(1000);
        console.log('sending message: '+i)
        await publish(channel, {
            ...msg,
            id: i,
            seconds: new Date().getSeconds()
        })
    }

    console.log('All messages had been send')
}

run()


