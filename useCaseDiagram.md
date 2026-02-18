```mermaid
graph LR

    %% Actor
    U((User))

    %% System Boundary
    subgraph System["Personal Diet Planner System"]
        direction TB

        %% Authentication
        subgraph Auth["Authentication"]
            UC1(Register)
            UC2(Login)
            UC3(Logout)
        end

        %% Profile Module
        subgraph Profile["Profile Management"]
            UC4(View Profile)
            UC5(Update Profile)
            UC6(Change Password)
        end

        %% Goal Module
        subgraph GoalModule["Nutrition Goals"]
            UC7(Calculate Daily Calories)
            UC8(Calculate Protein Target)
            UC9(View Daily Nutrition Goals)
        end

        %% Food Module
        subgraph FoodModule["Food Management"]
            UC10(Search Food Items)
            UC11(Add Custom Food)
            UC12(View Food Details)
        end

        %% Meal Module
        subgraph MealModule["Meal Tracking"]
            UC13(Log Meal)
            UC14(Edit Meal Entry)
            UC15(Delete Meal Entry)
            UC16(View Daily Food Log)
            UC17(View Remaining Nutrition)
        end

        %% Suggestion Module
        subgraph SuggestionModule["Smart Suggestions"]
            UC18(Get Food Suggestions)
        end

        %% Analytics Module
        subgraph Analytics["Reports & Analytics"]
            UC19(View Daily Summary)
            UC20(View Weekly Progress)
            UC21(View Nutrition Trends)
        end
    end

    %% Styling
    style U fill:#f9f,stroke:#333,stroke-width:2px

    %% User Relations
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8
    U --> UC9
    U --> UC10
    U --> UC11
    U --> UC12
    U --> UC13
    U --> UC14
    U --> UC15
    U --> UC16
    U --> UC17
    U --> UC18
    U --> UC19
    U --> UC20
    U --> UC21

    %% Include / Extend Relationships
    UC13 -.-> UC17
    UC18 -.-> UC17
    UC7 -.-> UC9
    UC8 -.-> UC9
    
 ```