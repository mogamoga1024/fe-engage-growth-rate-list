
const App = {
    data() {
        return {
            unitGroups: {},
            heisyuList: [
                "aaa",
                "bbb"
            ],
        };
    },
    created() {
        let groupName = "";
        for (const unit of unitList) {
            if (groupName !== unit.kuni) {
                groupName = unit.kuni;
                this.unitGroups[groupName] = [];
            }
            this.unitGroups[groupName].push(unit.name);
        }
    },
    methods: {
        // todo
    }
};

Vue.createApp(App).mount("#app");
