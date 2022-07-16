import { config } from 'dotenv';
import { execSync } from 'child_process';
import { NodeSSH } from 'node-ssh';

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
    const stdout = execSync(`yarn build`);

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

    const status = await ssh.putDirectory('./dist', '/root/app', {
      recursive: true,
      concurrency: 10,
      tick: (localPath, remotePath, error) => (error) ? failed.push(localPath) : successful.push(localPath)
    })

    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful');
    // console.log('successful transfers', successful);
    console.log('failed transfers', failed);
  }

  async function backendDeploy() {
    // build typescript
    const stdout = execSync(`yarn api:build`);

    console.log(`build: ${stdout}`);

    const failed: any = [];
    const successful: any = [];

    let status = await ssh.putDirectory('./api/dist', '/root/app', {
      recursive: true,
      concurrency: 10,
      tick: (localPath, remotePath, error) => (error) ? failed.push(localPath) : successful.push(localPath)
    });

    console.log('the directory transfer was', status ? 'successful' : 'unsuccessful');
    // console.log('successful transfers', successful);
    console.log('failed transfers', failed);

    try {
      await ssh.putFile('./package.json', '/root/app/api/package.json');
      await ssh.putFile('./yarn.lock', '/root/app/api/yarn.lock');
      console.log('npm ci:', await ssh.exec('yarn --frozen-lockfile', [], { cwd: '/root/app/api', stream: 'stdout' }));
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
