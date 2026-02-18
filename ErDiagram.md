```mermaid

USER {
  int id PK
  string name
  string email
  string password
  int age
  float height
  float weight
  string goal
}

FOOD {
  int id PK
  string name
  float calories
  float protein
}

MEAL_LOG {
  int id PK
  int user_id FK
  int food_id FK
  date meal_date
  string meal_type
  float quantity
}

USER ||--o{ MEAL_LOG : logs
FOOD ||--o{ MEAL_LOG : used_in
```