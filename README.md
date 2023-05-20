# BeeVote

## Idea Board
This is an interactive idea board application built with Django and React.

### Overview
The application provides a platform for users to share, discuss, and vote on ideas. Each idea belongs to a board, and users can participate in voting on any board to which they have access.

### Features

1. **User Authentication**: Users can register, login, and logout.
2. **Boards**: Users can create boards, view a list of all boards, view details of a board, update a board's details, and delete a board.
3. **Ideas**: Users can add ideas to a board, view a list of all ideas on a board, view details of an idea, update an idea's details, delete an idea, and reorder ideas on a board.
4. **Voting**: Users can vote on ideas. The voting system shows the total number of positive and negative votes, whether a vote has majority, and blocks voting after a predefined deadline (voting_end).
### Installation and Setup
To run this project locally:

Backend
1. Navigate to the backend directory.
2. reate a virtual environment: **`python3 -m venv venv`**
3. Activate the virtual environment: **`source venv/bin/activate`** (Linux/Mac) or **`.\venv\Scripts\activate`** (Windows)
4. Install the requirements: **`pip install -r requirements.txt`**
5. Run the migrations: **`python manage.py migrate`**
6. Run the server: **`python manage.py runserver`**

Frontend
1. Navigate to the frontend directory.
2. Install the dependencies: **`npm install`**
3. Start the application: **`npm start`**

### Tech Stack
**Backend**: Django, Django Rest Framework
**Frontend**: React, Axios
**Styling**: React-Bootstrap'

### Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License
The project BeeVote can only be used for the benefit of the Creative Society project.
