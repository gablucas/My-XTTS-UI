## Required Softwares
- Python 3.11 (Windows Store)
- Nvidia CUDA Toolkit 11.8 or 12.1
- Microsoft C++ 14+

## Installing
- python -m venv .venv
- .venv\Scripts\activate
- pip install setuptools wheel -U
- pip install TTS
- pip install pedalboard
- pip install noisereduce
- pip install torch==2.2.2 torchvision==0.17.2 torchaudio==2.2.2 --index-url https://download.pytorch.org/whl/cu118 - For NVIDIA GPU CUDA 11.8
- pip install torch==2.2.2 torchvision==0.17.2 torchaudio==2.2.2 --index-url https://download.pytorch.org/whl/cu121 - For NVIDIA GPU CUDA 12.1
- pip install torch==2.2.2 torchvision==0.17.2 -f https://download.pytorch.org/whl/cpu/torch_stable.html - For CPU ONLY
- python init_db.py
