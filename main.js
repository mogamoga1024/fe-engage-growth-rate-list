
const App = {
    data() {
        return {
            unitGroups: {},
            heisyuKbn: "上級",
            needSenyou: false,
            heisyuNameList: [],
            taisyou: "全ユニット",
            unitName: "主人公",
            heisyuName: joukyuHeisyuList[0].name,
            dlc: "あり",
            hyoujiNaiyou: "成長率",
            sortKoumoku: "",
            sortRule: "",
            selectedRow: -1,
            selectedCol: -1,
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
        this.setupHeisyuNameList();
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
            this.updateHeisyuName();
            this.search();
        },
        onChangeUnit(e) {
            this.unitName = e.target.value;
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeHeisyuKbn(e) {
            this.heisyuKbn = e.target.value;
            this.setupHeisyuNameList();
            this.sortKoumoku = this.sortRule = "";
            this.search();
        },
        onChangeNeedSenyou(e) {
            this.needSenyou = e.target.value === "true";
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
        onClickCell(e) {
            const row = e.target.parentNode.sectionRowIndex;
            const col = e.target.cellIndex;
            if (this.selectedRow === row && this.selectedCol === col) {
                this.selectedRow = -1;
                this.selectedCol = -1;
            }
            else {
                this.selectedRow = row;
                this.selectedCol = col;
            }
        },

        setupHeisyuNameList() {
            let heisyuList = []; 
            
            if (this.heisyuKbn === "下級") {
                heisyuList = heisyuList.concat(kakyuHeisyuList);
            }
            else /*if (this.heisyuKbn === "上級")*/ {
                heisyuList = heisyuList.concat(joukyuHeisyuList);
            }
            heisyuList.push(thief);

            heisyuList.sort((a, b) => {
                if (a.isDlc && !b.isDlc) return 1;
                else if (!a.isDlc && b.isDlc) return -1;
                return 0;
            });

            const heisyuNameList = [];
            for (const heisyu of heisyuList) {
                heisyuNameList.push({
                    value: heisyu.name,
                    display: heisyu.name + (heisyu.isDlc ? "(DLC)" : "")
                });
            }
            this.heisyuNameList = heisyuNameList;

            this.updateHeisyuName();
        },
        updateHeisyuName() {
            if (this.taisyou === "1兵種×全ユニット") {
                if (this.heisyuKbn === "下級") {
                    if (kakyuHeisyuList.every(h => h.name !== this.heisyuName)) {
                        this.heisyuName = kakyuHeisyuList[0].name;
                    }
                }
                else /*if (this.heisyuKbn === "上級")*/ {
                    if (joukyuHeisyuList.every(h => h.name !== this.heisyuName)) {
                        this.heisyuName = joukyuHeisyuList[0].name;
                    }
                }
            }
        },
        search() {
            this.selectedRow = -1;
            this.selectedCol = -1;

            let rowList = [];
            let alpha = {
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
                if (this.heisyuKbn === "下級") {
                    if (this.needSenyou) {
                        rowList = senyouKakyuHeisyuList.concat(kakyuHeisyuList);
                    }
                    else {
                        rowList = Array.from(kakyuHeisyuList);
                    }
                }
                else /*if (this.heisyuKbn === "上級")*/ {
                    if (this.needSenyou) {
                        rowList = senyouJoukyuHeisyuList.concat(joukyuHeisyuList);
                    }
                    else {
                        rowList = Array.from(joukyuHeisyuList);
                    }
                }
                rowList.push(thief);
                if (this.dlc === "なし") {
                    rowList = rowList.filter(u => !u.isDlc);
                }
            }
            else if (this.taisyou === "1ユニット×全兵種") {
                for (const unit of unitList) {
                    if (this.unitName === unit.name) {
                        alpha = unit;
                        break;
                    }
                }
                if (this.heisyuKbn === "下級") {
                    rowList = senyouKakyuHeisyuList.filter(h => h.unit === alpha.name);
                    rowList = rowList.concat(kakyuHeisyuList);
                }
                else /*if (this.heisyuKbn === "上級")*/ {
                    rowList = senyouJoukyuHeisyuList.filter(h => h.unit === alpha.name);
                    rowList = rowList.concat(joukyuHeisyuList);
                }
                rowList.push(thief);
                if (this.dlc === "なし") {
                    rowList = rowList.filter(u => !u.isDlc);
                }
            }
            else /*if (this.taisyou === "1兵種×全ユニット")*/ {
                let heisyuList = [];
                if (this.heisyuKbn === "下級") {
                    heisyuList = Array.from(kakyuHeisyuList);
                }
                else /*if (this.heisyuKbn === "上級")*/ {
                    heisyuList = Array.from(joukyuHeisyuList);
                }
                heisyuList.push(thief);
                for (const heisyu of heisyuList) {
                    if (this.heisyuName === heisyu.name) {
                        alpha = heisyu;
                        break;
                    }
                }
                rowList = unitList;
                if (this.dlc === "なし") {
                    rowList = rowList.filter(u => u.kuni !== "DLC");
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
                if (this.taisyou === "1ユニット×全兵種" && this.unitName === "ジャン" && this.hyoujiNaiyou === "成長率") {
                    for (const koumoku of ["HP", "力", "魔力", "技", "速さ", "守備", "魔防", "幸運", "体格", "合計"]) {
                        data[koumoku] = row[key][koumoku] * 2 + alpha[key][koumoku];
                    }
                }
                else if (this.taisyou === "1兵種×全ユニット" && row.name === "ジャン" && this.hyoujiNaiyou === "成長率") {
                    for (const koumoku of ["HP", "力", "魔力", "技", "速さ", "守備", "魔防", "幸運", "体格", "合計"]) {
                        data[koumoku] = row[key][koumoku] + alpha[key][koumoku] * 2;
                    }
                }
                else {
                    for (const koumoku of ["HP", "力", "魔力", "技", "速さ", "守備", "魔防", "幸運", "体格", "合計"]) {
                        data[koumoku] = row[key][koumoku] + alpha[key][koumoku];
                    }
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
