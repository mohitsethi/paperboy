import falcon
from paperboy.config import User
from six.moves.urllib_parse import urljoin


class DummyUserMiddleware(object):
    def __init__(self, config, db, *args, **kwargs):
        self.config = config
        self.db = db

    def process_request(self, req, resp):
        if req.context.get('auth_token') is None:
            if req.path not in (urljoin(self.config.baseurl, self.config.loginurl), urljoin(self.config.baseurl, self.config.registerurl)) and \
                 urljoin(self.config.baseurl, 'static') not in req.path:
                raise falcon.HTTPFound(urljoin(self.config.baseurl, self.config.loginurl))
        else:
            req.context['user'] = User(self.config, id='1', name=req.context.get('auth_token'))
            if req.path in (urljoin(self.config.baseurl, self.config.loginurl), urljoin(self.config.baseurl, self.config.registerurl)):
                raise falcon.HTTPFound(self.config.baseurl)


class DummyAuthRequiredMiddleware(object):
    def __init__(self,
                 config,
                 db):
        self.config = config
        self.db = db

    def process_request(self, req, resp):
        token_value = req.cookies.get('auth_token', None)
        req.context['auth_token'] = token_value

    def process_resource(self, req, resp, resource, params):
        required = getattr(resource, 'auth_required', True)
        token_value = req.context.get('auth_token', None)
        token_value = None if isinstance(token_value, Exception) else token_value

        if required and not token_value:
            raise falcon.HTTPFound(urljoin(self.config.baseurl, self.config.loginurl))