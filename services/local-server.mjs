process.env.PRODUCT_SLUG ??= 'servicios-en-campo';
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {handler} from './health/index.mjs';
export function createLocalServer(){
 return createServer(async(req,res)=>{
  if(req.method==='GET'&&req.url==='/api/health'){const result=await handler();res.writeHead(result.statusCode,result.headers);res.end(result.body);return;}
  res.writeHead(404,{'content-type':'application/json'});res.end(JSON.stringify({error:'not_found'}));
 });
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const server=createLocalServer();const port=Number(process.env.PORT ?? 4201);
 server.listen(port,'127.0.0.1',()=>console.log('API local http://127.0.0.1:'+server.address().port+'/api/health'));
 for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close());
}