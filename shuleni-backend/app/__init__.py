from flask import Flask

def create_app():
    app = Flask(__name__)
    @app.route('/')
    def index():
        return {"message": "Hello from CI/CD Flask!"}
    return app
