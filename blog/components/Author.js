import {
    Avatar,
    Divider
} from 'antd'
import '../public/style/components/author.css'

const Author = () => {
    return (
        <div className="author-div comm-box">
            <div><Avatar size={100} src="http://blogimages.jspang.com/blogtouxiang1.jpg" /></div>
            <div className="author-introduction">
                非常喜欢代码的一个程序员，专注于Web和移动前端开发，
                梦想是希望成为一名非常厉害的coder大牛，随心所欲的
                编写代码，生活美满！
                <Divider>社交帐号</Divider>
                <Avatar size={28} icon="github" className="account" />
                <Avatar size={28} icon="qq" className="account" />
                <Avatar size={28} icon="wechat" className="account" />
            </div>
        </div>
    )
}

export default Author