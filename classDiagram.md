```mermaid
class User {
  +id: int
  +name: string
  +email: string
  +password: string
  +age: int
  +height: float
  +weight: float
  +goal: string
}

class Food {
  +id: int
  +name: string
  +calories: float
  +protein: float
}

class MealLog {
  +id: int
  +date: Date
  +mealType: string
  +quantity: float
}

class NutritionService {
  +calculateCalories()
  +calculateProtein()
  +remainingNutrition()
}

class SuggestionService {
  +suggestFoods()
}

User "1" --> "many" MealLog
Food "1" --> "many" MealLog
NutritionService --> User
SuggestionService --> Food
```