import { Dispatch } from "redux"
import { ProductAPI } from "../../api/api"
import { AppThunkType } from "../store"

const initialState: InitialStateType = {
    products: [] as ProductType[],
    cities: [] as CityType[],
    isLoading: false 
}


export type ActionsType = SetProductsActionType | SetCitiesActionType | DeleteProductsActionType | SetLoaderActionType

export const appReducer = (state: InitialStateType = initialState, action: ActionsType): any => {
    switch (action.type) {
        case 'SET-PRODUCTS': {
            return {
                ...state,
                products: action.products
            }
        }

        case 'SET-CITIES': {
            return {
                ...state,
                cities: action.cities
            }
        }

        case 'DELETE-PRODUCTS': {
           
            return {
                ...state,
                products:  state.products.filter((el) => !action.ids.find((id) => id === el._id))
            }
        }

        case 'SET-LOADER': {
            return {
                ...state,
                isLoading: action.isLoading
            }
        }

        default:
            return state;
    }
}

export type PriceByCityType = {
    id: number, price: number
}

export type ProductType = {
    _id: string;
    title: string;
    description: string;
    images: string[];
    isActive: boolean;
    isSinglePrice: boolean;
    price: number;
    priceByCity: PriceByCityType[];
}

export type CityType = {
    id: number,
    name: string
}

export type LoaderType = {
    isLoading: boolean
}

type InitialStateType = {
    products: ProductType[],
    cities: CityType[],
    isLoading: boolean
}

export type SetProductsActionType = {
    type: 'SET-PRODUCTS',
    products: ProductType[]
}

export type SetCitiesActionType = {
    type: 'SET-CITIES',
    cities: CityType
}

export type DeleteProductsActionType = {
    type: 'DELETE-PRODUCTS',
    ids: String[]
}

export type SetLoaderActionType = {
    type: 'SET-LOADER',
    isLoading: boolean
}

// ACs


export const setProductsAC = (products: ProductType[]): SetProductsActionType => {
    return { type: 'SET-PRODUCTS', products }
}

export const setCitiesAC = (cities: CityType): SetCitiesActionType => {
    return { type: 'SET-CITIES', cities }
}

export const deleteProductsAC = (ids: string[]): DeleteProductsActionType => {
    return { type: 'DELETE-PRODUCTS', ids }
}

export const loadingRequestAC = (isLoading: boolean): SetLoaderActionType => {
    return { type: 'SET-LOADER', isLoading }
}

//TC

export const getAllProductsTC = (t?: string): AppThunkType =>
    async (dispatch: Dispatch<ActionsType>) => {
         dispatch(loadingRequestAC(true));
        try {
            const response = await ProductAPI.getAll(t);
            dispatch(setProductsAC(response.data.products));
        } catch (e) {
            console.log(e)
        } finally {
          dispatch(loadingRequestAC(false));
        }
 };

 export const deleteProductTC = (ids: string[]): AppThunkType =>
    async (dispatch: Dispatch<ActionsType>) => {
         dispatch(loadingRequestAC(true));
        try {
            const response = await ProductAPI.delete(ids);
            dispatch(deleteProductsAC(ids));
        } catch (e) {
            console.log(e)
        } finally {
          dispatch(loadingRequestAC(false));
        }
 };


 export const cities = [
    { "id": 1, "name": "Алматы" },
    { "id": 2, "name": "Актобе" },
    { "id": 3, "name": "Павлодар" },
    { "id": 4, "name": "Нур-Султан" },
]