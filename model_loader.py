from TTS.tts.configs.xtts_config import XttsConfig
from TTS.tts.models.xtts import Xtts

def load_model(runmodel):
    if runmodel:
        print("Loading model...")
        config = XttsConfig()
        config.load_json("E:\TTS\model\config.json")
        model = Xtts.init_from_config(config)
        model.load_checkpoint(config, checkpoint_dir="E:\TTS\model", use_deepspeed=False)
        model.cuda()
        print("Model loaded!")
        return model
    else:
        print("Model loading skipped")
        return None