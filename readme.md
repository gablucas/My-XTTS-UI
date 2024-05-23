Python 3.11 (Windows Store)
Nvida CUDA Toolkit 11.8 or 12.1

python -m venv .venv
.venv\Scripts\activate

pip install setuptools wheel -U
pip install TTS
pip install pedalboard
pip install noisereduce

For CUDA 11.8
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118

For CUDA 12.1
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
