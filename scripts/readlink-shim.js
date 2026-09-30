/**
 * Build-time shim for Node 20+ on Windows.
 *
 * Node 24 changed fs.readlink on Windows to throw EISDIR for a regular
 * (non-symlink) file, whereas Next.js 14's webpack file-tracer only tolerates
 * EINVAL/ENOENT. This shim restores the older behavior by remapping EISDIR
 * (and UNKNOWN) from readlink into EINVAL so the tracer treats the path as a
 * plain file. It only affects readlink and only the error code — no behavior
 * change on Node versions that already return EINVAL.
 *
 * Loaded via NODE_OPTIONS="--require ./scripts/readlink-shim.js" during build.
 */
const fs = require('fs');

function remap(err) {
  if (err && (err.code === 'EISDIR' || err.code === 'UNKNOWN') && err.syscall === 'readlink') {
    err.code = 'EINVAL';
    err.errno = -4071;
  }
  return err;
}

const origAsync = fs.readlink;
fs.readlink = function (path, options, cb) {
  const callback = typeof options === 'function' ? options : cb;
  const opts = typeof options === 'function' ? undefined : options;
  return origAsync.call(fs, path, opts, (err, res) => {
    callback(err ? remap(err) : null, res);
  });
};

const origSync = fs.readlinkSync;
fs.readlinkSync = function (path, options) {
  try {
    return origSync.call(fs, path, options);
  } catch (err) {
    throw remap(err);
  }
};

if (fs.promises && fs.promises.readlink) {
  const origP = fs.promises.readlink;
  fs.promises.readlink = function (path, options) {
    return origP.call(fs.promises, path, options).catch((err) => {
      throw remap(err);
    });
  };
}

// --- readFile UNKNOWN (-4094) retry -------------------------------------
// Node 24 on some Windows / removable volumes intermittently throws
// { code: 'UNKNOWN', errno: -4094, syscall: 'read' } during Next's build
// trace collection (@vercel/nft). Retry a few times before giving up.
function isTransient(err) {
  return err && err.code === 'UNKNOWN' && (err.syscall === 'read' || err.syscall === 'open');
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
if (fs.promises && fs.promises.readFile) {
  const origRF = fs.promises.readFile;
  fs.promises.readFile = async function (path, options) {
    let lastErr;
    for (let attempt = 0; attempt < 6; attempt++) {
      try {
        return await origRF.call(fs.promises, path, options);
      } catch (err) {
        if (!isTransient(err)) throw err;
        lastErr = err;
        await sleep(60 * (attempt + 1));
      }
    }
    throw lastErr;
  };
}
