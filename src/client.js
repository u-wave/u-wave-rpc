import net from 'net';
import path from 'path';
import { unflatten } from 'flat';
import xdg from 'xdg-basedir';
import znode from 'znode';

export default async function rpc(opts = {}) {
  const socketPath = opts.socket || path.join(xdg.runtime, 'u-wave.sock');

  const socket = net.connect(socketPath);

  function close() {
    socket.end();
  }

  const remote = await znode(socket, {});
  return Object.assign(unflatten(remote), {
    close,
  });
}
