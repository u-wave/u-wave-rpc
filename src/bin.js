import minimist from 'minimist';
import client from './client';

function get(obj, props) {
  let r = obj;
  for (let i = 0; i < props.length; i++) {
    r = r[props[i]];
    if (!r) throw new Error(`Method ${props.join('.')} does not exist`)
  }
  return r;
}

async function main(args) {
  const rpc = await client(args);

  const action = args._[0];
  if (action) {
    const method = get(rpc, action.split('.'));
    const result = await method(...args._.slice(1), args);
    console.log(JSON.stringify(result, null, 2));

    rpc.close();
    return;
  }

  throw new Error('Unknown action');
}

main(minimist(process.argv.slice(2))).catch((err) => {
  console.error(err);
  process.exit(1);
});
