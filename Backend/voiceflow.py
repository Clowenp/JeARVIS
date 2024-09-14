import requests
import os


class Voiceflow:

    API_KEY = os.getenv('API_KEY')

    def __init__(self, userID):
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
            "Authorization": Voiceflow.API_KEY
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
            "Authorization": Voiceflow.API_KEY
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
            "Authorization": Voiceflow.API_KEY
        }

        return requests.post(self.url, json=payload, headers=headers)

    def close_flow(self):
        headers = {"Authorization": Voiceflow.API_KEY}

        return requests.delete(self.url[:len(self.url) - 18], headers=headers)

def main():
    vf = Voiceflow("1")
    print(vf.launch_workflow( {"myVar": 'a'} ).text)
    print(vf.send_text( {}, "I'd like to be connected to the head of the sales department for a strategic partnership discussion.").text)
    # print(vf.send_intent( {}, "I'd like to be connected to the head of the sales department for a strategic partnership discussion.", "" ).text)
    print(vf.close_flow().text)

if __name__ == "__main__":
    main()
