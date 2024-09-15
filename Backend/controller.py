import json
from util.productivity import Productivity
from util.voicemodel import VoiceModel

class Controller:

    @staticmethod
    def parse_message(message):
        kvp = json.loads(message)
        if "message" in kvp:
            command = kvp["message"]
            if command == "connect":
                return "Connection to Server Established"
            elif command == "screenshot":
                return Controller.screenshot()
            elif command == "voice":
                return Controller.voice()
            else:
                return "Message is not parsed under Controller Condition!"
        else:
            return "No Message Key in JSON"
        
    @staticmethod
    def screenshot():
        return Productivity.run_productivity()
    
    @staticmethod
    def voice():
        vm = VoiceModel()
        return vm.get_text_translation()