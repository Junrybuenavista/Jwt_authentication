



function fac(n){
    console.log('d')
    if(n===0){
        return 1
    }
    else{
        return n * fac(n - 1)
    }
}
console.log(fac(-1))