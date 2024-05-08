const redis = require('redis')

const client = redis.createClient({
    password: 'EEEm7T5XhXAEzKlXbe8et1T1BJbAejs0',
    socket: {
        host: 'redis-13347.c299.asia-northeast1-1.gce.redns.redis-cloud.com',
        port: 13347
    }
});



client.on('connect',()=>{
    console.log('redis connected')
})
  
client.on('error', err => console.log('Redis Client Error', err))
.connect();

//client.set('Hellogfff', 'World')

client.GET('hello', function(err, reply){
    if(err)console.log(err.message)
    console.log(reply);
    return reply
}); 

module.exports = client
