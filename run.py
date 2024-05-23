from app import create_app
from config import Config
import torch
torch.cuda.empty_cache()

app = create_app()

if __name__ == '__main__':
    app.run(debug=Config.DEBUG)