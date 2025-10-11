from fastapi import FastAPI, File, UploadFile
import whisper
import tempfile
import os

app = FastAPI()

model = whisper.load_model("base")

@app.post("/speech-to-text/")
async def speech_to_text(audio: UploadFile = File(...)):
    # Save the uploaded audio temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio:
        temp_audio.write(await audio.read())
        temp_audio_path = temp_audio.name

    # Transcribe audio using Whisper
    result = model.transcribe(temp_audio_path)
    text = result["text"]

    # Clean up
    os.remove(temp_audio_path)

    return {"transcription": text}
