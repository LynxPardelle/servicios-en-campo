import test from 'node:test';
import assert from 'node:assert/strict';
import {handler} from './index.mjs';
test('health identifies the selected environment and rejects an invalid one',async()=>{
 const original=process.env.STAGE;
 try{
  for(const stage of ['development','testing','production']){
   process.env.STAGE=stage;const response=await handler();
   assert.equal(response.statusCode,200);assert.equal(JSON.parse(response.body).stage,stage);
   assert.equal(response.headers['cache-control'],'no-store');
  }
  process.env.STAGE='unknown';assert.equal((await handler()).statusCode,503);
 }finally{if(original===undefined)delete process.env.STAGE;else process.env.STAGE=original;}
});
