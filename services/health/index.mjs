export async function handler() {
 const stage=process.env.STAGE ?? 'development';
 const headers={'content-type':'application/json','cache-control':'no-store'};
 if(!['development','testing','production'].includes(stage)) return {statusCode:503,headers,body:JSON.stringify({status:'unavailable'})};
 return {statusCode:200,headers,body:JSON.stringify({status:'ok',service:process.env.PRODUCT_SLUG ?? 'local',stage})};
}
