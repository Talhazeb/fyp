import pytest
import httpx

@pytest.mark.asyncio
async def test_signup():
    url = "http://localhost:5252/compod/signup"
    async with httpx.AsyncClient() as client:
        # Successful case
        response = await client.post(url, json={"email": "newuser@test.com", "password": "password", "firstname": "Firstname", "lastname": "Lastname"})
        assert response.status_code == 200
        assert response.json() == {'result': 'success'}
        
        # Attempt to create user with same email
        response = await client.post(url, json={"email": "newuser@test.com", "password": "password2", "firstname": "Firstname", "lastname": "Lastname"})
        assert response.status_code == 400
        assert response.json() == {"detail": "Email already registered"}

@pytest.mark.asyncio
async def test_login():
    url = "http://localhost:5252/compod/login"
    async with httpx.AsyncClient() as client:
        # Successful case
        response = await client.post(url, json={"email": "newuser@test.com", "password": "password"})
        assert response.status_code == 200
        assert response.json() == {'result': 'success', 'firstname': 'Firstname', 'lastname': 'Lastname', 'email': 'newuser@test.com'}
        
        # Invalid credentials
        response = await client.post(url, json={"email": "newuser@test.com", "password": "wrongpassword"})
        assert response.status_code == 400
        assert response.json() == {"detail": "Invalid login details"}

if __name__ == '__main__':
    pytest.main([__file__])