from voiceflow import Voiceflow

class MockText:

    @staticmethod
    def mock(text):
        vf = Voiceflow("2")
        res = vf.launch_workflow({"isMock": "True", "mock": text}).json()[0]
        children = res["payload"]["slate"]["content"]
        for child in children:
            for text in child["children"]:
                if text["text"] != "":
                    return text["text"]

