import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
export const lanes=Object.freeze({development:'development',testing:'testing',production:'main'});
export function stageForBranch(branch){
 const stage=Object.entries(lanes).find(([,expected])=>expected===branch)?.[0];
 if(!stage)throw new Error('Branch is not an environment lane: '+branch);
 return stage;
}
export function validateEnvironments(environments){
 if(Object.keys(environments).sort().join(',')!==Object.keys(lanes).sort().join(','))throw new Error('Exactly three environments required');
 const stacks=new Set();
 for(const [stage,branch]of Object.entries(lanes)){
  const value=environments[stage];
  if(value.branch!==branch||value.stage!==stage||value.samConfigEnv!==stage)throw new Error('Wrong mapping for '+stage);
  if(typeof value.stackName!=='string'||!value.stackName.endsWith('-'+stage)||stacks.has(value.stackName))throw new Error('Stacks must be isolated');
  stacks.add(value.stackName);
 }
 return environments;
}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const environments=validateEnvironments(JSON.parse(await readFile(new URL('../infra/environments.json',import.meta.url),'utf8')));
 const branch=process.argv[2];
 if(branch)console.log(JSON.stringify(environments[stageForBranch(branch)]));
 else console.log('Three isolated environments verified.');
}
