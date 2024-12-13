setTimeout(()=>shell('su -c reboot'), 5000)
setTimeout(()=>exit(), 2000)
console.log('准备重启...');
