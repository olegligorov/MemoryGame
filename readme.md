# Memory game
## pages:
- Login page
- Register page
- Index page(Home page)
- Game page

## Game page
- 3 game options: 16cards, 36cards, 64cards.  
- Start and restart buttons   
- Timer    

When two cards are opened and they are the same they are kept opened, if they aren't the same they are shaked and closed   
When there aren't any cards left to be opened the game is finished and the function isUsersBestRecord checks whether this is the user's best record.     
If it is the best record then the record is saved in the firestore database and the older records for that game type are deleted.

## Registration form: email, password, confirm password. 
Input validation
Check whether the email is valid and not already taken
If the registration is successfull add the user to the database and redirect the user to the game page

## Login form: email, password
if the login credentials are valid go to the game page

## Leaderboard
There are 4 options:
- view all the records
- view the records for 16cards
- view the records for 36cards
- view the records for 64cards

The user's records are in a different color and increased font size
