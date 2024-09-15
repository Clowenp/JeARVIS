import requests
import os
from dotenv import load_dotenv


class Voiceflow:
    
    def __init__(self, userID):
        load_dotenv('.env')
        self.API_KEY = os.getenv('API_KEY')
        self.url = "https://general-runtime.voiceflow.com/state/user/" + userID + "/interact?logs=off"

    def launch_workflow(self, variable_map):
        payload = {
            "action": { "type": "launch" },
            "config": {
                "tts": False,
                "stripSSML": True,
                "stopAll": True,
                "excludeTypes": ["block", "debug", "flow"]
            },
            "state": { "variables": variable_map }
        }

        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": self.API_KEY
        }

        return requests.post(self.url, json=payload, headers=headers)
        
    
    def send_intent(self, variable_map, query, intent):
        payload = {
            "action": {
                "type": "intent",
                "payload": {
                    "query": query,
                    "intent": { "name": intent },
                    "confidence": 0.5
                }
            },
            "config": {
                "tts": False,
                "stripSSML": True,
                "stopAll": True,
                "excludeTypes": ["block", "debug", "flow"]
            },
            "state": { "variables": variable_map }
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": self.API_KEY
        }

        return requests.post(self.url, json=payload, headers=headers)

    def send_text(self, variable_map, text):
        payload = {
            "action": {
                "type": "text",
                "payload": text
            },
            "config": {
                "tts": False,
                "stripSSML": True,
                "stopAll": True,
                "excludeTypes": ["block", "debug", "flow"]
            },
            "state": { "variables": variable_map }
        }
        headers = {
            "accept": "application/json",
            "content-type": "application/json",
            "Authorization": self.API_KEY
        }

        return requests.post(self.url, json=payload, headers=headers)

    def close_flow(self):
        headers = {"Authorization": self.API_KEY}

        return requests.delete(self.url[:len(self.url) - 18], headers=headers)

