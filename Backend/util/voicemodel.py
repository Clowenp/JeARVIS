from groq import Groq
import os

class VoiceModel:

    def __init__(self, file_name = "audio.mp3"):
        self.client = Groq(api_key = os.getenv('GROQ_API_KEY'))
        self.model = 'whisper-large-v3'
        self.filepath = "util/Audio/" + file_name

    def audio_to_text(self):
        with open(self.filepath, "rb") as file:
            translation = self.client.audio.translations.create(
                file=(self.filepath, file.read()),
                model="whisper-large-v3",
            )
            return translation.text

    def get_text_translation(self):
        translation_text = self.audio_to_text()
        print(translation_text)
        return translation_text
