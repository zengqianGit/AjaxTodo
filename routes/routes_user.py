from urllib.parse import unquote_plus

from models.session import Session
from routes import (
    current_user,
    random_string,
)

from utils import log
from models.user import User
from models.user_role import UserRole

from flask import(
    request,
    url_for,
    redirect,
    current_app,
    render_template,
    Blueprint,
)

bp = Blueprint('user', __name__)


# 不要这么 import
# from xx import a, b, c, d, e, f

@bp.route('/user/login', methods=['POST'])
def login():
    """
    登录页面的路由函数
    """
    form = request.form

    u, result = User.login(form)

    if u.role == UserRole.guest:
        redirection = redirect(url_for('user.login_view', result='{}'.format(result)))
        response = current_app.make_response(redirection)
        return response

    # session 会话
    # token 令牌
    # 设置一个随机字符串来当令牌使用
    session_id = random_string()
    form = dict(
        session_id=session_id,
        user_id=u.id,
    )
    Session.new(form)
    # cookie 范围
    # /login
    # /login/user/view
    # /todo
    # headers = {
    #     'Set-Cookie': 'session_id={}; path=/'.format(
    #         session_id
    #     )
    # }
    redirection = redirect(url_for('user.login_view', result='{}'.format(result)))
    response = current_app.make_response(redirection)
    response.set_cookie('session_id', session_id, path='/')

    return response


@bp.route('/user/login/view', methods=['GET'])
def login_view():
    u = current_user()
    result = request.args.get('result', '')
    result = unquote_plus(result)

    return render_template(
        'login.html',
        username=u.username,
        result=result,
    )


def register(request):
    """
    注册页面的路由函数
    """
    form = request.form()

    u, result = User.register(form)
    log('register post', result)

    return redirect('/user/register/view?result={}'.format(result))


# @route('/register', 'GET')
def register_view(request):
    result = request.query.get('result', '')
    result = unquote_plus(result)

    return render_template('register.html', result=result)



# RESTFul
# GET /login
# POST /login
# UPDATE /user
# DELETE /user
#

def route_dict():
    r = {
        '/user/login': login,
        '/user/login/view': login_view,
        '/user/register': register,
        '/user/register/view': register_view,
    }
    return r
