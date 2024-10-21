
const App = {
    data() {
        return {
            unitGroups: {},
            taisyou: "全ユニット",
            unitName: "主人公",
            heisyuName: "すべて",
            dlc: "あり",
            hyoujiNaiyou: "成長率",
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

        // 初回検索
        this.search();
    },
    computed: {
        useSougouryoku() {
            return this.taisyou !== "全ユニット" && this.hyoujiNaiyou === "上限値";
        }
    },
    methods: {
        onChangeTaisyou(e) {
            this.taisyou = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeUnit(e) {
            this.unitName = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeHeisyu(e) {
            this.heisyuName = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeDlc(e) {
            this.dlc = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeHyoujiNaiyou(e) {
            this.hyoujiNaiyou = e.target.value;
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
            let rowList = [];
            let targetUnit = {
                seityouritu: {HP: 0, 力: 0, 魔力: 0, 技: 0, 速さ: 0, 守備: 0, 魔防: 0, 幸運: 0, 体格: 0, 合計: 0},
                jougenti: {HP: 0, 力: 0, 魔力: 0, 技: 0, 速さ: 0, 守備: 0, 魔防: 0, 幸運: 0, 体格: 0, 合計: 0},
            };

            // 対象
            if (this.taisyou === "全ユニット") {
                rowList = unitList;
                if (this.dlc === "なし") {
                    rowList = rowList.filter(u => u.kuni !== "DLC");
                }
            }
            else if (this.taisyou === "全兵種") {
                if (this.heisyuName === "すべて") {
                    rowList = senyouHeisyuList.concat(kihonHeisyuList);
                }
                else /*if (this.heisyuName === "専門兵種以外")*/ {
                    rowList = kihonHeisyuList;
                }
                if (this.dlc === "なし") {
                    rowList = rowList.filter(u => !u.isDlc);
                }
            }
            else /*if (this.taisyou === "1ユニット×全兵種")*/ {
                for (const unit of unitList) {
                    if (this.unitName === unit.name) {
                        targetUnit = unit;
                        break;
                    }
                }
                rowList = senyouHeisyuList.filter(h => h.unit === targetUnit.name);
                rowList = rowList.concat(kihonHeisyuList);
                if (this.dlc === "なし") {
                    rowList = rowList.filter(u => !u.isDlc);
                }
            }

            // 表示用にデータを加工する
            const result = [];
            for (const row of rowList) {
                let data = null;
                let key = "";
                if (this.hyoujiNaiyou === "成長率") {
                    key = "seityouritu";
                    data = {name: row.name, ...row.seityouritu};
                }
                else /*if (this.hyoujiNaiyou === "上限値")*/ {
                    key = "jougenti";
                    data = {name: row.name, ...row.jougenti};
                }
                data = {name: row.name};
                for (const koumoku of ["HP", "力", "魔力", "技", "速さ", "守備", "魔防", "幸運", "体格", "合計"]) {
                    data[koumoku] = row[key][koumoku] + targetUnit[key][koumoku];
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
                    else /*if (this.sortRule === "降順")*/ {
                        return b[this.sortKoumoku] - a[this.sortKoumoku];
                    }
                });
            }
        },
    }
};

Vue.createApp(App).mount("#app");
