import React from 'react'
import styles from './pagination.module.scss'

type PaginationPropsType = {
    nPages: number
    currentPage: number
    setCurrentPage: (n: number) => void
}

const Pagination = (props: PaginationPropsType) => {
    const { nPages, currentPage, setCurrentPage } = props

    const pageNumbers = Array.from({ length: nPages }, (_, index) => index + 1);

    const nextPage = () => {
        if (currentPage !== nPages)
            setCurrentPage(currentPage + 1)
    }

    const prevPage = () => {
        if (currentPage !== 1)
            setCurrentPage(currentPage - 1)
    }

    return (
        <div className={styles.pagination}>
            <ul>
                <a href="#" onClick={prevPage}><li className={`${currentPage === 1 ? styles.disabled : ''}`}>Previous</li></a>
                {pageNumbers.map(pgNumber => (

                    <a onClick={() => { setCurrentPage(pgNumber) }}
                        className='page-link'
                        href="#" key={pgNumber}>
                            <li key={pgNumber}
                            className={`${currentPage === pgNumber ? styles.active : ''}`}>
                                {pgNumber}
                            </li>
                    </a>

                ))}

                <a onClick={nextPage} href="#"><li className={`${currentPage === nPages ? styles.disabled : ''}`}>Next</li></a>
            </ul>
        </div>
    )
}

export default Pagination