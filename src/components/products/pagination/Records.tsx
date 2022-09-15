import React, { useState } from 'react'
import styles from '../products.module.scss'
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { LoaderType, ProductType } from '../../../store/reducers/app-reducer';
import Pagination from './Pagination';
import { useAppSelector } from '../../../hooks/hooks';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

type RecordsPropsType = {
    selected: string[]
    setSelected: (selected: string[]) => void
    products: ProductType[]
    currentPage: number
    setCurrentPage: (currentPage: number) => void
}

const PER_PAGE = 5;


const Records = (props: RecordsPropsType) => {
    const navigate = useNavigate();
    const isLoading: LoaderType = useAppSelector(state => state.app.isLoading)
    const { selected, setSelected, products, currentPage, setCurrentPage } = props

    const indexOfLastRecord = currentPage * PER_PAGE;
    const indexOfFirstRecord = indexOfLastRecord - PER_PAGE;
    const currentRecords = products.slice(indexOfFirstRecord, indexOfLastRecord);
    const nPages = Math.ceil(products.length / PER_PAGE)


    const isItemSelected = (id: string): boolean => {
        return !!selected.find((e: string) => e === id)
    }

    const onItemSelected = (event: any, id: string) => {
        event.stopPropagation();
        const value = event.currentTarget.checked
        if (value) {
            setSelected([...selected, id])
        } else {
            const filtered = selected.filter(e => e !== id)
            setSelected(filtered)
        }

    }

    const onAllItemsSelected = (e: any) => {
        setSelected(e.currentTarget.checked ? currentRecords.map(el => el._id) : [])
    }

    const filteredData = products.filter((el) => {
        return currentRecords.find(e => e === el)
    })

    return (
        <>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>
                            <Checkbox
                                checked={selected.length === currentRecords.length}
                                onChange={onAllItemsSelected}
                            />
                        </th>
                        <th></th>
                        <th>Название</th>
                        <th>Статус</th>
                        <th>Цена</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredData.map((e: ProductType) => {
                            return <tr key={e._id} className={styles.productRows} onClick={() => {
                                navigate(`/products/edit/${e._id}`)
                            }}>
                                <td>
                                    <Checkbox
                                        checked={isItemSelected(e._id)}
                                        onChange={(event) => onItemSelected(event, e._id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                </td>
                                <td><img src={e.images[0]} alt={e.title} /></td>
                                <td className={styles.bold}>{e.title}</td>
                                <td>{e.isActive ? 'Active' : 'Archive'}</td>
                                <td>{e.price}</td>
                            </tr>
                        })
                    }
                </tbody>
            </table>
            { isLoading && <LinearProgress /> }
            <Pagination
                nPages={nPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        </>
    )
}

export default Records