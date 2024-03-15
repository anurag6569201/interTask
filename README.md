# Internship Task: Event Posting and User Interaction

Welcome to our internship task repository! This project focuses on implementing event posting functionality with user interaction features. The main objectives of this task include:

1. Allow users to post events.
2. Enable users to like events.
3. Implement categorization of global users and user-specific categorization.

## Snapshots of the UI and Web app

![Image 1](https://github.com/anurag6569201/interTask/blob/main/readmeImages/1.jpg)
![Image 2](https://github.com/anurag6569201/interTask/blob/main/readmeImages/2.jpg)
![Image 3](https://github.com/anurag6569201/interTask/blob/main/readmeImages/3.jpg)
![Image 4](https://github.com/anurag6569201/interTask/blob/main/readmeImages/4.jpg)
![Image 5](https://github.com/anurag6569201/interTask/blob/main/readmeImages/5.jpg)

### 1. Event Posting
Users can post events with details such as name of the event,date, time,location and price. These events will be visible to all users.

### 2. User Interaction
Users can like events to show their interest or appreciation. Each event will display the number of likes it has received.

### 3. Categorization
#### Global Event Categorization
Events that are posted by all the users in the platform.

#### User-Specific Event Categorization
Users can see events that they have posted.

## Technologies Used

- Frontend: HTML, CSS, JavaScript, bootstrap
- Backend: Django, Python
- Database: MySQL

## How to Use

1. Clone this repository to your local machine.
2. Install Python dependencies using the provided `requirements.txt` file. Run the following command:
   ```bash
   pip install -r requirements.txt
3. Set up MySQL and configure database settings in the backend.
4. For MySQL setup go to the intern/settings.py and search for database code
5. Apply migrations to create necessary database tables:
   ```bash
   python manage.py migrate
6. Run the Django development server:
   ```bash
   python manage.py runserver
8. Access the application through your browser.

## Contact

For any inquiries or further information, feel free to contact us at [email@anuragsingh6569201@gmail.com.com](mailto:anuragsingh6569201@gmail.com).

Thank you for considering this internship task and happy coding!
