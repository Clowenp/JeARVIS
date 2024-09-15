from TTS.api import TTS

# Load the model to GPU
# Bark is really slow on CPU, so we recommend using GPU.
tts = TTS("tts_models/multilingual/multi-dataset/bark", gpu=False)


# Cloning a new speaker
# This expects to find a mp3 or wav file like `bark_voices/new_speaker/speaker.wav`
# It computes the cloning values and stores in `bark_voices/new_speaker/speaker.npz`
tts.tts_to_file(text="Hello, my name is Manmay , how are you?",
                file_path="output.wav",
                voice_dir="bark_voices/",
                speaker="ljspeech")


# When you run it again it uses the stored values to generate the voice.
tts.tts_to_file(text="Hello, my name is Manmay , how are you?",
                file_path="output.wav",
                voice_dir="bark_voices/",
                speaker="ljspeech")


# random speaker
tts = TTS("tts_models/multilingual/multi-dataset/bark", gpu=True)
tts.tts_to_file("hello world", file_path="out.wav")