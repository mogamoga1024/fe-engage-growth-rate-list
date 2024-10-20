
let hyoujiNaiyou = "成長率";

const App = {
    data() {
        return {
            unitGroups: {},
            heisyuList: [],
            unitName: "すべて",
            heisyuName: "なし",
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
        for (const heisyu of kihonHeisyuList) {
            this.heisyuList.push(heisyu);
        }

        // 初回検索
        this.search();
    },
    methods: {
        onChangeUnit(e) {
            this.unitName = e.target.value;
            if (this.heisyuName === "すべて") {
                this.heisyuName = "なし";
            }
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeHeisyu(e) {
            this.heisyuName = e.target.value;
            if (this.unitName === "すべて") {
                this.unitName = "なし";
            }
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
            let tmpUnitList = [];

            // 兵種データをすべて表示する場合はユニットのように扱う
            if (this.heisyuName === "すべて") {
                tmpUnitList = senyouHeisyuList.concat(kihonHeisyuList);
            }
            else if (this.unitName === "なし") {
                if (this.heisyuName === "専用兵種") {
                    tmpUnitList = senyouHeisyuList;
                }
                else if (this.heisyuName === "専用兵種以外") {
                    tmpUnitList = kihonHeisyuList;
                }
                else if (this.heisyuName === "なし") {
                    this.result = [];
                    return;
                }
                else {
                    // todo
                }
            }
            // すべてのユニットデータ取得
            else if (this.unitName === "すべて") {
                tmpUnitList = unitList;
            }
            // 個別のユニットデータ取得
            else {
                for (const unit of unitList) {
                    if (unit.name === this.unitName) {
                        tmpUnitList.push(unit);
                        break;
                    }
                }
                // TODO 兵種データ取得
            }

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
