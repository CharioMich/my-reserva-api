# my-reserva-api

This is a Node.js + Express backend with Typescript for "myReserva" full stack personal project. <br>
Frontend part repo link: https://github.com/CharioMich/myReserva-app <br>

## Run instructions
To run the API:
  - Clone the repo:
  ``` git clone git@github.com:CharioMich/my-reserva-api.git ``` (SSH)
  - In the root directory, in a terminal run ``` npm install ```
  - In the root directory (where src lives), create a .env file ``` touch .env ```
  - Copy the .env.example variables into .env and set the variables accordingly. <br>
  for this step you will need to have a MondoDB cluster so you can provide the connection string
  - After setting up the env variables, run in the terminal ``` npm run dev ```
  - You should see in the terminal something like: <br>
  ![Terminal Screenshot](./src/assets/terminal.png)
  - Optionally, browse to http://localhost:3000/api/api-docs/ (change port if running other than 3000) for Swagger API documentation.

