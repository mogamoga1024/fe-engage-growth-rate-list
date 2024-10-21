
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
            return this.taisyou !== '全ユニット' && this.hyoujiNaiyou === '上限値';
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
                // todo
            }

            // 表示用にデータを加工する
            const result = [];
            for (const row of rowList) {
                let data = null;
                if (this.hyoujiNaiyou === "成長率") {
                    data = {name: row.name, ...row.seityouritu};
                }
                else if (this.hyoujiNaiyou === "上限値") {
                    data = {name: row.name, ...row.jougenti};
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
        // search() {
        //     let tmpUnitList = [];

        //     // 兵種データをすべて表示する場合はユニットのように扱う
        //     if (this.heisyuName === "すべて") {
        //         tmpUnitList = senyouHeisyuList.concat(kihonHeisyuList);
        //     }
        //     // すべてのユニットデータ取得
        //     else if (this.unitName === "すべて") {
        //         tmpUnitList = unitList;
        //     }
        //     // 個別のユニットデータ取得
        //     else {
        //         for (const unit of unitList) {
        //             if (unit.name === this.unitName) {
        //                 tmpUnitList.push(unit);
        //                 break;
        //             }
        //         }
        //         // TODO 兵種データ取得
        //     }

        //     // 表示用にデータを加工する
        //     const result = [];
        //     for (const unit of tmpUnitList) {
        //         let data = null;
        //         if (this.hyoujiNaiyou === "成長率") {
        //             data = {name: unit.name, ...unit.seityouritu};
        //         }
        //         else if (this.hyoujiNaiyou === "上限値") {
        //             data = {name: unit.name, ...unit.jougenti};
        //         }
        //         result.push(data);
        //     }
        //     if (this.sortKoumoku === "" || this.sortRule === "") {
        //         this.result = result;
        //     }
        //     else {
        //         this.result = result.sort((a, b) => {
        //             if (this.sortRule === "昇順") {
        //                 return a[this.sortKoumoku] - b[this.sortKoumoku];
        //             }
        //             else if (this.sortRule === "降順") {
        //                 return b[this.sortKoumoku] - a[this.sortKoumoku];
        //             }
        //             else {
        //                 return 0;
        //             }
        //         });
        //     }
        // },
    }
};

Vue.createApp(App).mount("#app");
