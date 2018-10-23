from utils import log
from routes import (
    current_user,
    login_required,
)
from models.weibo import Weibo
from models.user import User
from models.comment import Comment
from models.user_role import UserRole
from flask import(
    Blueprint,
    jsonify,
    request,
)

bp = Blueprint('api_weibo', __name__)


# 本文件只返回 json 格式的数据
# 而不是 html 格式的数据
@bp.route('/api/weibo/all', methods=['GET'])
@login_required
def all():
    us = []
    ws = Weibo.all()
    cs = []
    for w in ws:
        u = User.find_by(id=w.user_id)
        us.append(u.username)

        c = Comment.find_all(weibo_id=w.id)
        c_json = [ci.json() for ci in c]
        cs.append(c_json)

    weibos = [w.json() for w in ws]
    comments = cs
    # comments = [comment.json() for c in cs for comment in c]
    # users = [u.json() for u in us] TypeError: Object of type 'UserRole' is not JSON serializable
    d = {
        'weibos': weibos,
        'users': us,
        'comments': comments,
    }
    return jsonify(d)


@bp.route('/api/weibo/add', methods=['POST'])
def add():
    # 得到浏览器发送的表单, 浏览器用 ajax 发送 json 格式的数据过来
    form = request.get_json()
    # 创建一个 weibo
    u = current_user()
    w = Weibo.add(form, u.id)
    weibo = w.__dict__
    # user = u.__dict__
    user = u.username
    # 把创建好的 weibo 返回给浏览器
    d = {
        'weibo': weibo,
        'user': user,
    }
    return jsonify(d)


@bp.route('/api/weibo/delete', methods=['GET'])
def delete():
    weibo_id = int(request.args.get('id', -1))
    w = Weibo.find_by(id=weibo_id)
    u = current_user()
    is_valid = False

    msg = "没有权限删除 weibo"
    if u.id == w.user_id:
        is_valid = True
        Weibo.delete(weibo_id)
        msg = "成功删除 weibo"
    if u.role == UserRole.guest:
        msg = "请登陆"
    d = dict(
        message=msg,
        is_valid=is_valid,
    )
    return jsonify(d)


@bp.route('/api/weibo/edit', methods=['GET'])
def weibo_owner_required():
    weibo_id = int(request.args.get('id', -1))
    w = Weibo.find_by(id=weibo_id)
    u = current_user()
    invalid = True
    msg = "没有权限编辑"

    if u.id == w.user_id:
        invalid = False

    if u.role == UserRole.guest:
        msg = "请登陆"

    d = dict(
        message=msg,
        invalid=invalid,
    )
    return jsonify(d)


@bp.route('/api/weibo/comment_edit', methods=['GET'])
def comment_owner_required():
    comment_id = int(request.args.get('id', -1))
    c = Comment.find_by(id=comment_id)
    u = current_user()
    ws = Weibo.find_all(user_id=u.id)
    invalid = True
    msg = "没有权限编辑"

    if u.id == c.user_id:
        invalid = False
    if u.role == UserRole.guest:
        msg = "请登陆"

    for w in ws:
        if w.id == c.weibo_id:
            invalid = False
            break

    d = dict(
        message=msg,
        invalid=invalid,
    )
    return jsonify(d)


@bp.route('/api/weibo/update', methods=['POST'])
def update():
    """
    用于增加新 weibo 的路由函数
    """
    form = request.get_json()
    log('api weibo update form', form)
    w = Weibo.update(**form)
    return jsonify(w.json())


@bp.route('/api/weibo/comment_add', methods=['POST'])
def comment_add():
    # form = request.get_json()
    # # 创建一个 weibo
    # u = current_user()
    # msg = ""
    # c = ""
    # if u.role == UserRole.guest:
    #     msg = "请登陆"
    # else:
    #     c = Comment.add(form, u.id)
    #     c = c.__dict__
    # d = dict(
    #     message=msg,
    #     comment=c,
    # )
    # return jsonify(d)

    form = request.get_json()
    u = current_user()
    c = Comment.add(form, u.id)
    return jsonify(c.json())


@bp.route('/api/weibo/comment_delete', methods=['GET'])
def comment_delete():
    # comment_id = int(request.args.get('id', -1))
    # Comment.delete(comment_id)

    comment_id = int(request.args.get('id', -1))
    c = Comment.find_by(id=comment_id)
    u = current_user()
    ws = Weibo.find_all(user_id=u.id)
    is_valid = False
    msg = "没有权限删除 comment"

    if u.id == c.user_id:
        is_valid = True
    if u.role == UserRole.guest:
        msg = "请登陆"

    for w in ws:
        if w.id == c.weibo_id:
            is_valid = True
            break

    if is_valid:
        Comment.delete(comment_id)
        msg = "成功删除 comment"

    d = dict(
        message=msg,
        is_valid=is_valid,
    )
    return jsonify(d)


@bp.route('/api/weibo/comment_update', methods=['POST'])
def comment_update():
    """
    用于增加新 weibo 的路由函数
    """
    form = request.get_json()
    log('api comment update form', form)
    c = Comment.update(**form)
    return jsonify(c.json())
