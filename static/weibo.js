// TODO API
// 获取所有 weibo
var apiWeiboAll = function(callback) {
    var path = '/api/weibo/all'
    ajax('GET', path, '', callback)
//    r = ajax('GET', path, '', callback)
//    callback(r)
}

var apiWeiboAdd = function(form, callback) {
    var path = '/api/weibo/add'
    ajax('POST', path, form, callback)
}

var apiWeiboDelete = function(weibo_id, callback) {
    var path = `/api/weibo/delete?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiWeiboEdit = function(weibo_id, callback) {
    var path = `/api/weibo/edit?id=${weibo_id}`
    ajax('GET', path, '', callback)
}

var apiWeiboUpdate = function(form, callback) {
    var path = '/api/weibo/update'
    ajax('POST', path, form, callback)
}

var apiCommentEdit = function(comment_id, callback) {
    var path = `/api/weibo/comment_edit?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentboUpdate = function(form, callback) {
    var path = '/api/weibo/comment_update'
    ajax('POST', path, form, callback)
}

var apiCommentDelete = function(comment_id, callback) {
    var path = `/api/weibo/comment_delete?id=${comment_id}`
    ajax('GET', path, '', callback)
}

var apiCommentAdd = function(form, callback) {
    var path = '/api/weibo/comment_add'
    ajax('POST', path, form, callback)
}

var weiboTemplate = function(weibo, user) {
// <span class="weibo-id" hidden=True>${weibo.id}</span>
    var w = `
        <br>
        <div class="weibo-cell" data-id="${weibo.id}">
            <span class="weibo-username">${user}</span>
            <span class="weibo-title">${weibo.content}</span>
            <button class="weibo-delete">删除</button>
            <button class="weibo-edit">编辑</button>
            <button class="weibo-add-comment">添加评论</button>
            <div class="comment-list">
            </div>
        </div>
    `
    return w
}

var weiboUpdateTemplate = function(title) {
    var t = `
        <div class="weibo-update-form">
            <input class="weibo-update-input" value="${title}">
            <button class="weibo-update">更新</button>
        </div>
    `
    return t
}

var commentTemplate = function(comment) {
    var c = `
        <div class="comment-form" data-id="${comment.id}">
            <span class="comment-content">${comment.content}</span>
            <button class="comment-delete">删除</button>
            <button class="comment-edit">编辑</button>
        </div>
    `
    return c
}

var commentAddTemplate = function() {
    var t = `
        <div class="comment-add-form">
            <input class="comment-input">
            <button class="comment-add-confirm">确认添加</button>
        </div>
    `
    return t
}

var commentUpdateTemplate = function(content) {
    var t = `
        <div class="comment-update-form">
            <input class="comment-update-input" value="${content}">
            <button class="comment-update">更新</button>
        </div>
    `
    return t
}

var insertWeibo = function(weibo, user, comment) {
    var weiboCell = weiboTemplate(weibo, user)
    var commentCells = ''
    // commentCells = commentTemplate(comment[0])

    for(var i = 0; i < comment.length; i++) {
        commentCells += commentTemplate(comment[i])
    }
    weiboCell += commentCells
    // 插入 weibo-list
    var weiboList = e('#id-weibo-list')
    weiboList.insertAdjacentHTML('beforeend', weiboCell)
    // weiboList.insertAdjacentHTML('beforeend', commentCells)
}

var insertUpdateForm = function(title, weiboCell) {
    var updateForm = weiboUpdateTemplate(title)
    weiboCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertUpdateCommentForm = function(content, commentCell) {
    var updateForm = commentUpdateTemplate(content)
    commentCell.insertAdjacentHTML('beforeend', updateForm)
}

var insertCommentForm = function(weiboCell) {
    var commentForm = commentAddTemplate()
    weiboCell.insertAdjacentHTML('beforeend', commentForm)
}

var loadWeibos = function() {
    // 调用 ajax api 来载入数据
    // weibos = api_weibo_all()
    // process_weibos(weibos)
    apiWeiboAll(function(dicts) {
        var weibos = dicts['weibos']
        // var users = JSON.parse(dicts['users'])
        var users = dicts['users']
        var comments = dicts['comments']
        log('load all weibos', dicts)
        // 循环添加到页面中
        for(var i = 0; i < weibos.length; i++) {
            insertWeibo(weibos[i], users[i], comments[i])
        }
    })
    // second call
}

var bindEventWeiboAdd = function() {
    var b = e('#id-button-add')
    b.addEventListener('click', function(){
        var input = e('#id-input-weibo')
        var content = input.value
        log('click add', content)
        var form = {
            content: content,
        }
        apiWeiboAdd(form, function(dict) {
            // 收到返回的数据, 插入到页面中
            var weibo = dict['weibo']
            // var user = JSON.parse(dicts['user'])
            var user = dict['user']
            insertWeibo(weibo, user, [])
        })
    })
}


var bindEventWeiboDelete = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-delete')) {
        log('点到了删除按钮')
        weiboId = self.parentElement.dataset['id']
        apiWeiboDelete(weiboId, function(r) {
            alert(r.message)
            if(r.is_valid) {
                log('apiWeiboDelete', r.message)
                // 删除 self 的父节点
                self.parentElement.remove()
            }
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventWeiboEdit = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-edit')) {
        log('点到了编辑按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        apiWeiboEdit(weiboId, function(r) {
            log('apiWeiboEdit', r.message)
            if(r.invalid) {
                alert(r.message)
            }else {
                var weiboSpan = e('.weibo-title', weiboCell)
                var title = weiboSpan.innerText
                // 插入编辑输入框
                insertUpdateForm(title, weiboCell)
            }
        })
    } else {
        log('点到了 weibo edit')
    }
})}

var bindEventWeiboUpdate = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-update')) {
        log('点到了更新按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        log('update weibo id', weiboId)
        input = e('.weibo-update-input', weiboCell)
        content = input.value
        var form = {
            id: weiboId,
            content: content,
        }

        apiWeiboUpdate(form, function(weibo) {
            // 收到返回的数据, 插入到页面中
            log('apiWeiboUpdate', weibo)

            var weiboSpan = e('.weibo-title', weiboCell)
            weiboSpan.innerText = weibo.content

            var updateForm = e('.weibo-update-form', weiboCell)
            updateForm.remove()
        })
    } else {
        log('点到了 weibo cell')
    }
})}

var bindEventCommentAdd = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('weibo-add-comment')) {
        log('点到了添加评论按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        insertCommentForm(weiboCell)
    } else {
        log('点到了 comment add')
    }
})}

var bindEventCommentAddConfirm = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-add-confirm')) {
        log('点到了确认添加按钮')
        weiboCell = self.closest('.weibo-cell')
        weiboId = weiboCell.dataset['id']
        input = e('.comment-input', weiboCell)
        content = input.value
        var form = {
            weibo_id: weiboId,
            content: content,
        }

        apiCommentAdd(form, function(comment) {
            // 收到返回的数据, 插入到页面中

            var commentForm = e('.comment-add-form', weiboCell)
            var commentCell = commentTemplate(comment)
            weiboCell.insertAdjacentHTML('afterend', commentCell)

            var addForm = e('.comment-add-form', weiboCell)
            addForm.remove()
        })
    } else {
        log('点到了 comment add confirm')
    }
})}

var bindEventCommentEdit = function() {
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function(event) {
    // log(event)

    var self = event.target
    log('被点击的元素', self)

    // log(self.classList)
    if (self.classList.contains('comment-edit')) {
        log('点到了编辑按钮')
        commentCell = self.closest('.comment-form')
        commentId = commentCell.dataset['id']

        apiCommentEdit(commentId, function(r) {
            log('apiCommentEdit', r.message)
            if (r.invalid) {
                alert(r.message)
            } else {
                var commentSpan = e('.comment-content', commentCell)
                var content = commentSpan.innerText
                log('content:', content)
                // 插入编辑输入框
                insertUpdateCommentForm(content, commentCell)
            }
        })
    } else {
        log('点到了 comment edit')
    }
})}

var bindEventCommentUpdate = function() {
    // var commentForm= e('.comment-update-form')
    var weiboList = e('#id-weibo-list')

    weiboList.addEventListener('click', function (event) {
        log(event)
        var self = event.target
        log('被点击的元素', self)
        // 通过比较被点击元素的 class
        // classList 属性保存了元素所有的 class
        if (self.classList.contains('comment-update')) {
            log('点到了更新按钮')
            commentCell = self.closest('.comment-form')
            commentId = commentCell.dataset['id']

            input = e('.comment-update-input', commentCell)
            content = input.value
            var form = {
                id: commentId,
                content: content,
            }

            apiCommentboUpdate(form, function (comment) {
                // 收到返回的数据, 插入到页面中
                // log('apiWeiboUpdate', weibo)

                var commentSpan = e('.comment-content', commentCell)
                commentSpan.innerText = comment.content

                var updateForm = e('.comment-update-form', commentCell)
                updateForm.remove()
            })
        } else {
            log('点到了 comment update')
        }
    })
}

var bindEventCommentDelete = function() {
    var weiboList = e('#id-weibo-list')
    // 事件响应函数会传入一个参数 就是事件本身
    weiboList.addEventListener('click', function(event) {
    log(event)
    var self = event.target
    log('被点击的元素', self)
    // 通过比较被点击元素的 class
    // classList 属性保存了元素所有的 class
    log(self.classList)
    if (self.classList.contains('comment-delete')) {
        log('点到了添加评论按钮')
        commentCell = self.closest('.comment-form')
        commentId = commentCell.dataset['id']
        apiCommentDelete(commentId, function(r) {
            alert(r.message)
            if (r.is_valid) {
                self.parentElement.remove()
            }
        })
    } else {
        log('点到了 comment delete')
    }
})}

var bindEvents = function() {
    bindEventWeiboAdd()
    bindEventWeiboDelete()
    bindEventWeiboEdit()
    bindEventWeiboUpdate()
    bindEventCommentAdd()
    bindEventCommentAddConfirm()
    bindEventCommentEdit()
    bindEventCommentUpdate()
    bindEventCommentDelete()
}

var __main = function() {
    bindEvents()
    loadWeibos()
}

__main()
