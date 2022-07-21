const { config } = require('dotenv');
const { execSync } = require('child_process');
const { NodeSSH } = require('node-ssh');

(async () => {
  const ssh = new NodeSSH();
  config();

  try {

    await ssh.connect({
      host: 'planning.infiltro.be',
      username: 'root',
      password: process.env.PASSWORD_SSH
    });


    if (process.argv.includes('frontend') || process.argv.includes('f')) {
      console.log('deploying frontend')
      await frontendDeploy()
    }

    if (process.argv.includes('backend') || process.argv.includes('b')) {
      console.log('deploying backend')
      await backendDeploy()
    }

    if (!process.argv.includes('frontend') && !process.argv.includes('backend') && !process.argv.includes('f') && !process.argv.includes('b')) {
      console.log('deploying frontend and backend')
      await frontendDeploy()
      await backendDeploy()
    }
  } catch (error: any) {
    console.log(error)
  }

  process.exit();


  async function frontendDeploy() {
    // build angular
    const stdout = execSync(`npx nx run frontend:build:production`);

    console.log(`ng build: ${stdout}`);

    try {
      console.log(await ssh.exec('rm *.js *.css', [], { cwd: '/root/app', stream: 'stdout' }));
    } catch (error) {
      console.log(error);
    }

    // delay(5000);
    // return;

    const failed: any = [];
    const successful: any = [];

    const status = await ssh.putDirectory('./dist/packages/frontend', '/root/app', {
      recursive: true,
      concurrency: 10,
      tick: (localPath, _, error) => (error) ? failed.push(localPath) : successful.push(localPath)
    })

    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful');
    // console.log('successful transfers', successful);
    console.log('failed transfers', failed);
  }

  async function backendDeploy() {
    // build typescript
    const stdout = execSync(`npx nx run backend:build:production`);

    console.log(`build: ${stdout}`);

    const failed: any = [];
    const successful: any = [];

    const status = await ssh.putDirectory('./dist/packages/backend', '/root/app/api', {
      recursive: true,
      concurrency: 10,
      tick: (localPath, _, error) => (error) ? failed.push(localPath) : successful.push(localPath)
    });

    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful');
    // console.log('successful transfers', successful);
    console.log('failed transfers', failed);

    try {
      await ssh.putFile('./package.json', '/root/app/api/package.json');
      await ssh.putFile('./package-lock.json', '/root/app/api/package-lock.json');
      console.log('npm ci:', await ssh.exec('npm ci --legacy-peer-deps --production', [], { cwd: '/root/app/api', stream: 'stdout' }));
    } catch (error: any) {
      console.error(error)
    }

    try {
      console.log(await ssh.exec('pm2 restart server', [], { cwd: '/root/app/api', stream: 'stdout' }));
    }
    catch (error: any) {
      console.log(error);
    }
  }
})();
