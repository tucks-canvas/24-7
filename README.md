# 24-7 - Autocare
## Description:
Autocare is a full-service automotive platform that empowers users to access a wide range of vehicle services, including parts purchasing, vehicle rentals, mechanical repairs (battery, tires, oil changes), detailing services, and roadside recovery. 

The application delivers an optimised user experience through intuitive navigation, secure authentication flows, intelligent service booking systems, advanced search filtering, comprehensive profile management, and location-aware workshop discovery.

## Demo: 
![Demo Video](demo.mp4)

## Screens: 
### 1. Authentication:
	i. Sign (sign.tsx) - Handles both user login and registration.

	   Features:
	   a. Toggle between login and signup views.
	   b. Form validation for email, username, and password.
	   c. Password visibility toggle.
	   d. Social login buttons (Facebook, Google - placeholder).
	   e. Navigation to "Forgot Password" screen.
	   f. Error handling and loading states.

	ii. Code (code.tsx) - Verifies the 4-digit reset code sent to the user's email.

        Features:
	    a. Input fields for each digit of the code (auto-focus and navigation between fields).
	    b. Resend code functionality.
	    c. Validation and submission to proceed to password reset.
	    d. Error handling and loading states.

	iii. New (new.tsx) - Allows users to set a new password after verification.

	     Features:
	     a. Input fields for new password and confirmation.
	     b. Password visibility toggle.
	     c. Validation for password matching and length.
	     d. Submission to update password.
	     e. Error handling and loading states.

	iv. Forgot (forgot.tsx) - Initiates the password reset process.

	    Features:
	    a. Email input for sending a reset code.
	    b. Navigation to the "Code" screen upon successful submission.
        c. Error handling and loading states.

## 2. Onboarding Screens:
	i. Loading (loading.tsx) - Displays a splash screen while the app initialises or authenticates the user.

	ii. Onboarding (onboarding.tsx)- Introduces the app's features to new users through a series of slides or interactive screens.

	    Features:
	    a. Separated by a three-slide carousel.
	    b. Pagination of the three-slide carousel.
	    c. Navigation through the three-slide carousel

## 3. Services:
	i. Service (service.tsx) - Displays detailed information about a selected service.

	   Features:
	   a. Service image, title, price, and description.
       b. User ratings and usage statistics.
	   c. Checkbox for additional options (e.g., "I need parts for my vehicle").
	   d. Emergency vehicle information section (location, model).
	   e. "Book Now" button to proceed to booking.

## 4. System:
	i. Edit (edit.tsx) - Allows users to edit their profile information.

	   Features:
	   a. Profile photo upload/edit functionality.
	   b. Input fields for first name, last name, username (non-editable), and location.
	   c. Save button to update profile data.
	   d. Error handling and loading states for photo upload and data submission.

## 5. Tabs:
	i. Home (home.tsx) - Main screen displaying services, rentals, and selling options.

	   Features:
	   a. Search functionality to filter services.
	   b. Category tabs (Services, Rent, Selling).
	   c. Scrollable list of services with images, titles, and descriptions.
	   d. Navigation to service details

	ii. History (Present but Not Implemented) - Would display the user's past service bookings or transactions.

	    Features: Not implemented in the provided code.

	iii. Profile (profile.tsx) - Displays user profile and settings.

	     Features:
	     a. Profile photo, username, and location.
	     b. Edit profile button (navigates to "Edit" screen).
	     c. Menu options for history, notifications, settings, support, and logout.
	     d. Toggle for enabling/disabling notifications.
	     e. Logout functionality with confirmation.

	iv. Workshop (Present but Not Implemented) - Would display workshop-related information or services.

        Features: Not implemented in the provided code.
 
# How to operate it?

#### Note Briefly: These instructions were made under the assumption that you are:

1. Running your code on a Windows device

2. Using VSCode 

3. Have GIT already installed.

## Git

1. In PowerShell, run git clone 'git clone 'https://github.com/tucks-canvas/24-7.git'.

2. Navigate to the project and run in VSCode

## Frontend
### 1. NPM and Node.js

   a. Download and install npm (https://github.com/coreybutler/nvm-windows), allow all recommended permissions - especially PATH-related conditions.

   b. Download and install Node.js (https://nodejs.org/en/download), all recommended permissions, especially PATH-related conditions.

   c. In PowerShell, using nvm -v, node -v, and npm -v, check if all were installed.

   d. Thereafter, give them permissions on your system using 'Set-ExecutionPolicy RemoteSigned -Scope CurrentUser'
   
### 3. Emulator
   
   a. Download Android Studio Emulator

   b. After installation is finished, navigate to Virtual Device Manager, and install the Google API versions of Android Version you prefer. I recommend 29 and 30.

   c. To prevent errors due to your graphics card, make sure to go to advance settings in the device creation, and change graphics to 'Software'. Reduce cores to 4, and RAM to 2 - 4.

   d. Once that's done, navigate to your environmental variables:

      a. Under System Variables, click PATH, press Edit and add: 
    
	     i. C:\Users\<your-username>\AppData\Local\Android\Sdk\platform-tools

         ii. C:\Users\<your-username>\AppData\Local\Android\Sdk\emulator

      b. Under User Variables, click new and add: 
         
         i. name: ANDROID_HOME; value: C:\Users\<your-username>\AppData\Local\Android\Sdk.

         ii. name: ANDROID_SDK_ROOT; value: C:\Users\<your-username>\AppData\Local\Android\Sdk.


## Backend
### 1. Python
    
    a. Install Python in order to get your project started (https://www.python.org/downloads/release/python-3133/). Ensure Python is allowed to create a path.
    
    b. Navigate to the backend by typing in 'cd backend'
    
    c. Create an environment for installation using the following prompts: 
       i. python -m venv venv
       
       ii. .\venv\Scripts\activate
    
    d. Run the requirements file using 'pip install -r requirements.txt'
    
    e. (If necessary, upgrade using) python.exe -m pip install --upgrade pip
     
### 2. Database
    
    i. PostgreSQL
    
    a. Install Postgresql (https://www.enterprisedb.com/downloads/postgres-postgresql-downloads), ensure to click all the items it suggests, stackbuilder, etc. 
       Once the installation is complete and the stackbuilder and loads. Select:
       
       1. pgAdmin 4
       2. Postgis
       3. PL/Python

       Drivers:
       1. ODBC Driver
       2. psqlodbc
    
    b. Once your installation is finished, create a user '24-7_user' by right-clicking on Login/User Role, and pressing Create > Login/User Role, give it the password '247project'.
       For testing purposes, select all permissions under 'Privileges'.
    
    c. Thereafter create a database by right-clicking Database and pressing Create > Database.
    
       ii. Terminal
	    
	   a. Navigate to your backend using 'cd backend', if you haven't already, and run the following functions: 
	
	      i. flask db init
		
	      ii. flask db migrate -m "Create tables"
		
	      iii. flask db upgrade
			
### 3. SMTP:

    a. Using an SMTP (my preferred one - https://mailtrap.io/home), navigate to sandbox, create an inbox, click on it, and retrieve the following:
       Host, Port, Username, Password, Auth, TLS - Hover to copy
   
    b. Thereafter, update the .env in your backend folder.

### Running
#### 1. Backend
    a. Once you're done:
           
	   i. Navigate to cd backend if you haven't already.
           
	   ii. Enter:
           
	       a. python -m venv venv
	       
	       b. .\venv\Scripts\activate
   
        iii. By pressing Ctrl + J, then the add button at the top right corner, run the Python file using 'flask run' in the terminal 


#### 2. Frontend
    a. Once you're done:
        i. Press the add button once more, and navigate to cd frontend.
           
	   ii. Enter 'npx expo start'
           
	   iii. Ensure the Android Emulator Device you chose is running, then press A to load the application to the device
           
	   iv. Change the IP Address in api.ts. (IMPORTANT!)
