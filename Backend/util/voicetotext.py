from util.voicemodel import VoiceModel
from util.voicerecord import AudioRecorder



class VoiceToText:
    @staticmethod
    def voice_to_text():
        AudioRecorder.record_audio("util/Audio/audio.wav", duration=3)
        vm = VoiceModel()
        return vm.get_text_translation()


