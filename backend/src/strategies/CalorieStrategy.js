/**
 * Strategy Pattern — Calorie & Protein Calculation Strategies
 * Different strategies apply based on user's fitness goal.
 */

// Abstract Strategy (base class)
class CalorieStrategy {
  calculate(bmr, activityMultiplier) {
    throw new Error('calculate() must be implemented by subclass');
  }

  getProteinTarget(weightKg) {
    throw new Error('getProteinTarget() must be implemented by subclass');
  }

  getDescription() {
    throw new Error('getDescription() must be implemented by subclass');
  }
}

// Concrete Strategy — Weight Loss (20% caloric deficit)
class WeightLossStrategy extends CalorieStrategy {
  calculate(bmr, activityMultiplier) {
    return Math.round(bmr * activityMultiplier * 0.80);
  }

  getProteinTarget(weightKg) {
    return Math.round(weightKg * 1.8); // Higher protein to preserve muscle
  }

  getDescription() {
    return 'Weight Loss (20% deficit)';
  }
}

// Concrete Strategy — Maintenance (maintenance calories = TDEE)
class MaintenanceStrategy extends CalorieStrategy {
  calculate(bmr, activityMultiplier) {
    return Math.round(bmr * activityMultiplier);
  }

  getProteinTarget(weightKg) {
    return Math.round(weightKg * 1.6);
  }

  getDescription() {
    return 'Maintenance (TDEE)';
  }
}

// Concrete Strategy — Muscle Gain (10% caloric surplus)
class MuscleGainStrategy extends CalorieStrategy {
  calculate(bmr, activityMultiplier) {
    return Math.round(bmr * activityMultiplier * 1.10);
  }

  getProteinTarget(weightKg) {
    return Math.round(weightKg * 2.0); // Max protein for muscle synthesis
  }

  getDescription() {
    return 'Muscle Gain (10% surplus)';
  }
}

// Factory — Creates the correct strategy based on goal string
class CalorieStrategyFactory {
  static getStrategy(goal) {
    switch (goal) {
      case 'weight_loss':  return new WeightLossStrategy();
      case 'muscle_gain':  return new MuscleGainStrategy();
      case 'maintenance':
      default:             return new MaintenanceStrategy();
    }
  }
}

module.exports = { CalorieStrategy, WeightLossStrategy, MaintenanceStrategy, MuscleGainStrategy, CalorieStrategyFactory };
