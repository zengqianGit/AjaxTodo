from models import Model
from models.user import User


class Comment(Model):
    """
    评论类
    """
    def __init__(self, form, user_id=-1):
        super().__init__(form)
        self.user_id = form.get('user_id', user_id)
        self.weibo_id = int(form.get('weibo_id', -1))
        self.content = form.get('content', '')

    def user(self):
        u = User.find_by(id=self.user_id)
        return u

    @classmethod
    def add(cls, form, user_id):
        w = Comment(form, user_id)
        w.save()

        return w

    # def comment_owner_required(self, id):
    #     c = self.find_by(id=id)
    #     if c is None:
    #         return False
    #     w = Weibo.find_by(id=c.user_id)


    # def weibo(self):
    #     from models.weibo import Weibo
    #     w = Weibo.find_by(id=self.weibo_id)
    # return w