from util.imagemodel import ImageModel
from groq import Groq
import base64
from IPython.display import Image
from util.voiceflow import Voiceflow
import json
from util.screenshot import Screenshot

class Productivity:
    total = 0

    _PROMPT = "You are an expert in assessing productivity based on visual evidence. \
        Please rate the productivity level of the individual based on the screenshot \
            of their computer screen. Use a scale of 1 to 10, where 1 represents extremely \
                unproductive (e.g., distractions, irrelevant websites, or low-focus activities) \
                    and 10 represents extremely productive (e.g., focused work, multiple work-related tasks, or high efficiency).\n\
                In your response, provide:\n\
                1. A brief explanation of your assessment.\n\
                2. The final productivity rating (an integer between 1 and 10).\n\
                Consider factors like the types of activities being performed, the number of distractions visible, and how much the tasks seem to be aligned with productive work."
    
    @staticmethod
    def rate_productivity():
        client = Groq()
        llava_model = 'llava-v1.5-7b-4096-preview'
        image_path = 'util/Screenshots/screenshot.png'
        Image(image_path)
        base64_image = ImageModel.encode_image(image_path)
        return ImageModel.image_to_text(client, llava_model, base64_image, Productivity._PROMPT)

    @staticmethod
    def number_extractor(result):
        vf = Voiceflow("1")
        vf.launch_workflow( {} ).text
        res = vf.send_text( {}, result).text
        vf.close_flow().text
        return res
    
    @staticmethod
    def run_productivity():
        Screenshot.capture_and_save()
        result = Productivity.rate_productivity()
        print(result)
        
        children = json.loads(Productivity.number_extractor(result))
        children = children[1]["payload"]["slate"]["content"][0]["children"]
        print("=== children ===")
        print(children)
        for child in children:
            if (child["text"] >= '1' and child["text"] <= '9') or child["text"] == '10':
                return child["text"]
        return '5'




def main():
    result = Productivity.rate_productivity()
    print(result)
    print(Productivity.number_extractor(result))
    

if __name__ == "__main__":
    main()