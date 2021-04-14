const amqp = require('amqplib')

const queueName = "task_queue"

async function connect () {
    try{
        const connection = await amqp.connect("amqp://localhost:5672")

        const channel = await connection.createChannel()

        await channel.assertQueue(queueName, { durable: true })

        channel.consume(queueName, message => {
            const input = JSON.parse(message.content.toString())
            const secs = input.seconds
            const id = input.id

            console.log(" [x] Received %s", input)
            setTimeout(function() {
                var isDone = Math.random() < 0.5

                if(!isDone) {
                    channel.nack(message)
                    console.log(" [x] Fail processing", id)

                    return
                }
                channel.ack(message)
                console.log(" [x] Done", id)
            }, secs * 500)
        }, { noAck: false })

        console.log('Waiting form messages')
    } catch(ex) {
        console.error(ex)
    }
}

connect()