
let unitName = "すべて";
let heisyuName = "未指定";
let hyoujiNaiyou = "成長率";

const App = {
    data() {
        return {
            unitGroups: {},
            heisyuList: [],
            sortKoumoku: "",
            sortRule: "",
            result: []
        };
    },
    created() {
        // ユニット一覧
        let groupName = "";
        for (const unit of unitList) {
            if (groupName !== unit.kuni) {
                groupName = unit.kuni;
                this.unitGroups[groupName] = [];
            }
            this.unitGroups[groupName].push(unit.name);
        }

        // 兵種一覧
        this.heisyuList.push({name: "専用兵種", isDlc: false});
        for (const heisyu of kihonHeisyuList) {
            this.heisyuList.push(heisyu);
        }

        // 初回検索
        this.search();
    },
    methods: {
        onChangeUnit(e) {
            unitName = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeHeisyu(e) {
            heisyuName = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeHyoujiNaiyou(e) {
            hyoujiNaiyou = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onClickKoumoku(koumoku) {
            if (this.sortKoumoku !== koumoku) {
                this.sortRule = "";
            }
            this.sortKoumoku = koumoku;
            if (this.sortRule === "") {
                this.sortRule = "降順";
            }
            else if (this.sortRule === "降順") {
                this.sortRule = "昇順";
            }
            else {
                this.sortRule = "";
            }
            this.search();
        },
        search() {
            // ユニットデータ取得
            let tmpUnitList = [];
            if (unitName === "すべて") {
                tmpUnitList = unitList;
            }
            else {
                for (const unit of unitList) {
                    if (unit.name === unitName) {
                        tmpUnitList.push(unit);
                        break;
                    }
                }
            }

            // TODO 兵種データ取得

            // 表示用にデータを加工する
            const result = [];
            for (const unit of tmpUnitList) {
                let data = null;
                if (hyoujiNaiyou === "成長率") {
                    data = {name: unit.name, ...unit.seityouritu};
                }
                else if (hyoujiNaiyou === "上限値") {
                    data = {name: unit.name, ...unit.jougenti};
                }
                result.push(data);
            }
            if (this.sortKoumoku === "" || this.sortRule === "") {
                this.result = result;
            }
            else {
                this.result = result.sort((a, b) => {
                    if (this.sortRule === "昇順") {
                        return a[this.sortKoumoku] - b[this.sortKoumoku];
                    }
                    else if (this.sortRule === "降順") {
                        return b[this.sortKoumoku] - a[this.sortKoumoku];
                    }
                    else {
                        return 0;
                    }
                });
            }
        },
    }
};

Vue.createApp(App).mount("#app");
