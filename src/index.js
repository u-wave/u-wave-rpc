import net from 'net';
import path from 'path';
import createDebug from 'debug';
import { flatten } from 'flat';
import xdg from 'xdg-basedir';
import znode from 'znode';

const debug = createDebug('uwave:rpc');

const methods = {
  acl: [
    'getAllRoles',
    'createRole',
    'deleteRole',
    'allow',
    'disallow',
    'isAllowed',
  ],
  booth: [
    'advance',
  ],
  motd: [
    'get',
    'set',
  ],
  users: [
    'getUser',
    'createUser',
    'updateUser',
  ],
};

function makeMethods(source, list) {
  const bag = {};
  list.forEach((name) => {
    bag[name] = (...args) => {
      debug('call', name);
      return source[name](...args);
    };
  });
  return bag;
}

export default function rpc(opts = {}) {
  const port = opts.listen || path.join(xdg.runtime, 'u-wave.sock');

  return (uw) => {
    const local = {};
    Object.keys(methods).forEach((section) => {
      local[section] = makeMethods(uw[section], methods[section]);
    });
    uw.rpc = flatten(local); // eslint-disable-line no-param-reassign

    function onconnect(socket) {
      znode(socket, uw.rpc).then(() => {
        debug('ready');
      }, (err) => {
        debug(err);
      });
    }

    const server = net.createServer(onconnect).listen(port);
    uw.on('close', () => {
      server.close();
    });
  };
}
