import React, {useRef, useState, useEffect} from "react"
// import {useMutation, useLazyQuery} from 'react-apollo'
import {useLazyQuery} from 'react-apollo'
// import UPDATE_CART from '../graphql/updateCart.gql'
import GET_PRODUCT from '../graphql/getProductBySku.gql'

interface Props {
  vendor: string
}

const QuickOrder:React.FC<Props> = ({vendor}) => {
  const [inputText, setInputText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [showError, setShowError] = useState(false)
  const [searchValue, setSearchValue] = useState<null | string>(null)

  const [getProductData, {data: product}] = useLazyQuery(GET_PRODUCT)
  // const [addToCart] = useMutation(UPDATE_CART)

  useEffect(() => {
    console.log('El resultado de mi producto es:', product, searchValue)
  }, [product, searchValue])

  const addProductToCart = () => {
    // here we'll put our mutation
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
      setTimeout(() => setShowError(false), 3500);
    } else {
      // here we'll perform the search and look up for product data
      console.log("VAMOS A BUSCAR:", inputText);
      setSearchValue(inputText)
      addProductToCart()
    }
  }
  const handleInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    setInputText(e.currentTarget.value)

    console.log('Input has changed:', inputText);
  }

  return (
    <div>
      <h2>Compra rápida en {vendor}</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="skuInput">Ingresa el número de SKU</label>
          <input type="text" name="skuInput" id="skuInput" onChange={(e)=> handleInputChange(e)} ref={inputRef}/>
          {showError && <p>Por favor introduce un valor de SKU</p>}

        </div>
        <input type="submit" value="AÑADIR AL CARRITO"/>
      </form>
    </div>
  )

}

export default QuickOrder
