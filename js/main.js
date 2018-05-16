import newsSection from './newsSection.js'
import {fnNewsListTemplate, fnNewsCompanyList} from '../templates/news.js'

document.addEventListener("DOMContentLoaded", () => {
    const url = "http://127.0.0.1:8080/data/newslist.json";
    const news = new newsSection(url);
    news.init(fnNewsListTemplate, fnNewsCompanyList);
});