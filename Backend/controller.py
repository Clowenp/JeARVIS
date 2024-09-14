import json

class Controller:

    @staticmethod
    def parse_message(message):
        kvp = json.loads(message)

        if "message" in kvp:
            if kvp["message"] == "connect":
                return "Connection to Server Established"
            else:
                return "Message is not parsed under Controller Condition!"
        else:
            return "No Message Key in JSON"