import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {stageForBranch,validateEnvironments} from './check-config.mjs';
const baseline=JSON.parse(await readFile(new URL('../infra/environments.json',import.meta.url),'utf8'));
test('only environment branches map to deployment stages',()=>{
 assert.equal(stageForBranch('main'),'production');assert.equal(stageForBranch('testing'),'testing');assert.equal(stageForBranch('development'),'development');
 for(const ref of ['feature/example','production','refs/tags/testing',''])assert.throws(()=>stageForBranch(ref));
 assert.equal(validateEnvironments(baseline),baseline);
});
test('a wrong lane or a shared stack is rejected',()=>{
 const wrong=structuredClone(baseline);wrong.production.branch='development';assert.throws(()=>validateEnvironments(wrong));
 const shared=structuredClone(baseline);shared.testing.stackName=shared.development.stackName;assert.throws(()=>validateEnvironments(shared));
});
