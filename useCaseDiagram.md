usecaseDiagram
actor User
actor "Nutrition Engine" as NE
actor "Food Database" as FD

User --> (Register)
User --> (Login)
User --> (Logout)

User --> (Create Profile)
User --> (Update Profile)
User --> (View Profile)

User --> (Calculate Daily Calories)
User --> (Calculate Daily Protein)
(Calculate Daily Calories) --> NE
(Calculate Daily Protein) --> NE

User --> (Search Food)
(Search Food) --> FD
User --> (Add Custom Food)

User --> (Log Meal)
User --> (Edit Meal)
User --> (Delete Meal)
User --> (View Food Log)

User --> (View Remaining Nutrition)
User --> (Get Food Suggestions)

User --> (View Daily Summary)
User --> (View Weekly Analytics)
