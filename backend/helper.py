
from fastapi import HTTPException
from email.message import EmailMessage
import openai
import smtplib

HEADERS = {
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json"
}

async def openAIQuery(query):
    try:
        messages = [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": query}
        ]
        
        print("messages: ", messages)

        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=1000,
            n=1,
            temperature=0.5,
            top_p=1,
        )
        
        print("test return", response['choices'][0]['message']['content'])

        if 'choices' in response and len(response['choices']) > 0:
            return response['choices'][0]['message']['content']
    except openai.OpenAIError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return 'Error: No response from AI'



async def send_reset_email(email: str, token: str):
    msg = EmailMessage()
    msg.set_content(
        'Please reset your password using this link: http://185.130.227.124/reset-password?token=' + token)

    msg['Subject'] = 'Password Reset'
    msg['From'] = "talhazeb12321@gmail.com"
    msg['To'] = email

    # Start a secure SMTP connection
    s = smtplib.SMTP('smtp.gmail.com', 587)
    s.starttls()  # start TLS for security
    s.login(msg['From'], "talha12321")  # login with email and password
    s.send_message(msg)
    s.quit()
