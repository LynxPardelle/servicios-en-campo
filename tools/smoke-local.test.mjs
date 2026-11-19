import test from 'node:test';
import assert from 'node:assert/strict';
import {createLocalServer} from '../services/local-server.mjs';
test('local HTTP uses the Lambda health contract and keeps business routes closed',async(t)=>{
 const server=createLocalServer();
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 t.after(()=>new Promise(resolve=>{server.close(resolve);server.closeAllConnections();}));
 const base='http://127.0.0.1:'+server.address().port;
 const health=await fetch(base+'/api/health');
 assert.equal(health.status,200);assert.equal((await health.json()).status,'ok');
 assert.equal((await fetch(base+'/api/orders')).status,404);
 assert.equal((await fetch(base+'/api/health',{method:'POST'})).status,404);
});