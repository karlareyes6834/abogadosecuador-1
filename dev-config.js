export default {
  endpoints: {
    websocket: ''
  },
  maxReconnectAttempts: 5,
  reconnectInterval: 2000,
  debug: {
    websocket: false,
    modules: false
  },
  moduleFallbackPaths: {},
  offline: {
    disableWebSocket: true
  }
};
