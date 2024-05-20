const { error } = require("@hapi/joi/lib/base")



async function fun1(){
    //console.log('func1')
    throw 'kk'
    //throw 'error ko'
}

async function fun2(stIn){ 
    return 'return1'+stIn   
}




fun2('hhehehe').then(temp=>{   
    
    console.log(temp)

    fun1().then(()=>{
        console.log('hh')
    }).catch(error=>{
        console.log('akong error'+error)
    })
   
}).catch(error=>{
    console.log(error)
})


