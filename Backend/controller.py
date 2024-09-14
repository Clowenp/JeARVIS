import json

class Controller:

    @staticmethod
    def parse_message(message):
        kvp = json.loads(message)
        return kvp["message"]