document.addEventListener('DOMContentLoaded', async ()=>{
    try{
        const cookieJWT= document.cookie.split("; ").find(cookie=>cookie.startsWith("jwt=")).slice(4);
        window.location.href="/cop"
    }catch{
        console.log('no hay cookie')
}
})