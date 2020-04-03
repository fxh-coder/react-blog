import React, { useState, useEffect } from 'react'
import marked from 'marked'
import '../static/css/AddArticle.css'
import { Row, Col, Input, Select, Button, DatePicker, message } from 'antd'
import axios from 'axios'
import servicePath from '../config/apiUrl'

const { Option } = Select;
const { TextArea } = Input;

function AddArticle(props) {

    const [articleId, setArticleId] = useState(0)  // 文章的ID，如果是0说明是新增加，如果不是0，说明是修改
    const [articleTitle, setArticleTitle] = useState('')   //文章标题
    const [articleContent, setArticleContent] = useState('')  //markdown的编辑内容
    const [markdownContent, setMarkdownContent] = useState('预览内容') //html内容
    const [introducemd, setIntroducemd] = useState()            //简介的markdown内容
    const [introducehtml, setIntroducehtml] = useState('等待编辑...') //简介的html内容
    const [showDate, setShowDate] = useState()   //发布日期
    const [updateDate, setUpdateDate] = useState() //修改日志的日期
    const [typeInfo, setTypeInfo] = useState([]) // 文章类别信息
    const [selectedType, setSelectType] = useState('请选择类型') //选择的文章类别

    useEffect(() => {
        getTypeInfo()
        let tmpId = props.match.params.id
        if (tmpId) {
            setArticleId(tmpId)
            getArticleById(tmpId)
        }
    }, [])

    const renderer = new marked.Renderer();
    marked.setOptions({
        renderer: renderer,
        gfm: true,
        pedantic: false,
        sanitize: false,
        tables: true,
        breaks: false,
        smartLists: true,
        smartypants: false,
    });

    const changeContent = (e) => {
        setArticleContent(e.target.value)
        let html = marked(e.target.value)
        setMarkdownContent(html)
    }

    const changeIntroduce = (e) => {
        setIntroducemd(e.target.value)
        let html = marked(e.target.value)
        setIntroducehtml(html)
    }

    const getTypeInfo = () => {
        axios({
            method: 'get',
            url: servicePath.getTypeInfo,
            withCredentials: true
        }).then(
            res => {
                if(res.data.data == '没有登录') {
                    localStorage.removeItem('openId')
                    props.history.push('/')
                } else {
                    setTypeInfo(res.data.data)
                }
            }
        )
    }

    const getArticleById = (id) => {
        axios(servicePath.getArticleById + id, {
            withCredentials: true,
            header: { 'Access-Control-Allow-Origin': '*' }
        }).then(
            res => {
                setArticleTitle(res.data.data[0].title)
                setArticleContent(res.data.data[0].article_content)
                let html = marked(res.data.data[0].article_content)
                setMarkdownContent(html)
                setIntroducemd(res.data.data[0].introduce)
                let tmpInt = marked(res.data.data[0].introduce)
                setIntroducehtml(tmpInt)
                setShowDate(res.data.data[0].addTime)
                setSelectType(res.data.data[0].typeId)
            }
        )
    }
    
    const selectTypeHandler = (value) => {
        setSelectType(value)
    }

    const saveArticle = () => {
        if(!selectedType) {
            message.error('必须选择文章类型')
            return false
        } else if(!articleTitle) {
            message.error('文章名称不能为空')
            return false
        } else if(!articleContent) {
            message.error('文章内容不能为空')
            return false
        } else if(!introducemd) {
            message.error('文章简介不能为空')
            return false
        } else if(!showDate) {
            message.error('发布日期不能为空')
            return false
        }

        let dataProps = {}
        console.log(selectedType)
        dataProps.type_id = selectedType
        dataProps.title = articleTitle
        dataProps.article_content = articleContent
        dataProps.introduce = introducemd
        let datetext = showDate.replace('-', '/')
        dataProps.addTime = (new Date(datetext).getTime()) / 1000

        if (articleId == 0) {
            dataProps.view_count = 0
            axios({
                method: 'post',
                url: servicePath.addArticle,
                header: { 'Access-Control-Allow-Origin': '*' },
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    setArticleId(res.data.insertId)
                    if (res.data.isScuccess) {
                        message.success('文章发布成功')
                    } else {
                        message.error('文章发布失败');
                    }

                }
            )
        } else {
            dataProps.id = articleId
            axios({
                method: 'post',
                url: servicePath.updateArticle,
                header: { 'Access-Control-Allow-Origin': '*' },
                data: dataProps,
                withCredentials: true
            }).then(
                res => {
                    if (res.data.isScuccess) {
                        message.success('文章保存成功')
                    } else {
                        message.error('保存失败');
                    }
                }
            )
        }
    }

    return (
        <div>
            <Row gutter={10}>
                <Col span={18}>
                    <Row gutter={10} style={{marginBottom: 15}}>
                        <Col span={20}>
                            <Input
                                value={articleTitle}
                                placeholder="博客标题"
                                size="large"
                                onChange={e => {setArticleTitle(e.target.value)}}
                            />
                        </Col>
                        <Col span={4} style={{textAlign: 'right'}}>
                            <Select defaultValue={selectedType}
                                onChange={selectTypeHandler}
                                size="large"
                             >
                               {
                                   typeInfo.map((item, index) => {
                                        return (
                                            <Option value={item.id} key={index}>{item.typeName}</Option>
                                        )
                                   })
                               }
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={12}>
                            <TextArea 
                                value={articleContent}
                                className="markdown-content"
                                rows={35}
                                placeholder="文章内容"
                                onChange={changeContent}
                            />
                        </Col>
                        <Col span={12}>
                            <div className="show-html"
                                dangerouslySetInnerHTML={{__html: markdownContent}}
                            >

                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Row>
                        <Col span={24} style={{marginBottom: 15}}>
                            <Button size="large" style={{marginRight: 10}}>暂存文章</Button>
                            <Button type="primary" size="large" onClick={saveArticle}>发布文章</Button>
                        </Col>
                        <Col span={24}>
                            <TextArea
                               rows={4} 
                               value={introducemd}
                               placeholder="文章简介"
                               style={{marginBottom: 15}}
                               onChange={changeIntroduce}
                            /> 
                            <div className="introduce-html"
                                dangerouslySetInnerHTML={{__html: introducehtml}}
                            ></div>   
                        </Col>
                        <Col span={12}>
                            <div className="date-select">
                                <DatePicker
                                    onChange={(date, dateString) => {setShowDate(dateString)}}
                                    placeholder="发布日期"
                                    size="large"
                                />
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </div>
    )
}
export default AddArticle
