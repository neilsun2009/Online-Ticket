# 架构信息
## 测试地址
http://119.29.132.18:3030

## 管理员账号密码
usr: admin
psd: ADMINadmin

## 与后台绑定文档名称
/index.html - 主页
/login.html - 登录页面
/signup.html - 注册页面
/me.html - 个人页面
/404.html - 404页面
/admin/admin.html - 后台主页
/admin/login.html - 后台登录

## 与后台绑定的访问地址
/ - 主页
/login - 登录
/signup - 注册
/logout - 注销
/admin - 后台主页
/admin_login - 后台登录
/admin_logout - 后台注销

# 数据模型
## user - 用户
{
	_id: String,
	username: String,
	password: String,
	access: Number, // 0 - 普通用户，1 - 管理员
	scenes: [{ // 简略购买场次信息
		sceneid: String,
		num: Number // 购买票数
	}]
}

## movie - 电影
{
	_id: String,
	title: String,
	length: Number, // 单位分钟
	ratings: [{ // 评分信息
		source: String, // 评分来源名称
		rating: Number // 1~10
	}],
	poster: String // 海报图片URL
}

## scene - 场次
{
	_id: String,
	time: String, // 场次时间，格式为 hh:mm，对应表单中<input type='time'>
	price: Number, // 单位元
	seat: Number, // 场次总座位数
	remain: Number, // 场次剩余座位数
	movieid: String, 
	movietitle: String // 注意movieid与movietitle并不同步，仅为便于用户详情页显示
}

# GET接口
## /api/user
登录状态可访问，未登录直接跳至登录页面
### 参数：
无，自动获取cookie中userid
### 成功数据格式：
{
	message: 'get user success',
	data: {
		_id: String,
		username: String,
		access: Number, 
		scenes: [{ // 简略购买场次数据
			_id: String,
			num: Number, 
			sceneid: String
		}]
	},
	scenes: [{ // 详细场次数据
		_id: String,
		time: String,
		price: Number,
		seat: Number,
		remain: Number,
		movieid: String,
		movietitle: String
	}],
	result: true
}
### 失败数据格式：
{
	message: 'no user found',
    data: null,
    result: false
}

## /api/scene
获取某一场次信息
### 参数：
{
	sceneid: String
}
### 成功数据格式：
{
	message: 'get scene succeeded',
	data: {
		_id: String,
		time: String,
		price: Number,
		seat: Number,
		remain: Number,
		movieid: String, 
		movietitle: String 
	},
	result: true
}
### 失败数据格式：
{
	message: 'no scene found',
    data: null,
    result: false
}

## /api/scenes
获取全部场次信息
### 参数：
无
### 成功数据格式：
{
	message: 'get scenes succeeded',
	data: [{
		_id: String,
		time: String,
		price: Number,
		seat: Number,
		remain: Number,
		movieid: String, 
		movietitle: String 
	}],
	count: Number, // 场次总数量
	result: true
}
### 失败数据格式：
{
	message: 'no scene found',
    data: Error, // 错误详细信息
    result: false
}

## /api/movie
获取某一电影信息
### 参数：
{
	movieid: String
}
### 成功数据格式：
{
	message: 'get movie succeeded',
	data: {
		_id: String,
		title: String,
		length: Number,
		ratings: [{
			source: String,
			rating: Number
		}],
		poster: String
	},
	scenes: [{ // 该电影名下场次数据
		_id: String,
		time: String,
		price: Number,
		seat: Number,
		remain: Number,
		movieid: String, 
		movietitle: String 
	}],
	result: true
}
### 失败数据格式：
{
	message: 'no scene found',
    data: null,
    result: false
}

## /api/movies
获取全部电影信息
### 参数：
无
### 成功数据格式：
{
	message: 'get movies succeeded',
	data: [{
		_id: String,
		title: String,
		length: Number,
		ratings: [{
			source: String,
			rating: Number
		}],
		poster: String
	}],
	count: Number, // 电影总数量
	result: true
}
### 失败数据格式：
{
	message: 'no movie found',
    data: Error, // 错误详细信息
    result: false
}

# POST接口
## /api/signup
注册新用户，仅开放普通用户注册
### 参数：
{
	username: String,
	password: String
}
### 成功：
注册成功直接跳转至主页
### 失败：
注册失败，重回注册页面，在HTML使用<%= msg %>显示错误信息

## /api/login
用户登录
### 参数：
{
	username: String,
	password: String
}
### 成功：
登录成功直接跳转至主页
### 失败：
登录失败，重回登录页面，在HTML使用<%= msg %>显示错误信息

## /api/login_admin
管理员用户登录
### 参数：
{
	username: String,
	password: String
}
### 成功：
登录成功直接跳转至后台主页
### 失败：
登录失败，重回管理员登录页面，在HTML使用<%= msg %>显示错误信息

## /api/add_scene
添加场次
需管理员用户登录操作
若非管理员登录，自动跳转至管理员登录页面
### 参数：
{
	time: String,
	price: Number,
	seat: Number, // scene.remain自动设置与scene.seat相等
	movieid: String, 
	movietitle: String 
}
### 成功数据格式：
{
    message: 'add scene succeeded',
    data: {
		_id: String,
		time: String,
		price: Number,
		seat: Number,
		remain: Number,
		movieid: String, 
		movietitle: String 
	},
    result: true
}
### 失败数据格式：
{
	message: 'add scene failed',
    data: Error, // 错误详细信息
    result: false
}

## /api/update_scene
更新场次
需管理员用户登录操作
若非管理员登录，自动跳转至管理员登录页面
### 参数：
{
	sceneid: String,
	time: String,
	price: Number,
	seat: Number,
	remain: Number,
	movieid: String, 
	movietitle: String 
}
### 成功数据格式：
{
    message: 'update scene succeeded',
    data: results, // 不是很确定是什么
    result: true
}
### 失败数据格式：
{
	message: 'update scene failed'或'no scene found',
    data: Error, // 错误详细信息
    result: false
}

## /api/delete_scene
删除场次
需管理员用户登录操作
若非管理员登录，自动跳转至管理员登录页面
### 参数：
{
	sceneid: String,
}
### 成功数据格式：
{
    message: 'scene deletion succeeded',
    data: { // 被删除数据
		_id: String,
		time: String,
		price: Number,
		seat: Number,
		remain: Number,
		movieid: String, 
		movietitle: String 
	}
    result: true
}
### 失败数据格式：
{
	message: 'scene deletion failed'或'scene not found',
    data: Error, // 错误详细信息
    result: false
}

## /api/add_movie
添加电影
需管理员用户登录操作
若非管理员登录，自动跳转至管理员登录页面
### 参数：
{
	title: String,
	length: Number,
	ratings: [{
		source: String,
		rating: Number
	}],
	poster: String
}
### 成功数据格式：
{
    message: 'add movie succeeded',
    data: {
		_id: String,
		title: String,
		length: Number,
		ratings: [{
			source: String,
			rating: Number
		}],
		poster: String
	},
    result: true
}
### 失败数据格式：
{
	message: 'add movie failed',
    data: Error, // 错误详细信息
    result: false
}

## /api/update_movie
更新电影
需管理员用户登录操作
若非管理员登录，自动跳转至管理员登录页面
### 参数：
{
	movieid: String,
	title: String,
	length: Number,
	ratings: [{
		source: String,
		rating: Number
	}],
	poster: String
}
### 成功数据格式：
{
    message: 'update movie succeeded',
    data: results, // 不是很确定是什么
    result: true
}
### 失败数据格式：
{
	message: 'update movie failed'或'no movie found',
    data: Error, // 错误详细信息
    result: false
}

## /api/delete_movie
删除电影
需管理员用户登录操作
若非管理员登录，自动跳转至管理员登录页面
### 参数：
{
	movieid: String,
}
### 成功数据格式：
{
    message: 'movie deletion succeeded',
    data: { // 被删除数据
		_id: String,
		title: String,
		length: Number,
		ratings: [{
			source: String,
			rating: Number
		}],
		poster: String
	}
    result: true
}
### 失败数据格式：
{
	message: 'movie deletion failed'或'movie not found',
    data: Error, // 错误详细信息
    result: false
}

## /api/buy_ticket
购买电影票
需用户登录操作
若未登录，自动跳转至登录页面
### 参数：
{
	sceneid: String,
	num: Number // 购票数量
}
### 成功数据格式：
{
    message: 'buy tickets succeeded',
    data: results, // 不是很确定是什么
    result: true
}
### 失败数据格式：
#### 更新场次信息出错：
{
	message: 'update scene failed',
    data: Error, // 错误详细信息
    result: false
}
#### 剩余票数不足：
{
	message: 'no enough tickets available',
    data: Number, // 该场次剩余票数
    result: false
}
#### 场次未查到
{
	message: 'no scene found',
    data: Error, // 错误详细信息
    result: false
}