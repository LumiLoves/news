export default class newsSection {
    constructor(fetchUrl) {
        this.fetchUrl = fetchUrl;
        this.templateFns = {};
        this.newsContentMap = new Map();
        this.newsSectionElement = document.querySelector(".content");
        this.currentNewsIdx = 0;
        this.newsList = null;
    }

    init(fnNewsListTemplate, fnNewsCompanyList) {
        this.fetchData(this.fetchUrl);
        this.templateFns.fnNewsListTemplate = fnNewsListTemplate;
        this.templateFns.fnNewsCompanyList = fnNewsCompanyList;
    }

    renderNewsContent(htmlString) {
        this.newsSectionElement.innerHTML = htmlString;
    }

    isAnchorTag(nodeName) {
        return nodeName === 'A'
    }

    pagingClickHandler(target) {
        if (!this.isAnchorTag(target.nodeName)) return;

        const direction = target.closest("div").className;
        const newsLenth = this.newsList.length;

        if (direction === "right") this.currentNewsIdx++;
        else this.currentNewsIdx--;

        if (this.currentNewsIdx === newsLenth) this.currentNewsIdx = 0;
        if (this.currentNewsIdx === -1) this.currentNewsIdx = newsLenth - 1;

        this.renderNewsContent(this.newsList[this.currentNewsIdx])
    }

    navigationClickHandler(target) {
        if (!this.isAnchorTag(target.nodeName)) return;

        const name = target.dataset.name;
        const matchedHTML = this.newsContentMap.get(name);
        this.renderNewsContent(matchedHTML)
    }

    registerEvents() {
        const buttonWrap = document.querySelector(".btn");
        buttonWrap.addEventListener("click", ({target}) => this.pagingClickHandler(target));

        const newsNavigation = document.querySelector(".newsNavigation");
        newsNavigation.addEventListener("click", ({target}) => this.navigationClickHandler(target));
    }

    fetchData(url) {
        fetch(url)
            .then(res => res.json())
            .then(this.makeNewsContentMap.bind(this))
            .then(this.renderFirstUI.bind(this));
    }

    makeNewsContentMap(obj) {
        obj.forEach((news) => {
            const contentHTML = this.templateFns.fnNewsListTemplate(news);
            const company = news.company;
            this.newsContentMap.set(company, contentHTML);
        });

        this.newsList = this.getNewsListType(this.newsContentMap);
        this.companyNameList = this.getCompnayNameList(this.newsContentMap);

        this.registerEvents();
    }

    getNewsListType(mapData) {
        return [...mapData.values()];
    }

    getCompnayNameList(mapData) {
        return [...mapData.keys()];
    }

    renderFirstUI() {
        this.renderFirstContent();
        this.renderNavList();
    }

    renderFirstContent() {
        const firstData = this.newsList[0];
        this.renderNewsContent(firstData);
    }

    renderNavList() {
        const navList = this.companyNameList;
        document.querySelector(".mainArea .newsNavigation").innerHTML = this.templateFns.fnNewsCompanyList(navList);
    }
}
