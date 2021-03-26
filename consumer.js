const amqp = require('amqplib')

async function connect () {
    try{
        const queueName = "jobs"
        const connection = await amqp.connect("amqp://localhost:5672")
        console.log({connection})

        const channel = await connection.createChannel()
        console.log({channel})

        const result = await channel.assertQueue(queueName)
        console.log({result})

        channel.consume('jobs', message => {
            const input = JSON.parse(message.content.toString())
            console.log(input)

            // if(input.second >= 10){
                channel.ack(message)
            // }

        })

        console.log('Waiting form messages')
    } catch(ex) {
        console.error(ex)
    }
}

connect()