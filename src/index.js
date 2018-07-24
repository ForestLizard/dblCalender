// routes
import basic_usage from './basic_usage'
import advanced_usage from './advanced_usage'

export default [
  {
    path: ['/', '/index', '/list'],
    controller: require('./home/Controller')
  },
  {
    path: '/dblCalender',
    controller: require('./dblCalender/controller')
  },
  {
    path: '/test',
    controller: require('./test/controller')
  },

  basic_usage,
  advanced_usage
]
