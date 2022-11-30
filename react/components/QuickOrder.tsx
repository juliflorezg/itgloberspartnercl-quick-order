import React, {useRef, useState, useEffect} from "react"
import {useMutation, useLazyQuery} from 'react-apollo'
// import {useLazyQuery} from 'react-apollo'
import UPDATE_CART from '../graphql/updateCart.gql'
import GET_PRODUCT from '../graphql/getProductBySku.gql'
import { useCssHandles } from "vtex.css-handles"
// import { generateBlockClass } from "@vtex/css-handles"
import styles from './styles.css'

interface Props {
  blockClass: string
  vendor: string
}

const QuickOrder:React.FC<Props> = ({vendor}) => {
  const [inputText, setInputText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [showError, setShowError] = useState(false)
  const [searchValue, setSearchValue] = useState<string>("")

  const [getProductData, {data: product, error}] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)
  const CSS_CLASSES = [
    "quickOrder__container",
    "quickOrder__title",
    "quickOrder__title--vendor",
    "quickOrder__form",
    "quickOrder__form--main-container",
    "quickOrder__form--main-container-label",
    "quickOrder__form--main-container-input",
    "quickOrder__form--submit",
  ]
  const handles = useCssHandles(CSS_CLASSES)

  useEffect(() => {
    console.log('El resultado de mi producto es:', product, searchValue, error)

    if(product){
      // alert('Sku valido')
      // const {productId} = product.product
      let skuId = parseInt(inputText)
      addToCart({
        variables: {
          salesChannel: '1',
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
      .then(() => {
        window.location.href = '/checkout'
      })
    }
  }, [product, searchValue])

  const addProductToCart = () => {
    // here we'll put our mutation
    console.log(inputText);
    console.trace()
    getProductData({
      variables : {
        sku: inputText
      }
    })
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Aquí voy a subir mis datos')
    if(!inputText){
      setShowError(() => true)
      // setShowError(true)
      if(inputRef.current) inputRef.current.focus()
      setTimeout(() => setShowError(false), 4000);
    } else {
      // here we'll perform the search and look up for product data
      console.log("VAMOS A BUSCAR:", inputText);
      // setSearchValue(() => inputText)
      // setTimeout(() => {
      //   addProductToCart()
      // }, 500);
      setSearchValue(inputText)
      addProductToCart()
    }
  }
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value)

    console.log('Input has changed:', inputText);
  }

  return (
    // ? note about generateBlockClass: don't use generateBlockClass along with useCssHandles, it'll put the custom blockClass (from json file) twice
    ////<div className={ generateBlockClass(handles['quickOrder__container'], blockClass)} >
    <div className={handles['quickOrder__container']} >
      <h2 className={handles['quickOrder__title']}>Compra rápida en <span className={handles['quickOrder__title--vendor']}>{vendor}</span></h2>
      <form onSubmit={handleFormSubmit} className={handles['quickOrder__form']}>
        <div className={handles['quickOrder__form--main-container']}>
          <label
            htmlFor="skuInput"
            className={handles['quickOrder__form--main-container-label']}
            >
            Ingresa el número de SKU
          </label>
          <input
            type="text"
            name="skuInput"
            id="skuInput"
            onChange={handleInputChange}
            ref={inputRef}
            className={handles['quickOrder__form--main-container-input']}
            />
          {showError && <p className={styles.errorMessage}>Por favor introduce un valor de SKU</p>}

        </div>
        <input
          type="submit"
          value="AÑADIR AL CARRITO"
          className={handles['quickOrder__form--submit']}
          />
      </form>
    </div>
  )

}

export default QuickOrder
