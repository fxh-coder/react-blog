'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const { ctx } = this;
        ctx.body = 'api';
    }

    async getArticleList() {
        let sql = 'select article.id as id ,' +
            'article.title as title ,' +
            'article.introduce as introduce ,' +
            "FROM_UNIXTIME(article.addTime, '%Y-%m-%d %H:%i:%s') as addTime ," +
            'article.view_count as view_count ,' +
            'type.typeName as typeName ' +
            'from article left join type on article.type_id = type.id';

        const results = await this.app.mysql.query(sql);
        this.ctx.body = { data: results };
    }

    async getArticleById() {
        let id = this.ctx.params.id;

        let sql = 'select article.id as id ,' +
            'article.title as title ,' +
            'article.introduce as introduce ,' +
            'article.article_content as article_content ,' +
            "FROM_UNIXTIME(article.addTime, '%Y-%m-%d %H:%i:%s') as addTime ," +
            'article.view_count as view_count ,' +
            'type.typeName as typeName ,' +
            'type.id as typeId ' +
            'from article left join type on article.type_id = type.id ' +
            'where article.id=' + id;

        const result = await this.app.mysql.query(sql);
        this.ctx.body = { data: result };
    }

    // 得到类别名称和编号
    async getTypeInfo() {
        const result = await this.app.mysql.select('type')
        this.ctx.body = { data: result }
    }

    // 根据类别ID获得文章列表
    async getListById() {
        const id = this.ctx.params.id;
        
        const sql = 'select article.id as id,' +
            'article.title as title,' +
            'article.introduce as introduce,' +
            "FROM_UNIXTIME(article.addTime,'%Y-%m-%d %H:%i:%s' ) as addTime," +
            'article.view_count as view_count ,' +
            'type.typeName as typeName ' +
            'from article left join type on article.type_id = type.id ' +
            'where type_id=' + id;
        const result = await this.app.mysql.query(sql);
        this.ctx.body = { data: result };
    }
}

module.exports = HomeController;
