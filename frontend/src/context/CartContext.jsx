import { createContext, useContext, useReducer, useEffect } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(i => i.id === action.payload.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.payload.id
              ? { ...i, qty: i.qty + (action.payload.qty || 1) }
              : i
          )
        }
      }
      return { ...state, items: [...state.items, { ...action.payload, qty: action.payload.qty || 1 }] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(i => i.id !== action.payload) }
    case 'UPDATE_QTY':
      if (action.payload.qty < 1) return state
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.payload.id ? { ...i, qty: action.payload.qty } : i
        )
      }
    case 'CLEAR_CART':
      return { ...state, items: [], coupon: null, discount: 0 }
    case 'APPLY_COUPON':
      return { ...state, coupon: action.payload.code, discount: action.payload.discount }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null, discount: 0 }
    case 'LOAD_CART':
      return action.payload
    default:
      return state
  }
}

const initialState = { items: [], coupon: null, discount: 0 }

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState, () => {
    try {
      const saved = localStorage.getItem('cosmo_cart')
      return saved ? JSON.parse(saved) : initialState
    } catch { return initialState }
  })

  useEffect(() => {
    localStorage.setItem('cosmo_cart', JSON.stringify(state))
  }, [state])

  const addToCart = (product, qty = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { ...product, qty } })
    toast.success(`${product.name} sepete eklendi`, { duration: 2000 })
  }

  const removeFromCart = (id) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id })
    toast.success('Ürün sepetten çıkarıldı')
  }

  const updateQty = (id, qty) => {
    dispatch({ type: 'UPDATE_QTY', payload: { id, qty } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  const applyCoupon = (code, discount) => {
    dispatch({ type: 'APPLY_COUPON', payload: { code, discount } })
  }

  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' })

  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0)
  const discountAmount = state.discount > 0
    ? (state.discount < 1 ? subtotal * state.discount : state.discount)
    : 0
  const shipping = subtotal >= 500 ? 0 : 49.90
  const total = subtotal - discountAmount + shipping
  const count = state.items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{
      items: state.items,
      coupon: state.coupon,
      discount: state.discount,
      subtotal,
      discountAmount,
      shipping,
      total,
      count,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      applyCoupon,
      removeCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
