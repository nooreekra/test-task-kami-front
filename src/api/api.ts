import axios from 'axios';
import { PriceByCityType, ProductType } from '../store/reducers/app-reducer';

const instance = axios.create({
  withCredentials: true,
  baseURL: 'http://195.49.212.94:7542/1.0/',
});


export const ProductAPI = {
    // GET
    getAll(t: string = '') {
        return instance.get<GetAllProductResponseType>(`products/get-all?page=1&search=${t}`);
    },
    getOne(id: string) {
        return instance.get<ProductType>(`products/get-one?id=${id}`);
    },

    // POST
    create(product: Omit<ProductType, "_id">) { 
        return instance.post<CreateProductResponseType>('products/create', {...product});
    },
    delete(ids: string[]) {
        return instance.post<UpdateProductResponseType>('products/delete', { ids });
    },

    // PUT
    update(product: UpdateProductType) {
        return instance.put('products/edit', {...product});
    },
}

export type UpdateProductType =  {
    _id: string;
    title?: string;
    description?: string;
    images?: string[];
    isActive?: boolean;
    isSinglePrice?: boolean;
    price?: number;
    priceByCity?: PriceByCityType[];
}

export type GetAllProductResponseType = {
    products: ProductType[]
}

export type CreateProductResponseType = {
    products: ProductType
}

export type DeleteProductResponseType = {
    deletedIds: string[]
}

export type UpdateProductResponseType = {
    products: ProductType
}