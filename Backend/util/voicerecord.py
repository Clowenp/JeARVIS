import pyaudio
import wave

class AudioRecorder:
    @staticmethod
    def record_audio(filename, duration=5, sample_rate=44100, chunk=1024):
        audio = pyaudio.PyAudio()

        # Open the microphone stream
        stream = audio.open(format=pyaudio.paInt16,
                            channels=1,
                            rate=sample_rate,
                            input=True,
                            frames_per_buffer=chunk)

        print("Recording...")

        frames = []

        # Record audio for the specified duration
        for i in range(0, int(sample_rate / chunk * duration)):
            data = stream.read(chunk)
            frames.append(data)

        print("Finished recording.")

        # Stop and close the stream
        stream.stop_stream()
        stream.close()
        audio.terminate()

        # Save the recorded data as a WAV file
        with wave.open(filename, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(audio.get_sample_size(pyaudio.paInt16))
            wf.setframerate(sample_rate)
            wf.writeframes(b''.join(frames))

        print(f"Audio saved as {filename}")
