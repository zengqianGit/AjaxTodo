from flask import(
    render_template,
    Blueprint,
)
from routes import (
    login_required,
)
bp = Blueprint('weibo', __name__)


@bp.route('/weibo/index', methods=['GET'])
@login_required
def index():
    return render_template('weibo_index.html')
