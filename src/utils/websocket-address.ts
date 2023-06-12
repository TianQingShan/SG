export default () => {
  if (import.meta.env.MODE !== 'development') {
    let { host, protocol } = location
    let _prefix = protocol === 'https:' ? 'wss:' : 'ws:'
    return _prefix + '//' + host + '/msg'
  }

  return import.meta.env.VITE_WEBSOCKET_BASEURL
}
