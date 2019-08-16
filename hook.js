const cache = require('./cache')
const parse = require('url').parse
const format = require('url').format
const request = require('./request')

const hook = {
	request: {
		before: () => {},
		after: () => {},
	},
	connect: {
		before: () => {}
	},
	negotiate: {
		before: () => {}
	},
	target: {
		host: [],
		path: []
	}
}

hook.target.host = [
	'app.jike.ruguoapp.com',
	'jike-io.jike.ruguoapp.com',
	'sensorsdata.ruguoapp.com',
	'activity.jike.ruguoapp.com',
	'track.jike.ruguoapp.com'
]

hook.target.path = [
	'/1.0/interactiveMessages/list'
]

hook.request.before = ctx => {
	const req = ctx.req
	req.url = (req.url.startsWith('http://') ? '' : (req.socket.encrypted ? 'https:' : 'http:') + '//' + (hook.target.host.includes(req.headers.host) ? req.headers.host : null)) + req.url
	const url = parse(req.url)
	if(hook.target.host.includes(url.hostname)){
		let host = (url.hostname == 'app.jike.ruguoapp.com') ? 'api.jellow.club' : url.hostname.replace('jike.ruguoapp.com', 'jellow.club')
		req.headers['host'] = host
		req.url = format(Object.assign(url, {host}))
		ctx.jike = {path: url.pathname}
	}
	// console.log(req.url)
}

hook.request.after = ctx => {
	const jike = ctx.jike
	const proxyRes = ctx.proxyRes
	if(jike && hook.target.path.includes(jike.path)){
		return request.read(proxyRes)
		.then(body => proxyRes.body = body)
		.then(body => {
			// if(proxyRes.statusCode == 503){
			// 	proxyRes.statusCode = 200
			// 	proxyRes.body = JSON.stringify({data: [], loadMoreKey: null})
			// 	proxyRes.headers['content-type'] = 'application/json'
			// }
		})
	}
}

hook.connect.before = ctx => {
	let url = parse('https://' + ctx.req.url)
	if([url.hostname, ctx.req.headers.host].some(host => hook.target.host.includes(host))){
		if(url.port == 80){
			ctx.req.url = `${global.address || 'localhost'}:${global.port[0]}`
			ctx.req.local = true
		}
		else if(global.port[1]){
			ctx.req.url = `${global.address || 'localhost'}:${global.port[1]}`
			ctx.req.local = true
		}
		else{
			ctx.decision = 'blank'
		}
	}
}

module.exports = hook