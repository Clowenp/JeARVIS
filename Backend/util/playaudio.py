import simpleaudio as sa
import os

class AudioPlayer:
    
    @staticmethod
    def play_wav(file_path):
        if not os.path.exists(file_path): # check exists
            print(f"Error: The file '{file_path}' does not exist.")
            return

        if not file_path.lower().endswith('.wav'): # check exists wave
            print("Error: This script only supports .wav files.")
            return

        try:
            wave_obj = sa.WaveObject.from_wave_file(file_path) # load wav
            
            # play & wait
            play_obj = wave_obj.play()
            play_obj.wait_done()
            
            print("Audio playback completed.")
        except Exception as e:
            print(f"An error occurred while playing the audio: {str(e)}")