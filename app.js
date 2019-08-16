#!/usr/bin/env node

const package = require('./package.json')
const config = require('./cli.js')
.program({name: package.name.replace(/@.+\//, ''), version: package.version})
.option(['-v', '--version'], {action: 'version'})
.option(['-p', '--port'], {metavar: 'port', help: 'specify server port'})
.option(['-a', '--address'], {metavar: 'address', help: 'specify server host'})
.option(['-u', '--proxy-url'], {metavar: 'url', help: 'request through upstream proxy'})
.option(['-t', '--token'], {metavar: 'token', help: 'set up proxy authentication'})
.option(['-s', '--strict'], {action: 'store_true', help: 'enable proxy limitation'})
.option(['-h', '--help'], {action: 'help'})
.parse(process.argv)

global.address = config.address
config.port = (config.port || '8080:8081').split(':').map(string => parseInt(string))
const invalid = value => (isNaN(value) || value < 1 || value > 65535)
if(config.port.some(invalid)){
	console.log('Port must be a number higher than 0 and lower than 65535.')
	process.exit(1)
}
if(config.proxyUrl && !/http(s?):\/\/.+:\d+/.test(config.proxyUrl)){
	console.log('Please check the proxy url.')
	process.exit(1)
}
if(config.token && !/\S+:\S+/.test(config.token)){
	console.log('Please check the authentication token.')
	process.exit(1)
}

const parse = require('url').parse
const hook = require('./hook')
const server = require('./server')

global.port = config.port
global.proxy = config.proxyUrl ? parse(config.proxyUrl) : null
global.hosts = {}, hook.target.host.forEach(host => global.hosts[host] = config.forceHost)
if(config.strict) server.blacklist.push('.*')
server.authentication = config.token || null

if(port[0]){
	server.http.listen(port[0], address)
	console.log(`HTTP Server running @ http://${address || '0.0.0.0'}:${port[0]}`)
}
if(port[1]){
	server.https.listen(port[1], address)
	console.log(`HTTPS Server running @ https://${address || '0.0.0.0'}:${port[1]}`)
}