import React, { useState } from 'react'
import 'antd/dist/antd.css'
import {
    Card,
    Input,
    Icon,
    Button,
    Spin,
    message
} from 'antd'

import '../static/css/Login.css'

import axios from 'axios'
import servicePath from '../config/apiUrl'

function Login(props) {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const checkLogin = () => {
        setIsLoading(true)
        if(!userName || !password) {
            message.error('用户名或密码不能为空！')
            setTimeout(() => {
                setIsLoading(false)
            }, 500)
            return false
        }

        let dataProps = {
            'userName': userName,
            'password': password
        }

        axios({
            method: 'post',
            url: servicePath.checkLogin,
            data: dataProps,
            withCredentials: true
        }).then(
            res => {
                setIsLoading(false)
                if(res.data.data == '登录成功') {
                    localStorage.setItem('openId', res.data.openId)
                    props.history.push('/index')
                } else {
                    message.error('用户名或者密码错误！')
                    setTimeout(() => {
                        setIsLoading(false)
                    }, 500)
                }
            }
        )
    }

    return (
        <div className="login-div">
            <Spin tip="loading..." spinning={isLoading}>
                <Card title="fxh blog system" bordered={true} style={{width:400}}>
                    <Input id="userName" size="large"
                        placeholder="Enter your userName" 
                        prefix={<Icon type="user" style={{color:'rgba(0, 0, 0, .25'}} />}
                        onChange={(e) => {setUserName(e.target.value)}}
                    />
                    <Input.Password id="password" size="large"
                        placeholder="Enter your password" 
                        prefix={<Icon type="key" style={{color:'rgba(0, 0, 0, .25'}} />}
                        onChange={(e) => {setPassword(e.target.value)}}
                    />

                    <Button type="primary" size="large" block onClick={checkLogin}>Login</Button>
                </Card>
            </Spin>
        </div>
    )
}

export default Login