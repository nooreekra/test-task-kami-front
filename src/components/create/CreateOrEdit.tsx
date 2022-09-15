import React, { useEffect, useRef, useState } from 'react'
import ReactMde from "react-mde";
import Showdown from "showdown";
import "react-mde/lib/styles/css/react-mde-all.css";
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styles from './create.module.scss'
import common from '../../assets/scss/common.module.scss'
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import ImageUploader from 'react-images-upload';
import Checkbox from '@mui/material/Checkbox';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useFormik } from 'formik';
import { ProductAPI } from '../../api/api';
import * as yup from 'yup';
import { CityType } from '../../store/reducers/app-reducer';
import { ROUTES } from '../../App';
import { useAppSelector } from '../../hooks/hooks';


const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true
});


export const CreateOrEdit = () => {
  const cities: CityType[] = useAppSelector(state => state.app.cities)
  const [priceForAll, setPriceForAll] = useState(true)
  const [error, setError] = useState(false)
  const [value, setValue] = useState("");
  const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
  const [pictures, setPictures] = useState<string[]>([])

  const params = useParams();
  const navigate = useNavigate();


  if (priceForAll) {
    var uniquePrice = yup.number()
    var forAllPrice = yup
      .number()
      .integer()
      .positive('Цена должна быть целым и положительным числом')
  } else {
    uniquePrice = yup
      .number()
      .integer()
      .positive('Цена должна быть целым и положительным числом')
    forAllPrice = yup.number()
  }

  const validationSchema = yup.object({
    title: yup.string()
      .min(2, 'Название должно состоять как минимум из 2 символов')
      .required('Поле название обязательное'),
    images: yup
      .array()
      .min(1, 'Нужно загрузить как минимум 1 изображение')
      .required(),
    price: forAllPrice,
    1: uniquePrice,
    2: uniquePrice,
    3: uniquePrice,
    4: uniquePrice,
    description: yup.string().required('Поле описание обязательное')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      price: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      isActive: 1,
      images: []
    },
    validationSchema: validationSchema,
    onSubmit: values => {
      const { isActive, title, description, images, price } = values;

      let sbody: any = {
        _id: params.id,
        isActive: !!isActive,
        title,
        description,
        images,
        isSinglePrice: false,
        price: Math.max(formik.values[1], formik.values[2], formik.values[3], formik.values[4]),
        priceByCity: cities.map((c) => {
          return {
            id: c.id,
            price: values[c.id as keyof typeof values]
          }
        })
      }
      if (priceForAll) {
        sbody = { ...sbody, priceByCity: null, price, isSinglePrice: true }
      }

      params.id
        ? ProductAPI.update(sbody)
          .then((res) => {
            navigate('/')
          }).catch(() => {
            alert('Не все поля были заполнены')
          })
        : ProductAPI.create(sbody)
          .then((res) => {
            navigate('/')
          }).catch(() => {
            alert('Не все поля были заполнены')
          })
    },
  });

  // GET request to product data if Edit 

  useEffect(() => {
    if (params.id) {
      ProductAPI.getOne(params.id).then((res) => {
        const product = res.data
        formik.setFieldValue('title', product.title)
        formik.setFieldValue('description', product.description)
        setValue(product.description)
        formik.setFieldValue('images', product.images)
        setPictures(product.images)
        formik.setFieldValue('isActive', product.isActive ? 1 : 0)
        if (product.isSinglePrice) {
          formik.setFieldValue('price', product.price)
        } else {
          product.priceByCity.map((e) => formik.setFieldValue(`${e.id}`, e.price))
          setPriceForAll(false)
        }
      })
    }
  }, [])


  const onPriceForAll = () => {
    setPriceForAll(!priceForAll)
  }

  const onDrop = (pictureFiles: any, pictureDataURLs: any) => {
    setError(false)
    formik.setFieldValue('images', pictureDataURLs)
    setPictures(pictureDataURLs)
  }

  const renderCounter = useRef(0);
  renderCounter.current = renderCounter.current + 1;

  return (
    <div className={common.container}>
      <form onSubmit={formik.handleSubmit}>
        <div className={styles.header}>
          <Link to={ROUTES.PRODUCTS}>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
            >
              Назад
            </Button>
          </Link>
          <h3>Добавить товар</h3>
        </div>
        <div className={styles.content}>
          <div className={styles.productInfo}>
            <div>
              <h4>Название товара</h4>
              <TextField
                id="title"
                variant="outlined"
                fullWidth
                label="Название"
                error={formik.touched.title && Boolean(formik.errors.title)}
                onChange={formik.handleChange}
                value={formik.values.title}
                helperText={formik.touched.title && formik.errors.title}
              />
            </div>
            <div>
              <h4>Описание товара</h4>
              <ReactMde
                value={value}
                onChange={(v) => {
                  formik.setFieldValue('description', v)
                  setValue(v)
                }}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
                generateMarkdownPreview={markdown =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
              {formik.touched.description && <p className={styles.errorText}>{formik.errors.description}</p>}
            </div>
            <div>
              <h4>Медиа</h4>
              <ImageUploader
                withIcon={true}
                buttonText='Choose images'
                accept='accept=image'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                withPreview={true}
                className={styles.mediaUploader}
                // @ts-ignore // NOTE Ошибка билблиотеки (не учли типизацию defaultImages)
                defaultImages={pictures}
              />
              {formik.touched.images && <p className={styles.errorText}>{formik.errors.images}</p>}
            </div>
            <div>
              <h4>Цена</h4>
              <div className={styles.price}>
                <div className={styles.priceForAll}>
                  <Checkbox
                    checked={priceForAll}
                    onChange={onPriceForAll}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  <h4>Одна цена для всех городов</h4>
                  <FormControl fullWidth sx={{ m: 1 }} className={styles.priceForAllInput} disabled={!priceForAll}>
                    <InputLabel>Цена</InputLabel>
                    <OutlinedInput
                      id="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      type="number"
                      endAdornment={<InputAdornment position="end">₸</InputAdornment>}
                      label="Amount"
                      error={formik.touched.price && Boolean(formik.errors.price)}
                    />
                  </FormControl>
                  {formik.touched.price && <p className={styles.errorText}>{formik.errors.price}</p>}
                </div>

                {
                  !priceForAll && <div>
                    <table className={styles.table}>
                      <thead>
                        <tr>
                          <th>Город</th>
                          <th>Цена</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          cities.map((e: any) => {
                            return <tr key={e.id}>
                              <td>{e.name}</td>
                              <td>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                  <InputLabel htmlFor="outlined-adornment-amount">Цена</InputLabel>
                                  <OutlinedInput
                                    id={e.id}
                                    type="number"
                                    value={formik.values[e.id as keyof typeof formik.values]}
                                    onChange={formik.handleChange}
                                    endAdornment={<InputAdornment position="end">₸</InputAdornment>}
                                    label="Amount"
                                    error={formik.touched.price && Boolean(formik.errors.price)}
                                  />
                                </FormControl>
                                {formik.touched[e.id as keyof typeof formik.values] && <p className={styles.errorText}>{formik.errors[e.id as keyof typeof formik.values]}</p>}
                              </td>
                            </tr>
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                }
              </div>

            </div>
          </div>

          <div className={styles.productStatus}>
            <h4>Статус товара</h4>
            <FormControl fullWidth>
              <InputLabel>Статус</InputLabel>
              <Select
                id="isActive"
                label="Статус"
                value={formik.values.isActive}
                onChange={(e) => {
                  formik.setFieldValue('isActive', e.target.value)
                }}
              >
                <MenuItem value={1}>Active</MenuItem>
                <MenuItem value={0}>Archive</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>

        <div className={styles.saveOrCancel}>
          <Link to={ROUTES.PRODUCTS}><Button variant="contained" >Отмена</Button></Link>
          <Button
            variant="contained"
            color="success"
            type="submit"
            disabled={params.id ? Boolean(renderCounter.current < 4) : false}
          >
            Сохранить
          </Button>
        </div>
      </form>
    </div >
  )
}
