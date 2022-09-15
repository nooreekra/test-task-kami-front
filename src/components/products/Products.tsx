import React, { useEffect, useState } from 'react'
import styles from './products.module.scss'
import common from '../../assets/scss/common.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { deleteProductTC, getAllProductsTC, LoaderType, ProductType } from '../../store/reducers/app-reducer';
import {  useAppSelector } from '../../hooks/hooks';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import Records from './pagination/Records';

export type PriceByCities = {
  [key: number]: number
}

export type Product = {
  id: string,
  images: string[],
  title: string,
  description: string,
  status: boolean,
  price: PriceByCities | number
}

export enum ROUTES {
  CREATE = '/products/create'
}

const DEFAULT_PAGE = 1;

export const Products = () => {
  const products: ProductType[] = useAppSelector(state => state.app.products)
  const dispatch = useDispatch<any>()
  const [selected, setSelected] = useState<string[]>([])
  const [inputText, setInputText] = useState("");
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);

  useEffect(() => {
    dispatch(getAllProductsTC())
  }, [])

  const deleteProducts = () => {
    //@ts-ignore
    dispatch(deleteProductTC(selected))
    setSelected([])
  }


  const inputHandler = (e: any) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const getSearch = () => {
    dispatch(getAllProductsTC(inputText))
    setCurrentPage(DEFAULT_PAGE)
  }

  return (
    <div className={common.container}>
      <div className={styles.header}>
        <div className={styles.add}>
          <h3>Товары {products.length}</h3>
          <Link to={ROUTES.CREATE}>
            <Button
              variant="contained"
              color="success">
              Добавить
            </Button>
          </Link>
        </div>
        {
          !selected.length && <div className={styles.searchbar}>
            <TextField
              id="outlined-basic"
              variant="outlined"
              onChange={inputHandler}
              fullWidth
              label="Поиск"
            />
            <Button variant="contained" onClick={getSearch}><SearchIcon /></Button>
          </div>
        }


        {
          !!selected.length && <div className={styles.deletebar}>
            <h4>Выбрано {selected.length}</h4>
            <Button variant="outlined" color="error" onClick={deleteProducts} startIcon={<DeleteIcon />}>Удалить</Button>
          </div>
        }
      </div>
      <div className={styles.products}>
        <Records
          products={products}
          selected={selected}
          setSelected={setSelected}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>

  )
}