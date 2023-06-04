from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import uvicorn
import openai
import httpx
import os
import json
import base64
import secrets
from fastapi import BackgroundTasks
from bson.json_util import dumps

from schema.model import UserBase, UserLogin, UserCreate, UserInDB, UserUpdate, Query, Item, openAIsent, PatientInfo
from helper import HEADERS, openAIQuery, send_reset_email

from faster_whisper import WhisperModel
from transcribe import roman_translate, extraction_model, Symptoms_data, Medication_data, Disease_data, Cause_data, Report, piority_dict, open_dict
import Clinial_NER_model as CNM

import random
from bson.objectid import ObjectId

# Import cors
from fastapi.middleware.cors import CORSMiddleware

# CORSMiddleware allows us to accept requests from any origin

origins = [
    "*",
]

app = FastAPI()

# Add the middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Allows cookies
    allow_methods=["*"], # Allows all methods, GET, POST, PUT, DELETE, etc.
    allow_headers=["*"], # Allows all headers, everything from the frontend
)

load_dotenv()
openai.api_key = os.getenv('OPENAI_API_KEY')
ACCESS_TOKEN = None
global whisper_model

wv = None
neg_tokens = None
symptoms_list = None
medication_list = None
disease_list = None
cause_list = None
mdl = None
report = None
piority_eng_dict = None
open_eng_dict = None


HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json"
}


class MongoDB:
    def __init__(self):
        self.client = AsyncIOMotorClient(os.getenv('MONGODB_URI'))
        self.db = self.client['users_db']

    async def close_db(self):
        self.client.close()


mongo_db = MongoDB()

@app.on_event("startup")
async def startup_event():
    global whisper_model
    global wv, neg_tokens, symptoms_list, medication_list, disease_list, cause_list, mdl, report, piority_eng_dict, open_eng_dict
    
    print("Loading Pretrained Models and Data")
    neg_tokens = ["not","n't"]
    symptoms_list = Symptoms_data()
    medication_list = Medication_data()
    disease_list = Disease_data()
    cause_list = Cause_data()
    mdl = extraction_model(symptoms_list,medication_list,disease_list,cause_list,neg_tokens)
    report =Report()
    piority_eng_dict = piority_dict()
    open_eng_dict = open_dict()
    print("Pretrained Models and Data Loaded")
    
    print("Loading Whisper Model")
    whisper_model = WhisperModel("medium", device="cuda", compute_type="float16")
    print("Whisper Model Loaded")
    

@app.on_event("shutdown")
async def shutdown_event():
    await mongo_db.close_db()


@app.post("/compod/signup")
async def signup(user: UserCreate, db: MongoDB = Depends()):
    existing_user = await db.db.users.find_one({'email': user.email})

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    else:
        await db.db.users.insert_one(user.dict())
        return {'result': 'success'}


@app.post("/compod/login")
async def login(user: UserLogin, db: MongoDB = Depends()):
    db_user = await db.db.users.find_one({'email': user.email, 'password': user.password})

    if db_user is None:
        raise HTTPException(status_code=400, detail="Invalid login details")
    else:
        return {'result': 'success', 'firstname': db_user['firstname'], 'lastname': db_user['lastname'], 'email': db_user['email']}


@app.post("/compod/forgot-password")
async def forgot_password(email: UserBase, background_tasks: BackgroundTasks, db: MongoDB = Depends()):
    # Look for a user with the provided email
    user = await db.db.users.find_one({"email": email.email})

    if user is None:
        # If the user does not exist, return a generic error message. This way, an attacker cannot use this endpoint to figure out which emails are registered.
        return {"result": "If an account with this email exists, we've sent them an email with reset instructions."}

    # Generate a unique token
    token = secrets.token_urlsafe()

    # Store the token in the user's record in the database
    await db.db.users.update_one({"email": email.email}, {"$set": {"reset_token": token}})

    # Use a background task to send the reset email asynchronously
    background_tasks.add_task(send_reset_email, email.email, token)

    return {"result": "If an account with this email exists, we've sent them an email with reset instructions."}


@app.post("/compod/reset-password/")
async def reset_password(token: str = Form(...), new_password: str = Form(...), db: MongoDB = Depends()):
    # Look for a user with the provided reset token
    user = await db.db.users.find_one({"reset_token": token})

    if user is None:
        # If no user exists with this reset token, return an error
        raise HTTPException(
            status_code=400, detail="Invalid password reset token")

    # Update the user's password and clear the reset token
    await db.db.users.update_one({"reset_token": token}, {"$set": {"password": new_password, "reset_token": None}})

    return {"result": "Your password has been reset successfully."}


@app.get("/compod/profile/{email}")
async def profile(email: str, db: MongoDB = Depends()):
    user = await db.db.users.find_one({'email': email})

    if user is None:
        raise HTTPException(status_code=400, detail="User not found")
    else:
        return {'firstname': user['firstname'], 'lastname': user['lastname'], 'email': user['email']}


@app.put("/compod/profile/{email}")
async def update_profile(email: str, user: UserUpdate, db: MongoDB = Depends()):
    db_user = await db.db.users.find_one({'email': email})

    if db_user is None:
        raise HTTPException(status_code=400, detail="User not found")
    else:
        # Only include fields in the update that are not None
        update_data = {k: v for k, v in user.dict().items() if v is not None}

        await db.db.users.update_one({'email': email}, {'$set': update_data})
        return {'result': 'success'}


@app.post("/compod/summary")
async def openAIFunc(query: openAIsent):
    answer = await openAIQuery("Create a summary in bullets format for: " + query.query)
    return {'answer': answer}

async def get_access_token():
    global ACCESS_TOKEN
    urlR = "https://api-gw.medznmore.com/auth/authentication/refresh-token"
    data = {
        "grantType": "REFRESH_TOKEN",
        "refreshToken": os.getenv('MEDZNMORE_REFRESH_TOKEN'),
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(urlR, headers=HEADERS, json=data)
        print(response.json())
        
    ACCESS_TOKEN = response.json()['access_token']
    
@app.post("/compod/medicines")
async def medicines(query):
    global ACCESS_TOKEN

    if ACCESS_TOKEN is None:
        await get_access_token()

    url = "https://api-gw.medznmore.com/b2c/v1/solr/product/search"
    headers = HEADERS.copy()
    headers["authorization"] = "Bearer " + ACCESS_TOKEN

    params = {
        "keyword": query,
        "pageNumber": 1,
        "pageSize": 10
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params=params)

    # Check if the access token has expired 
    if response.status_code == 401:
        # Refresh the token and redo the request
        await get_access_token()
        headers["authorization"] = "Bearer " + ACCESS_TOKEN
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers, params=params)

    # If the status code is still 401, raise an exception
    if response.status_code == 401:
        raise HTTPException(status_code=401, detail="Unauthorized")

    products = response.json()['products']

    return {'products': products}

@app.post("/compod/gptAnalysis")
async def gpt_ask(item: openAIsent):
    query = item.query
    language = item.language
    print("Query: ", query)
    print("Language: ", language)
    if language == 'english':
        query = "Following is the transcription of Doctor and Patient. Provide Temperature, Blood Pressure, Symptoms, Medication, Disease, Cause, Test if any out of it. Provide it in this format {'temperature':'','bloodPressure':[],'symptoms':[],'medication':[],'disease':[],'cause':[],'test':[]}. If no answer is found due to some reason, return the same empty json in the format given. The transcription of doctor and patient is: " + query
    elif language == 'urdu':
        query = "Following is the transcription of Doctor and Patient in URDU. Provide Temperature, Blood Pressure, Symptoms, Medication, Disease, Cause, Test in URDU if any out of it. Provide it in this JSON format ONLY WITHOUT ANY URDU TEXT OUTSIDE IT {'temperature':'','bloodPressure':[],'symptoms':[],'medication':[],'disease':[],'cause':[],'test':[]}. If no answer is found due to some reason, return the same empty json in the format given. The transcription of doctor and patient is: " + query
    else:
        query = "Following is the transcription of Doctor and Patient in ROMAN URDU. Provide Temperature, Blood Pressure, Symptoms, Medication, Disease, Cause, Test if any out of it. Provide it in this format {'temperature':'','bloodPressure':[],'symptoms':[],'medication':[],'disease':[],'cause':[],'test':[]}. If no answer is found due to some reason, return the same empty json in the format given. The transcription of doctor and patient is: " + query

    try:
        print("Query Final: ", query)
        answer = await openAIQuery(query)
        print("Answer: ", answer)
        answer = answer.replace("'", '"')
        json_data = json.loads(answer)
        print("JSON Data: ", json_data)
        return {'answer': json_data}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error occurred during analysis")
    
@app.post("/compod/savePatientInfo")
async def save_patient_info(patient_info: PatientInfo, db: MongoDB = Depends()):
    # Generate a 5-digit unique ID for the patient_info.id and make sure that id is also not present in the database
    unique_id = str(random.randint(10000, 99999))
    while await db.db.patient_info.find_one({"id": unique_id}):
        unique_id = str(random.randint(10000, 99999))

    patient_info_dict = patient_info.dict()
    patient_info_dict["patientInfo"]["id"] = unique_id

    print(json.dumps(patient_info_dict))

    # Insert the patient information into the MongoDB collection
    await db.db.patient_info.insert_one(patient_info_dict)

    # Return a success response
    return {'result': 'success'}
    
    # Return a success response
    return {'result': 'success'}

@app.get("/compod/allPatients")
async def all_patients(db: MongoDB = Depends()):
    # Find all patient documents in the MongoDB collection
    patients = await db.db.patient_info.find().to_list(length=100)  # specify a maximum length

    patients_json = dumps(patients)
    
    # Return a JSON response containing the list of patient information objects
    return {'result': 'success', 'patients': patients_json}

@app.post("/compod/transcribe")
async def transcribe(language: str = Form(...), audio_data: UploadFile = File(...)):
    print(language)
    audio_file = await audio_data.read()
    audio_base64 = base64.b64encode(audio_file).decode('utf-8')

    with open('temp.wav', 'wb') as f:    
            f.write(base64.b64decode(audio_base64)) 
            
    if language == 'romanurdu' or language == 'urdu':
        segments, info = whisper_model.transcribe("temp.wav", language='ur')
    else:
        segments, info = whisper_model.transcribe("temp.wav", language='en')
    
    transcription = " ".join([segment.text for segment in segments])
    
    if language == 'romanurdu':
        transcription = roman_translate(transcription)
        print(transcription)
    
    problem, treatment, test = CNM.Report_Generation(transcription)
    
    
    mdl.predict(transcription)
    
    data = dict()
        
    data["temperature"] = mdl.dict.get("temperature", None)
    data["blood pressure"] = mdl.dict.get("blood pressure", None)
    data["symptoms"] = list(mdl.dict["symptoms"])
    data["medication"] = list(mdl.dict["medication"])
    data["disease"] = list(mdl.dict["disease"])
    data["cause"] = list(mdl.dict["cause"])  
    data["medication"].extend(treatment)
    data['disease'].extend(problem)
    data["test"] = test
    
    # Remove string having # from the list
    data["symptoms"] = [i for i in data["symptoms"] if "#" not in i]
    data["medication"] = [i for i in data["medication"] if "#" not in i]
    data["disease"] = [i for i in data["disease"] if "#" not in i]
    data["cause"] = [i for i in data["cause"] if "#" not in i]
    data["test"] = [i for i in data["test"] if "#" not in i]
    
    # # Clear the dictionary
    for key in mdl.dict:
        # If temperature set it to 0 else []
        if key == "temperature":
            mdl.dict[key] = 0
        else:
            mdl.dict[key] = set()
    
    print(data)
    
    rpt= data
    
    return {'transcription': transcription, 'report': rpt}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5252, reload=True)
