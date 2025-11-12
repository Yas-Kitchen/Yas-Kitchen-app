export interface UserTypes {
  id?: string;
  name: string;
  number: string;
  category: string;
  status: string;
  joindate: string;
  dietPlan: boolean;
  meal_plan_id?: string; 
  onStatusChange?: () => void;
}