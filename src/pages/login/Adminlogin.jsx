import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import STATUSES from '../../globals/status/statuses'
import Form from './form/login'
import { login, setStatus, setToken, setUser } from '../../../store/authSlice'

const Login = () => {
  const { user, status,token } = useSelector(state => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
console.log("k x"+token)
console.log("www"+user)
console.log("123"+status)


  const handleLogin = (data) => {
    dispatch(login(data))

  }

  useEffect(() => {
    if(status === STATUSES.SUCCESS && token){
      localStorage.setItem('token', token)
      navigate('/')
      dispatch(setStatus(null))
    }
  }, [status, user, navigate, dispatch])

  return <Form type='Login' user={user} onSubmit={handleLogin} />
}

export default Login
