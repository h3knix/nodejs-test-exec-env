#!/usr/bin/env node

process.env.unique_env_test_variable = 'env inherited';
const child_process = require('child_process');
const ops = {};
//ops.env = {};

function assert_test(fnc){
  return new Promise(fnc)
  .then(()=>console.log('✓ no env'))
  .catch(()=>console.log('❗ env got passed'))
  .then(()=>console.log("-------------------------------------------------------------\n"))
}

(async ()=>{

  console.log('++ testing child_process.exec()');
  await assert_test((resolve,reject)=>{
    let child = child_process.exec(process.execPath +' sub_process.js',ops,(err,stdout)=>{
      console.log(stdout);
    });
    child.on('close',(code,stdout)=>{
      console.log(code);
      if ( code ) reject();
      else resolve();
    });
  });


  console.log('++ testing child_process.execFile()');
  await assert_test((resolve,reject)=>{
    let child = child_process.execFile('./sub_process.js',ops,(err,stdout)=>{
      console.log(stdout);
    });
    child.on('close',(code)=>{
      console.log(code);
      if ( code ) reject();
      else resolve();
    });
  });


  console.log('++ testing child_process.fork()');
  await assert_test((resolve,reject)=>{
    let child = child_process.fork('./sub_process.js',ops);
    child.on('close',(code)=>{
      console.log(code);
      if ( code ) reject();
      else resolve();
    });
  });


  console.log('++ testing child_process.spawn()');
  await assert_test((resolve,reject)=>{
    let child = child_process.spawn(process.execPath,['./sub_process.js'],ops);
    child.stdout.on('data',(data)=>{
      console.log(data +'');
    });
    child.on('close',(code)=>{
      console.log(code);
      if ( code ) reject();
      else resolve();
    });
  });


  console.log('++ testing child_process.execFileSync()');
  await assert_test((resolve,reject)=>{
    child_process.execFileSync('./sub_process.js',{ stdio: 'inherit', ...ops });
  });


  console.log('++ testing child_process.spawnSync()');
  await assert_test((resolve,reject)=>{
    let ret = child_process.spawnSync(process.execPath,['./sub_process.js'],ops);
    console.log(ret.stdout +'');
    console.log(ret.status);
    if ( ret.status ) reject();
    else resolve();
  });


})()
.then(()=>process.exit())
