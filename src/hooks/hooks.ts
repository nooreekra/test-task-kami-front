import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux"
import { AppDispatch, AppRootStateType } from "../store/store"

export const useAppDispatch: () => AppDispatch = useDispatch<any>
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector