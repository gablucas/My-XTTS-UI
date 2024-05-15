from flask import Flask, render_template, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import logging
from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

def create_app():
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_pyfile('config.py', silent=True)
    app.static_folder = 'static'
    app.logger.setLevel(logging.INFO)

    stream_handler = logging.StreamHandler()
    stream_handler.setLevel(logging.INFO)
    app.logger.addHandler(stream_handler)

    with app.app_context():
        from routes import main as main_blueprint
        from controllers.utils_controllers import utils_controller
        from controllers.audios_controller import audios_controller
        from controllers.voices_controller import voices_controller
        
        app.register_blueprint(main_blueprint)
        app.register_blueprint(utils_controller)
        app.register_blueprint(audios_controller)
        app.register_blueprint(voices_controller)

    return app