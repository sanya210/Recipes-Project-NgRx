import { Ingredient } from "../../shared/ingredient.model";
import * as ShoppingListActions from "./shopping-list.actions"; // to avoid silly typos in identifier name

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editedIngredientIndex: number;
}


const initialState ={ ingredients : [
    new Ingredient('aalooo', 1),
    new Ingredient('tamatar', 10),
],
editedIngredient: null,
editedIngredientIndex: -1 
}; 

export function shoppingListReducer(
    state = initialState, 
    action: ShoppingListActions.ShoppingListActionsUnion){

    switch(action.type){
        case ShoppingListActions.ADD_INGREDIENT:
            return {
                ...state,
                ingredients: [...state.ingredients, action.payload]
            };

        case ShoppingListActions.ADD_INGREDIENTS:
            return {
                ...state,
                ingredients: [...state.ingredients, ...action.payload]
            };

        case ShoppingListActions.UPDATE_INGREDIENT:
            const ingredient = state.ingredients[state.editedIngredientIndex];
            const updateIngredient = {
                ...ingredient,
                ...action.payload
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[state.editedIngredientIndex] = updateIngredient;
            return{
                ...state,
                ingredients: updatedIngredients,
                editedIngredientIndex : -1,
                editedIngredient: null
            };

        case ShoppingListActions.DELETE_INGREDIENT:
            return{
                ...state,
                ingredients : state.ingredients.filter((ig, igIndex) => {
                    return igIndex !== state.editedIngredientIndex  ;
                }),
                editedIngredientIndex : -1,
                editedIngredient: null  
            };

        case ShoppingListActions.START_EDIT:
            return{
                ...state,
                editedIngredientIndex : action.payload,
                editedIngredient: {...state.ingredients[action.payload]}
            };

        case ShoppingListActions.STOP_EDIT:
            return{
                ...state,
                editedIngredient: null,
                editedIngredientIndex: -1
            };
        default:
            return state; // when app loads initially we need initial state
    }
}