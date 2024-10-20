
const App = {
    data() {
        return {
            unitGroups: {},
            heisyuList: [],
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
        this.heisyuList.push("専用兵種");
        for (const heisyu of kihonHeisyuList) {
            this.heisyuList.push(heisyu.name);
        }
    },
    methods: {
        // todo
    }
};

Vue.createApp(App).mount("#app");
