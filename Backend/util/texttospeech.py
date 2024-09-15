import requests
from dotenv import load_dotenv
import os


class TextToSpeech:

    url = "https://api.uberduck.ai/speak-synchronous"
    API_KEY = ""

    def __init__(self, voice = "spongebob", voice_uuid = "5c14f88a-fa6a-4489-b177-bd948f03e32b"):
        load_dotenv()
        TextToSpeech.API_KEY = os.getenv("UBER")
        self.voice = voice
        self.voice_uuid = voice_uuid

    def get_speech_response(self, msg):
        payload = {
            "speech": msg,
            "voice": self.voice,
            "voicemodel_uuid": self.voice_uuid,
            "pitch": [0]
        }
        headers = {
            "Authorization": TextToSpeech.API_KEY,
            "Content-Type": "application/json"
        }
        response = requests.request("POST", TextToSpeech.url, json=payload, headers=headers)
        content_type = response.headers.get('Content-Type', '')

        if 'wav' in content_type:
            file_extension = '.wav'
        elif 'mpeg' in content_type or 'mp3' in content_type:
            file_extension = '.mp3'
        else:
            file_extension = '.audio'  # generic extension if type is unknown

        # Save the audio data to a file
        filename = f"util/Audio/uberduck{file_extension}"
        with open(filename, 'wb') as audio_file:
            audio_file.write(response.content)

        print(f"Audio saved as {filename}")